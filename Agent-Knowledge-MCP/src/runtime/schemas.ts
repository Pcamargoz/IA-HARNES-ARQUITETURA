/**
 * JSON Schemas (draft 2020-12) do contrato. Fonte única: notas da KB citam estes objetos.
 * `validate` é um validador mínimo (type/required/enum/properties/items/minimum) só para testes e
 * para o experimento; não substitui um validador completo.
 */
export type JsonSchema = {
  $id?: string; type?: string | string[]; required?: string[]; enum?: unknown[];
  properties?: Record<string, JsonSchema>; items?: JsonSchema; minimum?: number; additionalProperties?: boolean; description?: string;
};

const METRIC_SOURCE: JsonSchema = { type: "string", enum: ["reported", "estimated", "unavailable"] };

export const AGENT_TASK_SCHEMA: JsonSchema = {
  $id: "akm.runtime.v1/agent-task", type: "object",
  required: ["task_id", "prompt", "workdir", "permission_mode", "timeout_ms"],
  properties: {
    task_id: { type: "string" }, prompt: { type: "string" }, workdir: { type: "string" },
    permission_mode: { type: "string", enum: ["read-only", "workspace-write"] },
    timeout_ms: { type: "integer", minimum: 1 }, model: { type: "string" }, session_id: { type: "string" },
    context: { type: "object", required: ["snippets", "max_chars"], properties: {
      snippets: { type: "array", items: { type: "object", required: ["source", "text"] } }, max_chars: { type: "integer", minimum: 1 } } },
    budget: { type: "object", properties: { max_turns: { type: "integer", minimum: 1 }, max_cost_usd: { type: "number", minimum: 0 } } },
  },
};

export const AGENT_RESULT_SCHEMA: JsonSchema = {
  $id: "akm.runtime.v1/agent-result", type: "object",
  required: ["schema", "task_id", "adapter", "status", "output", "metrics"],
  properties: {
    schema: { type: "string", enum: ["akm.runtime.v1"] }, task_id: { type: "string" }, adapter: { type: "string" },
    status: { type: "string", enum: ["done", "failed", "timeout", "cancelled", "not_executed"] },
    output: { type: "string" }, session_id: { type: "string" },
    error: { type: "object", required: ["code", "message", "retryable"], properties: { code: { type: "string" }, message: { type: "string" }, retryable: { type: "boolean" } } },
    metrics: { type: "object", required: ["started_at", "ended_at", "latency_ms", "exit_code", "tokens_source", "cost_source", "stdout_bytes", "stderr_bytes", "context_chars_sent"],
      properties: { latency_ms: { type: "integer", minimum: 0 }, exit_code: { type: ["integer", "null"] }, tokens_in: { type: "integer", minimum: 0 },
        tokens_out: { type: "integer", minimum: 0 }, cost_usd: { type: "number", minimum: 0 }, tokens_source: METRIC_SOURCE, cost_source: METRIC_SOURCE } },
  },
};

export const CAPABILITY_MANIFEST_SCHEMA: JsonSchema = {
  $id: "akm.runtime.v1/capability-manifest", type: "object",
  required: ["schema", "adapter", "kind", "status", "capabilities", "requirements", "permissions", "limits", "metrics"],
  properties: {
    schema: { type: "string", enum: ["akm.runtime.v1"] }, adapter: { type: "string" },
    kind: { type: "string", enum: ["cli", "native", "api", "local-process", "test-double"] },
    status: { type: "string", enum: ["implemented", "spec-only", "planned"] },
    capabilities: { type: "array", items: { type: "string", enum: ["headless", "structured_output", "streaming", "session_resume", "cancel", "timeout", "mcp",
      "subagents", "sandbox", "permission_modes", "token_usage", "cost_usd", "parallel_safe", "file_edit", "web"] } },
    requirements: { type: "array", items: { type: "string" } },
    permissions: { type: "object", required: ["default_mode", "allowed", "denied"] },
    limits: { type: "object", required: ["default_timeout_ms", "max_timeout_ms"] },
    metrics: { type: "object", required: ["tokens", "cost", "latency"], properties: { tokens: METRIC_SOURCE, cost: METRIC_SOURCE, latency: METRIC_SOURCE } },
  },
};

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

/** Retorna a lista de violações (vazia = válido). */
export function validate(schema: JsonSchema, v: unknown, at = "$"): string[] {
  const errs: string[] = [];
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const t = typeOf(v);
    if (!types.includes(t) && !(t === "integer" && types.includes("number"))) return [`${at}: esperado ${types.join("|")}, veio ${t}`];
  }
  if (schema.enum && !schema.enum.includes(v)) errs.push(`${at}: valor fora de ${JSON.stringify(schema.enum)}`);
  if (typeof v === "number" && schema.minimum !== undefined && v < schema.minimum) errs.push(`${at}: < ${schema.minimum}`);
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    for (const r of schema.required ?? []) if (o[r] === undefined) errs.push(`${at}.${r}: obrigatório`);
    for (const [k, s] of Object.entries(schema.properties ?? {})) if (o[k] !== undefined) errs.push(...validate(s, o[k], `${at}.${k}`));
  }
  if (Array.isArray(v) && schema.items) v.forEach((x, i) => errs.push(...validate(schema.items!, x, `${at}[${i}]`)));
  return errs;
}
