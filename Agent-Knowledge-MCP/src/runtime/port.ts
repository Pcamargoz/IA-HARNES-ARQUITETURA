/**
 * Universal Agent Runtime — contrato do Port (Ports & Adapters).
 *
 * O Main Orchestrator fala só com `AgentPort`. Cada ferramenta (Claude Code, Codex, OpenCode,
 * Gemini CLI, delegação nativa, API) entra como um Adapter que implementa este contrato e
 * declara um `CapabilityManifest`. Nenhum adapter pode fingir execução: se o agente não foi
 * iniciado, o resultado é `not_executed` (ver `NoopAdapter`).
 *
 * Este módulo não importa nada do servidor MCP: pode ser extraído para um pacote próprio.
 */

export const RUNTIME_SCHEMA_VERSION = "akm.runtime.v1";

/** Capacidades que um adapter pode declarar. Ausente = não suportado (não presumir). */
export type Capability =
  | "headless"            // roda sem TTY/TUI
  | "structured_output"   // JSON / JSONL / stream-json
  | "streaming"           // eventos incrementais
  | "session_resume"      // retomar sessão por id
  | "cancel"              // cancelamento limpo (sinal ou API)
  | "timeout"             // limite de tempo aplicado pelo runtime
  | "mcp"                 // consome servidores MCP
  | "subagents"           // delega internamente
  | "sandbox"             // isolamento de escrita/execução
  | "permission_modes"    // modos de permissão configuráveis por chamada
  | "token_usage"         // reporta tokens
  | "cost_usd"            // reporta custo (estimado pelo cliente ou cobrado)
  | "parallel_safe"       // várias instâncias simultâneas sem conflito conhecido
  | "file_edit"           // pode alterar arquivos
  | "web";                // acesso à web

export type AdapterKind = "cli" | "native" | "api" | "local-process" | "test-double";

/** Status de implementação do adapter NESTE projeto (não da ferramenta). */
export type AdapterStatus = "implemented" | "spec-only" | "planned";

export interface CapabilityManifest {
  schema: typeof RUNTIME_SCHEMA_VERSION;
  adapter: string;                 // id estável: "claude-code", "codex", "shell-echo"...
  kind: AdapterKind;
  status: AdapterStatus;
  tool?: { command: string; min_version?: string; detected_version?: string };
  capabilities: Capability[];
  /** O que precisa existir antes de iniciar (CLI instalada, login, variável de ambiente...). */
  requirements: string[];
  /** Permissões que o adapter pede por padrão e o que fica proibido. */
  permissions: { default_mode: string; allowed: string[]; denied: string[] };
  limits: { default_timeout_ms: number; max_timeout_ms: number; max_prompt_bytes?: number; max_parallel?: number };
  /** Como cada métrica é obtida: "reported" (a ferramenta informa), "estimated" ou "unavailable". */
  metrics: { tokens: MetricSource; cost: MetricSource; latency: MetricSource };
  /** Fonte oficial e data em que o comportamento foi verificado. */
  verified?: { source: string; date: string; notes?: string };
}

export type MetricSource = "reported" | "estimated" | "unavailable";

/** Contexto controlado: só entra o que o orquestrador libera, com teto de tamanho. */
export interface ContextShare {
  /** Trechos já selecionados (ex.: seção de nota via MCP), nunca o cofre inteiro. */
  snippets: Array<{ source: string; text: string }>;
  /** Arquivos que o agente pode LER (caminhos relativos ao workdir). */
  readable_files?: string[];
  /** Arquivos que o agente pode ESCREVER (um escritor por arquivo). */
  writable_files?: string[];
  max_chars: number;
}

export interface AgentTask {
  task_id: string;
  prompt: string;
  workdir: string;
  context?: ContextShare;
  /** Modo de permissão pedido; o adapter traduz para a flag da ferramenta ou recusa. */
  permission_mode: "read-only" | "workspace-write";
  timeout_ms: number;
  model?: string;
  session_id?: string;          // retomar sessão, se o adapter declarar session_resume
  budget?: { max_turns?: number; max_cost_usd?: number };
}

export type ResultStatus = "done" | "failed" | "timeout" | "cancelled" | "not_executed";

