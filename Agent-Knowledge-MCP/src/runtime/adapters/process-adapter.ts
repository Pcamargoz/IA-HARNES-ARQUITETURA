import { spawn, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  RUNTIME_SCHEMA_VERSION, checkTask, renderContext,
  type AgentPort, type AgentResult, type AgentTask, type CapabilityManifest, type ExecutionMetrics,
  type InitResult, type MetricSource, type RuntimeError,
} from "../port.js";

/** Como um adapter de processo monta a linha de comando e lê a saída. */
export interface ProcessSpec {
  command: string;
  /** argv para a tarefa; o prompt vai por argv ou stdin (stdinPrompt=true). */
  args(task: AgentTask, prompt: string): string[];
  stdinPrompt?: boolean;
  /** Comando barato e sem cota para checar instalação (ex.: --version). */
  versionArgs?: string[];
  /** Extrai texto, sessão e uso da saída. Sem parser = stdout bruto, sem tokens. */
  parse?(stdout: string): Partial<Pick<AgentResult, "output" | "structured" | "session_id">> & {
    tokens_in?: number; tokens_out?: number; tokens_cached?: number; cost_usd?: number; is_error?: boolean;
  };
  /** Variáveis extras; nunca credenciais (o adapter herda o login já existente da ferramenta). */
  env?: Record<string, string>;
}

interface Running {
  child?: ChildProcess;
  promise: Promise<AgentResult>;
  cancel: (reason: string) => void;
}

/**
 * Adapter genérico baseado em processo filho (spawn sem shell). Aplica timeout, cancelamento
 * (SIGTERM e, após 2 s, SIGKILL), captura stdout/stderr e mede latência. Base de shell-echo e dos
 * adapters de CLI. Não interpreta o resultado além do `parse` declarado.
 */
export class ProcessAdapter implements AgentPort {
  private runs = new Map<string, Running>();
  constructor(public readonly manifest: CapabilityManifest, private readonly spec: ProcessSpec) {}

