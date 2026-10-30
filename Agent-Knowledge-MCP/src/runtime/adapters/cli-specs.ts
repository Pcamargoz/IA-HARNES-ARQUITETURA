import { RUNTIME_SCHEMA_VERSION, type AgentTask, type Capability, type CapabilityManifest } from "../port.js";
import { ProcessAdapter, type ProcessSpec } from "./process-adapter.js";

/**
 * Adapters de CLI de agentes. São "spec-only": a linha de comando e o parser estão escritos e
 * revisados contra a documentação oficial (fonte/data em `verified`), mas NENHUM foi executado
 * neste projeto, porque cada execução consome a conta/cota do Pedro. Rodar exige aprovação
 * explícita (scripts/delegation-experiment.mjs --approve).
 *
 * Todos começam em modo somente leitura. Credenciais nunca passam por aqui: cada CLI usa o
 * login que já existe nela.
 */

type Parsed = ReturnType<NonNullable<ProcessSpec["parse"]>>;

function lastJsonLine(stdout: string): Record<string, unknown> {
  const lines = stdout.trim().split("\n").filter((l) => l.trim().startsWith("{"));
  if (lines.length === 0) throw new Error("saída sem JSON");
  return JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
}
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

/** Claude Code `-p --output-format json`: objeto result com usage e total_cost_usd (estimativa do cliente). */
export function parseClaudeJson(stdout: string): Parsed {
  const j = lastJsonLine(stdout);
  const u = (j.usage ?? {}) as Record<string, unknown>;
  return {
    output: String(j.result ?? ""), structured: j.structured_output, session_id: j.session_id as string | undefined,
    tokens_in: num(u.input_tokens), tokens_out: num(u.output_tokens), tokens_cached: num(u.cache_read_input_tokens),
    cost_usd: num(j.total_cost_usd), is_error: j.is_error === true,
  };
}

/** Codex `exec --json`: JSONL; texto no último item agent_message; uso em turn.completed. */
export function parseCodexJsonl(stdout: string): Parsed {
  let output = ""; let session: string | undefined; let tin: number | undefined; let tout: number | undefined; let tc: number | undefined;
  let failed = false;
  for (const line of stdout.split("\n")) {
    if (!line.trim().startsWith("{")) continue;
    const e = JSON.parse(line) as Record<string, unknown>;
    if (e.type === "thread.started") session = e.thread_id as string;
    if (e.type === "item.completed") {
      const it = e.item as Record<string, unknown> | undefined;
      if (it?.type === "agent_message" && typeof it.text === "string") output = it.text;
    }
    if (e.type === "turn.completed") {
      const u = (e.usage ?? {}) as Record<string, unknown>;
      tin = (tin ?? 0) + (num(u.input_tokens) ?? 0);
      tout = (tout ?? 0) + (num(u.output_tokens) ?? 0) + (num(u.reasoning_output_tokens) ?? 0);
      tc = (tc ?? 0) + (num(u.cached_input_tokens) ?? 0);
    }
    if (e.type === "turn.failed" || e.type === "error") failed = true;
  }
  return { output, session_id: session, tokens_in: tin, tokens_out: tout, tokens_cached: tc, is_error: failed };
}

/** cursor-agent / qwen `json`: último objeto type=result com `result` (formato de uso não verificado). */
export function parseResultEnvelope(stdout: string): Parsed {
  const t = stdout.trim();
  let j: Record<string, unknown>;
  if (t.startsWith("[")) {
    const arr = JSON.parse(t) as Array<Record<string, unknown>>;
    j = [...arr].reverse().find((x) => x.type === "result") ?? arr[arr.length - 1] ?? {};
  } else j = lastJsonLine(t);
  const u = (j.usage ?? {}) as Record<string, unknown>;
  return {
    output: String(j.result ?? ""), session_id: j.session_id as string | undefined,
    tokens_in: num(u.input_tokens), tokens_out: num(u.output_tokens), is_error: j.is_error === true,
  };
}

/** Gemini CLI `--output-format json`: {response, stats, error}. */
export function parseGeminiJson(stdout: string): Parsed {
  const j = JSON.parse(stdout.trim()) as Record<string, unknown>;
  return { output: String(j.response ?? ""), structured: j.stats, is_error: Boolean(j.error) };
}

interface CliDef {
  id: string; command: string; caps: Capability[]; requirements: string[];
  args: (t: AgentTask, prompt: string) => string[]; parse?: (s: string) => Parsed;
  tokens: "reported" | "unavailable"; cost: "reported" | "unavailable";
  denied: string[]; source: string; notes?: string;
}

const model = (t: AgentTask, flag = "--model") => (t.model ? [flag, t.model] : []);

