import { z } from "zod";
import { normalize } from "../search/text.js";
import { readDocument } from "./helpers.js";
import { agentName, fmList, fmObj, fmText, orchDocs } from "./orchestration-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

const SECTIONS = { limites: "Limites", autonomia: "Autonomia", irreversiveis: "Irreversiveis", orcamentos: "Orcamentos", parada: "Parada" } as const;

export const getExecutionPolicy = defineTool({
  name: "get_execution_policy",
  title: "Política de execução",
  description:
    "Lê a política de execução (policy_area=execution): limites de tentativas, níveis de autonomia A0–A4, ações irreversíveis que exigem aprovação, " +
    "orçamentos e condições de parada. Com 'agent', acrescenta o orçamento, tier, autonomia e ferramentas daquele agente do registro.",
  inputSchema: {
    section: z.enum(["all", "limites", "autonomia", "irreversiveis", "orcamentos", "parada"]).optional().describe("Padrão: all."),
    agent: z.string().max(80).optional(),
    max_chars: z.number().int().min(200).max(24000).optional(),
  },
  handler(ctx, a) {
    const docs = orchDocs(ctx, "policy").filter((d) => normalize(fmText(d, "policy_area") ?? "") === "execution");
    if (docs.length === 0) throw new ToolInputError("Política de execução (policy_area=execution) não encontrada na KB.");
    const d = docs[0];
    const sec = a.section && a.section !== "all" ? SECTIONS[a.section] : undefined;
    const out = [readDocument(ctx, d.root, d.rel, { heading: sec, maxChars: a.max_chars })];
    if (a.agent) {
      const ag = orchDocs(ctx, "agent-spec").find((x) => normalize(agentName(x)) === normalize(a.agent!));
      if (!ag) throw new ToolInputError(`Agente "${a.agent}" não encontrado no registro.`);
      out.push("", `## Aplicação ao agente ${agentName(ag)} (status=${ag.status ?? "?"})`,
        `orçamento: ${JSON.stringify(fmObj(ag, "budget") ?? {})} | tier: ${fmText(ag, "tier") ?? "-"} | autonomia: ${fmText(ag, "autonomy") ?? "-"}`,
        `ferramentas: ${fmList(ag, "tools").join(", ") || "-"} | proibidas: ${fmList(ag, "disallowed_tools").join(", ") || "-"}`,
        ag.status !== "implemented" ? "Atenção: agente não implementado; executar exige aprovação do Pedro." : "Agente implementado.");
    }
    return out.join("\n");
  },
});
