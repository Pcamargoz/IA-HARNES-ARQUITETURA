import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { fmText, orchDocs } from "./orchestration-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const getOrchestratorPolicy = defineTool({
  name: "get_orchestrator_policy",
  title: "Política do orquestrador",
  description:
    "Lê as políticas do Main Orchestrator na KB (10-Multi-Agent-Orchestration; notas type=policy/procedure por policy_area). " +
    "Sem 'section': lista as notas da área com suas seções (barato). Com 'section': devolve só aquela seção. " +
    "Áreas: orchestrator (padrão: prompt + política), bootstrap, delegation, handoff, verification, hitl, communication, context, governance, routing, execution.",
  inputSchema: {
    area: z.string().max(40).optional().describe("policy_area (padrão: orchestrator)."),
    section: z.string().max(120).optional().describe("Título (ou parte) da seção a ler, ex.: 'Seleção de agente', 'Prompt'."),
    max_chars: z.number().int().min(200).max(24000).optional(),
  },
  handler(ctx, a) {
    const area = normalize(a.area ?? "orchestrator").trim();
    const all = orchDocs(ctx, ["policy", "procedure"]);
    const docs = all.filter((d) => normalize(fmText(d, "policy_area") ?? "") === area);
    if (docs.length === 0) {
      const areas = [...new Set(all.map((d) => fmText(d, "policy_area") ?? "?"))].sort();
      throw new ToolInputError(`Nenhuma política com policy_area="${area}". Áreas disponíveis: ${areas.join(", ") || "(nenhuma)"}`);
    }
    if (a.section) {
      const want = normalize(a.section).trim();
      const d = docs.find((x) => x.headings.some((h) => normalize(h.text).includes(want)));
      if (!d) {
        const avail = docs.flatMap((x) => x.headings.filter((h) => h.level >= 2).map((h) => h.text)).slice(0, 40);
        throw new ToolInputError(`Seção "${a.section}" não encontrada na área ${area}. Seções: ${avail.join("; ")}`);
      }
      const h = d.headings.find((x) => normalize(x.text) === want) ?? d.headings.find((x) => normalize(x.text).includes(want))!;
      return readDocument(ctx, d.root, d.rel, { heading: h.text, maxChars: a.max_chars });
    }
    const out = [`Políticas da área "${area}" (${docs.length} nota(s)). Leia uma seção com section="<título>".`];
    for (const d of docs) {
      out.push("", `## ${d.title} — ${d.id}`, `status=${d.status ?? "?"} type=${d.type ?? "?"} versão=${fmText(d, "version") ?? "-"}`);
      for (const h of d.headings.filter((x) => x.level === 2)) out.push(`- ${h.text} (L${h.line})`);
    }
    return out.join("\n");
  },
});
