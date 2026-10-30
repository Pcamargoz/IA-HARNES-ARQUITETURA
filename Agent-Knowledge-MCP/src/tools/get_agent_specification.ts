import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { agentName, fmList, fmObj, fmText, orchDocs } from "./orchestration-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const getAgentSpecification = defineTool({
  name: "get_agent_specification",
  title: "Especificação de agente",
  description:
    "Devolve a especificação de um agente do registro (type=agent-spec): status, papel, tier, autonomia, ferramentas permitidas/proibidas, " +
    "skills, orçamento, evidência do status e o corpo da nota (ou uma seção com 'heading'). format=json devolve só os campos estruturados.",
  inputSchema: {
    name: z.string().min(1).max(80).describe("Nome do agente (campo name), ex.: main-agent."),
    heading: z.string().max(120).optional(),
    include_body: z.boolean().optional().describe("Padrão: true (ignorado em format=json)."),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const docs = orchDocs(ctx, "agent-spec");
    const want = normalize(a.name).trim();
    const d = docs.find((x) => normalize(agentName(x)) === want) ?? docs.find((x) => normalize(x.title) === want);
    if (!d) throw new ToolInputError(`Agente "${a.name}" não encontrado. Registrados: ${docs.map(agentName).sort().join(", ") || "(nenhum)"}`);
    const spec = {
      name: agentName(d), title: d.title, status: d.status ?? "?", role: fmText(d, "role"), tier: fmText(d, "tier"),
      autonomy: fmText(d, "autonomy"), level: fmText(d, "level"), description: fmText(d, "description"),
      use_when: fmText(d, "use_when"), avoid_when: fmText(d, "avoid_when"), tools: fmList(d, "tools"),
      disallowed_tools: fmList(d, "disallowed_tools"), skills: fmList(d, "skills"), budget: fmObj(d, "budget") ?? null,
      harness_ref: fmText(d, "harness_ref"), evidence: fmText(d, "evidence"), version: fmText(d, "version"), id: d.id,
    };
    if (a.format === "json") return JSON.stringify(spec);
    const out = [
      `Agente ${spec.name} — status=${spec.status}${spec.status !== "implemented" ? " (NÃO executável sem aprovação)" : ""}`,
      `papel=${spec.role} tier=${spec.tier} autonomia=${spec.autonomy} nível=${spec.level} versão=${spec.version ?? "-"}`,
      `ferramentas: ${spec.tools.join(", ") || "-"} | proibidas: ${spec.disallowed_tools.join(", ") || "-"}`,
      `skills: ${spec.skills.join(", ") || "-"}`,
      `orçamento: ${spec.budget ? JSON.stringify(spec.budget) : "-"}`,
      `use quando: ${spec.use_when ?? "-"} | não use para: ${spec.avoid_when ?? "-"}`,
      `evidência: ${spec.evidence ?? "-"}`,
      `fonte Harness: ${spec.harness_ref ?? "-"}`,
    ];
    if (a.include_body !== false || a.heading) {
      out.push("", readDocument(ctx, d.root, d.rel, { heading: a.heading, includeFrontmatter: false }));
    }
    return out.join("\n");
  },
});
