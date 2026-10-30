import { z } from "zod";
import { normalize } from "../search/text.js";
import { clampLimit, cut, readDocument } from "./helpers.js";
import { fmList, fmText, orchDocs, termScore, terms } from "./orchestration-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const findWorkflowTemplate = defineTool({
  name: "find_workflow_template",
  title: "Encontrar template de workflow",
  description:
    "Escolhe templates de workflow (type=workflow-template em 10-Multi-Agent-Orchestration) por task_type (feature, fix, research, review, docs) " +
    "e/ou pelo texto da tarefa (gatilhos). Devolve o ranking e as etapas do melhor. Sem correspondência: indica o workflow padrão do Harness.",
  inputSchema: {
    task: z.string().max(600).optional(),
    task_type: z.string().max(40).optional(),
    name: z.string().max(80).optional().describe("Lê um template específico pelo name."),
    limit: z.number().int().min(1).max(20).optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const docs = orchDocs(ctx, "workflow-template");
    if (docs.length === 0) throw new ToolInputError("Nenhum template de workflow na KB.");
    if (a.name) {
      const d = docs.find((x) => normalize(fmText(x, "name") ?? "") === normalize(a.name!));
      if (!d) throw new ToolInputError(`Template "${a.name}" não encontrado. Disponíveis: ${docs.map((x) => fmText(x, "name")).join(", ")}`);
      return readDocument(ctx, d.root, d.rel, {});
    }
    if (!a.task && !a.task_type) throw new ToolInputError("Informe task, task_type ou name.");
    const q = terms(a.task);
    const tt = a.task_type ? normalize(a.task_type).trim() : undefined;
    const rows = docs.map((d) => {
      const types = fmList(d, "task_types").map(normalize);
      const trig = fmList(d, "triggers");
      const s = termScore(q, `${trig.join(" ")} ${d.title} ${types.join(" ")}`);
      const typeHit = tt ? types.includes(tt) : false;
      return {
        name: fmText(d, "name") ?? d.title, title: d.title, task_types: types, status: d.status ?? "?",
        agents: fmList(d, "agents"), skills: fmList(d, "skills"), autonomy: fmText(d, "autonomy"),
        max_fix_attempts: fmText(d, "max_fix_attempts"), score: Math.round(((typeHit ? 1 : 0) + s.score) * 1000) / 1000, matched: s.matched, id: d.id,
      };
    }).filter((r) => r.score > 0).sort((x, y) => y.score - x.score || x.name.localeCompare(y.name));
    const shown = rows.slice(0, clampLimit(ctx, a.limit ?? 3));
    if (a.format === "json") return JSON.stringify({ templates: shown, fallback: rows.length ? null : "Harness Process/workflow.md" });
    if (shown.length === 0) return `Nenhum template casa com a tarefa. Use o workflow padrão do Harness (harness:Process/workflow.md: Understand → Specify → Plan → Execute → Validate → Deliver → Record).`;
    const out = [`${rows.length} template(s) compatível(is); melhor: ${shown[0].name} (score=${shown[0].score}).`];
    for (const r of shown) out.push(`- ${r.name} | tipos=${r.task_types.join(",")} autonomia=${r.autonomy} correções≤${r.max_fix_attempts} status=${r.status} score=${r.score} — agentes: ${r.agents.join(", ")} (${r.id})`);
    const best = docs.find((d) => d.id === shown[0].id)!;
    out.push("", readDocument(ctx, best.root, best.rel, { heading: "Etapas", includeFrontmatter: false }));
    out.push(`Skills sugeridas: ${shown[0].skills.join(", ") || "-"}.`);
    return out.join("\n");
  },
});
