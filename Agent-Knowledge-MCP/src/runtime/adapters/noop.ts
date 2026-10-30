import { randomUUID } from "node:crypto";
import { RUNTIME_SCHEMA_VERSION, type AgentPort, type AgentResult, type AgentTask, type CapabilityManifest, type InitResult } from "../port.js";

/**
 * noop: test-double ROTULADO. Não inicia processo nem modelo e devolve sempre
 * status=not_executed. Existe para planos/dry-run: deixa explícito que nada rodou,
 * em vez de inventar uma resposta.
 */
export const NOOP_MANIFEST: CapabilityManifest = {
  schema: RUNTIME_SCHEMA_VERSION,
  adapter: "noop",
  kind: "test-double",
  status: "implemented",
  capabilities: ["headless", "parallel_safe"],
  requirements: [],
  permissions: { default_mode: "none", allowed: [], denied: ["tudo"] },
  limits: { default_timeout_ms: 1, max_timeout_ms: 3_600_000 },
  metrics: { tokens: "unavailable", cost: "unavailable", latency: "unavailable" },
};

export class NoopAdapter implements AgentPort {
  readonly manifest = NOOP_MANIFEST;
  private tasks = new Map<string, AgentTask>();
  async init(): Promise<InitResult> { return { ok: true, adapter: "noop", detail: "test-double: nunca executa" }; }
  async send(task: AgentTask) { const handle = randomUUID(); this.tasks.set(handle, task); return { handle }; }
  async receive(handle: string): Promise<AgentResult> {
    const t = this.tasks.get(handle);
    if (!t) throw new Error(`handle desconhecido: ${handle}`);
    this.tasks.delete(handle);
    const now = new Date().toISOString();
    return {
      schema: RUNTIME_SCHEMA_VERSION, task_id: t.task_id, adapter: "noop", status: "not_executed", output: "",
      error: { code: "not_executed", message: "noop: nenhum agente foi iniciado", retryable: false },
      metrics: { started_at: now, ended_at: now, latency_ms: 0, exit_code: null, tokens_source: "unavailable", cost_source: "unavailable",
        stdout_bytes: 0, stderr_bytes: 0, context_chars_sent: 0 },
    };
  }
  async cancel(handle: string) { this.tasks.delete(handle); }
  async dispose() { this.tasks.clear(); }
}