export interface ExecutionMetrics {
  started_at: string;
  ended_at: string;
  latency_ms: number;
  exit_code: number | null;
  tokens_in?: number;
  tokens_out?: number;
  tokens_cached?: number;
  cost_usd?: number;
  /** De onde vieram tokens e custo; nunca misturar medido com estimado. */
  tokens_source: MetricSource;
  cost_source: MetricSource;
  stdout_bytes: number;
  stderr_bytes: number;
  context_chars_sent: number;
}

export interface AgentResult {
  schema: typeof RUNTIME_SCHEMA_VERSION;
  task_id: string;
  adapter: string;
  status: ResultStatus;
  output: string;
  structured?: unknown;
  session_id?: string;
  error?: RuntimeError;
  metrics: ExecutionMetrics;
}

export type RuntimeErrorCode =
  | "not_installed" | "not_authenticated" | "unsupported_capability" | "permission_denied"
  | "spawn_failed" | "timeout" | "cancelled" | "non_zero_exit" | "parse_error" | "context_too_large"
  | "not_executed";

export interface RuntimeError { code: RuntimeErrorCode; message: string; retryable: boolean }

export interface InitResult { ok: boolean; adapter: string; detail: string; error?: RuntimeError }

/** O Port. Todo adapter implementa exatamente isto. */
export interface AgentPort {
  readonly manifest: CapabilityManifest;
  /** Verifica requisitos (instalado, versão, login) SEM consumir cota. */
  init(): Promise<InitResult>;
  /** Envia a tarefa e devolve um handle; o resultado vem por `receive`. */
  send(task: AgentTask): Promise<{ handle: string }>;
  /** Espera o resultado (respeita o timeout da tarefa). */
  receive(handle: string): Promise<AgentResult>;
  /** Cancela uma execução em andamento. Idempotente. */
  cancel(handle: string, reason?: string): Promise<void>;
  /** Encerra recursos (processos, servidores). */
  dispose(): Promise<void>;
}

/** Erro de contrato com código estável. */
export class RuntimePortError extends Error {
  constructor(public readonly code: RuntimeErrorCode, message: string, public readonly retryable = false) {
    super(message);
    this.name = "RuntimePortError";
  }
}

/** Monta o texto de contexto respeitando o teto. Lança context_too_large em vez de truncar em silêncio. */
export function renderContext(ctx: ContextShare | undefined): string {
  if (!ctx || ctx.snippets.length === 0) return "";
  const parts = ctx.snippets.map((s) => `### ${s.source}\n${s.text.trim()}`);
  const out = `<contexto-controlado>\n${parts.join("\n\n")}\n</contexto-controlado>`;
  if (out.length > ctx.max_chars) {
    throw new RuntimePortError("context_too_large", `Contexto com ${out.length} caracteres excede o teto de ${ctx.max_chars}. Corte (prune) ou resuma antes de delegar.`);
  }
  return out;
}

/** Valida uma tarefa contra o manifest do adapter (capacidade, permissão, limites). */
export function checkTask(m: CapabilityManifest, t: AgentTask): RuntimeError | undefined {
  if (!t.prompt.trim()) return { code: "parse_error", message: "prompt vazio", retryable: false };
  if (t.timeout_ms <= 0 || t.timeout_ms > m.limits.max_timeout_ms) {
    return { code: "unsupported_capability", message: `timeout_ms fora de (0, ${m.limits.max_timeout_ms}]`, retryable: false };
  }
  if (t.permission_mode === "workspace-write" && !m.capabilities.includes("file_edit")) {
    return { code: "permission_denied", message: `${m.adapter} não declara file_edit`, retryable: false };
  }
  if (t.session_id && !m.capabilities.includes("session_resume")) {
    return { code: "unsupported_capability", message: `${m.adapter} não declara session_resume`, retryable: false };
  }
  if (m.limits.max_prompt_bytes && Buffer.byteLength(t.prompt) > m.limits.max_prompt_bytes) {
    return { code: "context_too_large", message: `prompt maior que ${m.limits.max_prompt_bytes} bytes`, retryable: false };
  }
  return undefined;
}
