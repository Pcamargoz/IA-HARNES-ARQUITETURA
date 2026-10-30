import { z } from "zod";
import { normalize } from "../search/text.js";
import { clampLimit, cut } from "./helpers.js";
import { agentName, fmList, fmObj, fmText, orchDocs, termScore, terms } from "./orchestration-helpers.js";
import { defineTool } from "./types.js";

const ORDER: Record<string, number> = { implemented: 0, planned: 1, conceptual: 2 };

export const listRegisteredAgents = defineTool({
  name: "list_registered_agents",
  title: "Listar agentes registrados",
  description:
    "Lista o registro de agentes (notas type=agent-spec em 10-Multi-Agent-Orchestration) só com metadados: nome, status " +
    "(implemented | planned | conceptual), papel, tier, autonomia, descrição. Filtros: status, role, query (termos da tarefa; ordena por aderência). " +
    "Só agentes 'implemented' existem de fato no Harness.",
  inputSchema: {
    status: z.enum(["all", "implemented", "planned", "conceptual"]).optional().describe("Padrão: all."),
    role: z.string().max(40).optional().describe("orchestrator, worker, reviewer, verifier, researcher, planner, specialist."),
    query: z.string().max(400).optional().describe("Texto da tarefa; ordena por fração de termos em comum."),
    limit: z.number().int().min(1).max(100).optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const q = terms(a.query);
    let docs = orchDocs(ctx, "agent-spec");
    if (a.status && a.status !== "all") docs = docs.filter((d) => normalize(d.status ?? "") === a.status);
    if (a.role) docs = docs.filter((d) => normalize(fmText(d, "role") ?? "") === normalize(a.role!));
    const rows = docs.map((d) => {
      const hay = [agentName(d), fmText(d, "description"), fmText(d, "use_when"), d.tags.join(" "), fmList(d, "skills").join(" ")].join(" ");
      const s = termScore(q, hay);
      return {
        name: agentName(d), status: d.status ?? "?", role: fmText(d, "role") ?? "?", tier: fmText(d, "tier") ?? "?",
        autonomy: fmText(d, "autonomy") ?? "?", level: fmText(d, "level") ?? "?", description: fmText(d, "description") ?? "",
        use_when: fmText(d, "use_when") ?? "", budget: fmObj(d, "budget") ?? null, id: d.id, score: s.score, matched: s.matched,
      };
    });
    rows.sort((x, y) => (q.length ? y.score - x.score : 0) || (ORDER[x.status] ?? 9) - (ORDER[y.status] ?? 9) || x.name.localeCompare(y.name));
    const limit = Math.max(clampLimit(ctx, a.limit), a.limit ?? 50);
    const shown = rows.slice(0, limit);
    if (a.format === "json") return JSON.stringify(shown);
    const counts = rows.reduce<Record<string, number>>((m, r) => { m[r.status] = (m[r.status] ?? 0) + 1; return m; }, {});
    const out = [`${rows.length} agente(s) [${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(" ")}]${a.query ? ` ordenados por aderência a "${cut(a.query, 60)}"` : ""}:`];
    for (const r of shown) {
      out.push(`- ${r.name} | status=${r.status} role=${r.role} tier=${r.tier} autonomia=${r.autonomy}${q.length ? ` score=${r.score}` : ""} — ${cut(r.description, 140)} (${r.id})`);
    }
    if (rows.length > shown.length) out.push(`(+${rows.length - shown.length}; aumente limit)`);
    out.push("Detalhes: get_agent_specification name=<nome>. Use só agentes implemented; planned/conceptual exigem aprovação.");
    return out.join("\n");
  },
});
