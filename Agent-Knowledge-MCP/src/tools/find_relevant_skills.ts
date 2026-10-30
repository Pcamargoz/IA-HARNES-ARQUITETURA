import { z } from "zod";
import { normalize } from "../search/text.js";
import { clampLimit, cut, fmString, kbPrefix } from "./helpers.js";
import { KB_AREAS } from "./kb-layout.js";
import { agentName, fmList, orchDocs, termScore, terms } from "./orchestration-helpers.js";
import { defineTool, ToolInputError } from "./types.js";

export const findRelevantSkills = defineTool({
  name: "find_relevant_skills",
  title: "Encontrar skills relevantes para uma tarefa",
  description:
    "Dada a descrição de uma tarefa, ordena (sem LLM, por termos em comum) as skills existentes nas raízes lidas: arquivos SKILL.md " +
    "e pacotes de skills da KB (02-Agent-Skills). Mostra quais agentes do registro citam cada skill e lista skills citadas por agentes " +
    "que NÃO foram encontradas como SKILL.md (esperadas, não instaladas nas raízes lidas).",
  inputSchema: {
    task: z.string().min(2).max(600).describe("Descrição da tarefa."),
    agent: z.string().max(80).optional().describe("Restringe às skills citadas por este agente (e às encontradas para a tarefa)."),
    limit: z.number().int().min(1).max(50).optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const q = terms(a.task);
    if (q.length === 0) throw new ToolInputError("A tarefa não tem termos pesquisáveis.");
    const agents = orchDocs(ctx, "agent-spec");
    const citedBy = new Map<string, string[]>();
    for (const d of agents) for (const s of fmList(d, "skills")) {
      const k = normalize(s); citedBy.set(k, [...(citedBy.get(k) ?? []), agentName(d)]);
    }
    let agentSkills: Set<string> | undefined;
    if (a.agent) {
      const ag = agents.find((d) => normalize(agentName(d)) === normalize(a.agent!));
      if (!ag) throw new ToolInputError(`Agente "${a.agent}" não encontrado no registro.`);
      agentSkills = new Set(fmList(ag, "skills").map(normalize));
    }
    const pkgPrefix = kbPrefix(ctx, KB_AREAS.skills) + "/";
    const found = new Set<string>();
    const rows: Array<{ kind: string; name: string; description: string; id: string; score: number; matched: string[]; cited_by: string[] }> = [];
    for (const d of ctx.index.all()) {
      const isSkill = /(^|\/)SKILL\.md$/i.test(d.rel);
      const isPkg = d.root === ctx.config.kbRoot && d.rel.startsWith(pkgPrefix) && d.type === "tool";
      if (!isSkill && !isPkg) continue;
      const name = isSkill ? (fmString(d, "name") ?? d.rel.split("/").slice(-2, -1)[0] ?? d.title) : d.title;
      const desc = fmString(d, "description") ?? (isPkg ? d.chunks[0]?.text ?? "" : "");
      if (isSkill) found.add(normalize(name));
      const s = termScore(q, `${name.replace(/[-_]/g, " ")} ${desc} ${d.tags.join(" ")}`);
      const cited = citedBy.get(normalize(name)) ?? [];
      const inAgent = agentSkills?.has(normalize(name)) ?? false;
      if (s.score === 0 && !inAgent) continue;
      if (agentSkills && !inAgent && s.score === 0) continue;
      rows.push({ kind: isSkill ? "skill" : `pacote(${d.status ?? "?"})`, name, description: cut(desc, 200), id: d.id, score: s.score + (inAgent ? 0.25 : 0), matched: s.matched, cited_by: cited });
    }
    rows.sort((x, y) => y.score - x.score || x.name.localeCompare(y.name));
    const limit = clampLimit(ctx, a.limit ?? 8);
    const shown = rows.slice(0, limit);
    const missing = [...citedBy.entries()]
      .filter(([k]) => !found.has(k))
      .filter(([k, ags]) => (agentSkills ? agentSkills.has(k) : termScore(q, k.replace(/[-_]/g, " ")).score > 0 || ags.some((g) => q.includes(normalize(g)))))
      .map(([k, ags]) => ({ name: k, cited_by: ags }));
    if (a.format === "json") return JSON.stringify({ task_terms: q, skills: shown, expected_not_found: missing });
    const out = [`${rows.length} skill(s)/pacote(s) relevantes para "${cut(a.task, 80)}" (termos: ${q.join(", ")}); mostrando ${shown.length}:`];
    shown.forEach((r, i) => out.push(`${i + 1}. [${r.kind}] ${r.name} score=${Math.round(r.score * 1000) / 1000} — ${cut(r.description, 140)}${r.cited_by.length ? ` | citada por: ${r.cited_by.join(", ")}` : ""} (${r.id})`));
    if (rows.length === 0) out.push("(nenhuma skill encontrada; tente outros termos)");
    if (missing.length) out.push("", `Citadas no registro mas sem SKILL.md nas raízes lidas: ${missing.map((m) => `${m.name} (${m.cited_by.join("/")})`).join("; ")}`);
    return out.join("\n");
  },
});
