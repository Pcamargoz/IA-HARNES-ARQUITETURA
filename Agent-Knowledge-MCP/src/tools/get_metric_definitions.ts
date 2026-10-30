import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { orchDocs, parseTable, readRaw } from "./orchestration-helpers.js";
import { runtimeDocs } from "./runtime-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const getMetricDefinitions = defineTool({
  name: "get_metric_definitions",
  title: "Definições de métricas de orquestração",
  description:
    "Lê os catálogos de métricas (type=metric-catalog em 10-Multi-Agent-Orchestration e 11-Universal-Agent-Runtime) em formato estruturado: id, nome, pergunta, unidade, fórmula/fonte, meta e coleta. " +
    "'metric' filtra por id ou parte do nome. include_telemetry_schema=true acrescenta os campos do evento JSONL (type=telemetry-schema).",
  inputSchema: {
    metric: z.string().max(80).optional(),
    include_telemetry_schema: z.boolean().optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const cats = [...orchDocs(ctx, "metric-catalog"), ...runtimeDocs(ctx, "metric-catalog")];
    if (cats.length === 0) throw new ToolInputError("Catálogo de métricas (type=metric-catalog) não encontrado.");
    const rows = cats.flatMap((d) => parseTable(readRaw(ctx, d), "id").map((r): Record<string, string> => ({ ...r, source: d.id })));
    let sel = rows;
    if (a.metric) {
      const w = normalize(a.metric).trim();
      sel = rows.filter((r) => normalize(r.id ?? "") === w);
      if (sel.length === 0) sel = rows.filter((r) => normalize(`${r.id} ${r.nome}`).includes(w));
      if (sel.length === 0) throw new ToolInputError(`Métrica "${a.metric}" não encontrada. Ids: ${rows.map((r) => r.id).join(", ")}`);
    }
    let schema: string | undefined;
    if (a.include_telemetry_schema) {
      const s = orchDocs(ctx, "telemetry-schema")[0];
      schema = s ? readDocument(ctx, s.root, s.rel, { heading: "Campos comuns", includeFrontmatter: false }) : "(schema de telemetria não encontrado)";
    }
    if (a.format === "json") return JSON.stringify({ metrics: sel, telemetry_schema: schema ?? null });
    const out = [`${sel.length} de ${rows.length} métrica(s):`];
    for (const r of sel) {
      out.push(`- ${r.id} — ${r.nome}: ${r.pergunta} | unidade=${r.unidade} | fórmula/fonte=${r.formula_fonte ?? ""} | meta=${r.meta} | coleta=${r.coleta}`);
    }
    if (schema) out.push("", schema);
    return out.join("\n");
  },
});