  async init(): Promise<InitResult> {
    const args = this.spec.versionArgs ?? ["--version"];
    return new Promise((resolve) => {
      let out = "";
      let child: ChildProcess;
      try {
        child = spawn(this.spec.command, args, { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...this.spec.env } });
      } catch (e) {
        resolve({ ok: false, adapter: this.manifest.adapter, detail: String(e), error: { code: "not_installed", message: String(e), retryable: false } });
        return;
      }
      const t = setTimeout(() => child.kill("SIGKILL"), 10_000);
      child.stdout?.on("data", (d: Buffer) => { out += d.toString(); });
      child.on("error", (e) => {
        clearTimeout(t);
        resolve({ ok: false, adapter: this.manifest.adapter, detail: e.message, error: { code: "not_installed", message: e.message, retryable: false } });
      });
      child.on("close", (code) => {
        clearTimeout(t);
        const first = out.trim().split("\n")[0]?.slice(0, 120) ?? "";
        resolve(code === 0
          ? { ok: true, adapter: this.manifest.adapter, detail: first }
          : { ok: false, adapter: this.manifest.adapter, detail: `exit ${code}`, error: { code: "spawn_failed", message: `versão retornou ${code}`, retryable: false } });
      });
    });
  }

  async send(task: AgentTask): Promise<{ handle: string }> {
    const handle = randomUUID();
    const bad = checkTask(this.manifest, task);
    let ctxText = "";
    let ctxErr: RuntimeError | undefined;
    try { ctxText = renderContext(task.context); } catch (e) {
      ctxErr = { code: "context_too_large", message: (e as Error).message, retryable: false };
    }
    const err = bad ?? ctxErr;
    if (err) {
      const now = new Date().toISOString();
      const r = this.result(task, "failed", "", now, Date.now(), null, 0, 0, ctxText.length, err);
      this.runs.set(handle, { promise: Promise.resolve(r), cancel: () => undefined });
      return { handle };
    }
    const prompt = ctxText ? `${ctxText}\n\n${task.prompt}` : task.prompt;
    const startedIso = new Date().toISOString();
    const t0 = Date.now();
    let child: ChildProcess;
    let settled = false;
    let cancelReason: string | undefined;
    let timedOut = false;
    const promise = new Promise<AgentResult>((resolve) => {
      let stdout = "";
      let stderr = "";
      const finish = (r: AgentResult) => { if (!settled) { settled = true; resolve(r); } };
      try {
        child = spawn(this.spec.command, this.spec.args(task, prompt), {
          cwd: task.workdir,
          stdio: [this.spec.stdinPrompt ? "pipe" : "ignore", "pipe", "pipe"],
          env: { ...process.env, ...this.spec.env },
        });
      } catch (e) {
        finish(this.result(task, "failed", "", startedIso, t0, null, 0, 0, ctxText.length,
          { code: "spawn_failed", message: String(e), retryable: false }));
        return;
      }
      if (this.spec.stdinPrompt) { child.stdin?.end(prompt); }
      child.stdout?.on("data", (d: Buffer) => { stdout += d.toString(); });
      child.stderr?.on("data", (d: Buffer) => { stderr += d.toString(); });
      const timer = setTimeout(() => { timedOut = true; this.kill(child); }, task.timeout_ms);
      child.on("error", (e) => {
        clearTimeout(timer);
        const code = (e as NodeJS.ErrnoException).code === "ENOENT" ? "not_installed" : "spawn_failed";
        finish(this.result(task, "failed", "", startedIso, t0, null, 0, Buffer.byteLength(stderr), ctxText.length,
          { code, message: e.message, retryable: false }));
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        const ob = Buffer.byteLength(stdout);
        const eb = Buffer.byteLength(stderr);
        if (timedOut) {
          finish(this.result(task, "timeout", stdout, startedIso, t0, code, ob, eb, ctxText.length,
            { code: "timeout", message: `excedeu ${task.timeout_ms} ms`, retryable: true }));
          return;
        }
        if (cancelReason !== undefined) {
          finish(this.result(task, "cancelled", stdout, startedIso, t0, code, ob, eb, ctxText.length,
            { code: "cancelled", message: cancelReason || "cancelado", retryable: false }));
          return;
        }
        let parsed: ReturnType<NonNullable<ProcessSpec["parse"]>> = {};
        if (this.spec.parse && code === 0) {
          try { parsed = this.spec.parse(stdout); } catch (e) {
            finish(this.result(task, "failed", stdout, startedIso, t0, code, ob, eb, ctxText.length,
              { code: "parse_error", message: (e as Error).message, retryable: true }));
            return;
          }
        }
        const failed = code !== 0 || parsed.is_error === true;
        const r = this.result(task, failed ? "failed" : "done", parsed.output ?? stdout, startedIso, t0, code, ob, eb, ctxText.length,
          failed ? { code: "non_zero_exit", message: `exit ${code}${stderr ? `: ${stderr.trim().slice(0, 300)}` : ""}`, retryable: true } : undefined);
        r.structured = parsed.structured;
        r.session_id = parsed.session_id;
        const tok: MetricSource = parsed.tokens_in !== undefined || parsed.tokens_out !== undefined ? "reported" : "unavailable";
        r.metrics = { ...r.metrics, tokens_in: parsed.tokens_in, tokens_out: parsed.tokens_out, tokens_cached: parsed.tokens_cached,
          cost_usd: parsed.cost_usd, tokens_source: tok, cost_source: parsed.cost_usd !== undefined ? "reported" : "unavailable" };
        finish(r);
      });
    });
    this.runs.set(handle, {
      get child() { return child; },
      promise,
      cancel: (reason: string) => { if (!settled && child) { cancelReason = reason; this.kill(child); } },
    });
    return { handle };
  }

  async receive(handle: string): Promise<AgentResult> {
    const r = this.runs.get(handle);
    if (!r) throw new Error(`handle desconhecido: ${handle}`);
    try { return await r.promise; } finally { this.runs.delete(handle); }
  }

  async cancel(handle: string, reason = "cancelado pelo orquestrador"): Promise<void> {
    this.runs.get(handle)?.cancel(reason);
  }

  async dispose(): Promise<void> {
    for (const h of [...this.runs.keys()]) await this.cancel(h, "dispose");
  }

  private kill(child: ChildProcess) {
    if (child.exitCode !== null || child.signalCode !== null) return;
    child.kill("SIGTERM");
    const k = setTimeout(() => { if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL"); }, 2000);
    k.unref();
  }

  private result(task: AgentTask, status: AgentResult["status"], output: string, startedIso: string, t0: number,
    exit: number | null, ob: number, eb: number, ctxChars: number, error?: RuntimeError): AgentResult {
    const metrics: ExecutionMetrics = {
      started_at: startedIso, ended_at: new Date().toISOString(), latency_ms: Date.now() - t0, exit_code: exit,
      tokens_source: "unavailable", cost_source: "unavailable", stdout_bytes: ob, stderr_bytes: eb, context_chars_sent: ctxChars,
    };
    return { schema: RUNTIME_SCHEMA_VERSION, task_id: task.task_id, adapter: this.manifest.adapter, status, output, error, metrics };
  }
}