const DEFS: CliDef[] = [
  {
    id: "claude-code", command: "claude",
    caps: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp", "subagents", "permission_modes", "token_usage", "cost_usd", "file_edit", "web"],
    requirements: ["claude no PATH", "`claude auth status` → loggedIn=true (assinatura) ou ANTHROPIC_API_KEY no ambiente do processo"],
    args: (t, p) => ["-p", p, "--output-format", "json", "--permission-mode", "dontAsk", "--allowedTools", "Read,Grep,Glob",
      "--no-session-persistence", ...model(t), ...(t.budget?.max_cost_usd ? ["--max-budget-usd", String(t.budget.max_cost_usd)] : [])],
    parse: parseClaudeJson, tokens: "reported", cost: "reported",
    denied: ["Edit/Write/Bash (fora de --allowedTools)"],
    source: "https://code.claude.com/docs/en/headless",
    notes: "total_cost_usd é estimativa do cliente; com assinatura Pro o consumo real é cota, não fatura por token.",
  },
  {
    id: "codex", command: "codex",
    caps: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp", "sandbox", "permission_modes", "token_usage", "file_edit"],
    requirements: ["codex no PATH", "`codex login status` → logado (ChatGPT) ou CODEX_API_KEY"],
    args: (t, p) => ["exec", "--json", "--sandbox", "read-only", "--skip-git-repo-check", "--ephemeral", "-C", t.workdir, ...model(t, "-m"), p],
    parse: parseCodexJsonl, tokens: "reported", cost: "unavailable",
    denied: ["escrita fora do sandbox read-only"],
    source: "https://developers.openai.com/codex/noninteractive",
    notes: "Não reporta custo em USD; custo = tokens × preço (estimado) ou cota da assinatura.",
  },
  {
    id: "opencode", command: "opencode",
    caps: ["headless", "structured_output", "session_resume", "cancel", "timeout", "mcp", "permission_modes", "file_edit"],
    requirements: ["opencode no PATH", "provedor autenticado (`opencode auth list`) ou modelo gratuito configurado"],
    args: (t, p) => ["run", "--format", "json", ...model(t, "-m"), p], tokens: "unavailable", cost: "unavailable",
    denied: ["depende de OPENCODE_PERMISSION / config (não verificado)"],
    source: "https://opencode.ai/docs/cli",
    notes: "Formato dos eventos JSON não verificado; uso/custo via `opencode stats` depois da execução.",
  },
  {
    id: "gemini-cli", command: "gemini",
    caps: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp", "permission_modes", "token_usage", "file_edit", "web"],
    requirements: ["gemini no PATH (NÃO instalado neste Mac)", "login Google/API key"],
    args: (t, p) => ["-p", p, "--output-format", "json", ...model(t, "-m")], parse: parseGeminiJson, tokens: "reported", cost: "unavailable",
    denied: ["ferramentas que exigem aprovação (sem --yolo)"],
    source: "https://geminicli.com/docs/cli/headless",
    notes: "Docs (atualizadas 10/03/2026) avisam que contas gratuitas/Google One migraram para Antigravity CLI em 18/06/2026.",
  },
  {
    id: "qwen-code", command: "qwen",
    caps: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp", "sandbox", "permission_modes", "token_usage", "file_edit"],
    requirements: ["qwen no PATH", "autenticação configurada (não verificada neste Mac)"],
    args: (t, p) => ["-p", p, "-o", "json", "--approval-mode", "plan", "--max-session-turns", String(t.budget?.max_turns ?? 5), ...model(t, "-m")],
    parse: parseResultEnvelope, tokens: "reported", cost: "unavailable",
    denied: ["edições (approval-mode plan)"],
    source: "https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/",
    notes: "Exit 53 = limite de turnos; 55 = orçamento (--max-wall-time/--max-tool-calls, versão instalada não verificada).",
  },
  {
    id: "cursor-agent", command: "cursor-agent",
    caps: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp", "file_edit"],
    requirements: ["cursor-agent no PATH", "`cursor-agent status` → logado ou CURSOR_API_KEY"],
    args: (t, p) => ["-p", "--output-format", "json", ...model(t), p], parse: parseResultEnvelope, tokens: "unavailable", cost: "unavailable",
    denied: ["alterar arquivos (sem --force só propõe)"],
    source: "https://cursor.com/docs/cli/headless",
    notes: "Campos de uso no JSON não documentados; tokens ficam 'unavailable'.",
  },
  {
    id: "ollama-local", command: "ollama",
    caps: ["headless", "cancel", "timeout", "parallel_safe"],
    requirements: ["ollama no PATH com servidor ativo", "modelo local baixado (ex.: qwen2.5:3b)"],
    args: (t, p) => ["run", t.model ?? "qwen2.5:3b", p], tokens: "unavailable", cost: "unavailable",
    denied: ["ferramentas (é só um modelo, não um agente com tools)"],
    source: "ollama --help (local)",
    notes: "Sem conta/cota: custo monetário zero, custo de CPU local. Não é agente com ferramentas.",
  },
];

export function cliManifest(d: CliDef): CapabilityManifest {
  return {
    schema: RUNTIME_SCHEMA_VERSION, adapter: d.id, kind: "cli", status: "spec-only",
    tool: { command: d.command }, capabilities: d.caps, requirements: d.requirements,
    permissions: { default_mode: "read-only", allowed: ["ler arquivos do workdir"], denied: d.denied },
    limits: { default_timeout_ms: 120_000, max_timeout_ms: 1_800_000, max_prompt_bytes: 10_000_000 },
    metrics: { tokens: d.tokens, cost: d.cost, latency: "reported" },
    verified: { source: d.source, date: "2026-10-29", notes: d.notes },
  };
}

export const CLI_ADAPTER_IDS = DEFS.map((d) => d.id);
export const CLI_MANIFESTS: CapabilityManifest[] = DEFS.map(cliManifest);

/** Monta o argv sem executar nada (usado no plano do experimento e nos testes). */
export function buildCliCommand(id: string, task: AgentTask): { command: string; args: string[] } {
  const d = DEFS.find((x) => x.id === id);
  if (!d) throw new Error(`adapter de CLI desconhecido: ${id}. Conhecidos: ${CLI_ADAPTER_IDS.join(", ")}`);
  return { command: d.command, args: d.args(task, task.prompt) };
}

/** Cria o adapter executável. Só use com aprovação: executar consome a conta da ferramenta. */
export function createCliAdapter(id: string): ProcessAdapter {
  const d = DEFS.find((x) => x.id === id);
  if (!d) throw new Error(`adapter de CLI desconhecido: ${id}`);
  return new ProcessAdapter(cliManifest(d), { command: d.command, args: d.args, parse: d.parse, versionArgs: ["--version"] });
}
