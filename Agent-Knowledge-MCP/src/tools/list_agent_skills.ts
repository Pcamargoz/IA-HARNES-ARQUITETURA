import { z } from "zod";
import { normalize, tokenize } from "../search/text.js";
import { clampLimit, cut, fmString, kbPrefix } from "./helpers.js";
import { KB_AREAS } from "./kb-layout.js";
import { defineTool } from "./types.js";

export const listAgentSkills = defineTool({
  name: "list_agent_skills",
  title: "Listar skills de agentes",
  description:
    "Lista skills disponíveis: arquivos SKILL.md (formato agentskills.io: name/description) nas raízes autorizadas e " +
    "notas de pacotes de skills da KB (02-Agent-Skills). Filtro opcional por termo. Retorna nome, descrição curta e caminho.",
  inputSchema: {
    query: z.string().max(200).optional().describe("Filtra por termos no nome/descrição/caminho."),
    source: z.enum(["all", "skill_files", "kb_packages"]).optional().describe("all (padrão), skill_files (SKILL.md) ou kb_packages (notas da KB)."),
    limit: z.number().int().min(1).max(100).optional(),
  },
  handler(ctx, a) {
    const src = a.source ?? "all";
    const limit = Math.max(clampLimit(ctx, a.limit), a.limit ?? 30);
    const terms = a.query ? tokenize(a.query) : [];
    const pkgPrefix = kbPrefix(ctx, KB_AREAS.skills);
    const rows: Array<{ kind: string; name: string; desc: string; id: string; hay: string }> = [];
    for (const d of ctx.index.all()) {
      const isSkillFile = /(^|\/)SKILL\.md$/i.test(d.rel);
      const isPkg = d.root === ctx.config.kbRoot && d.rel.startsWith(pkgPrefix + "/") && d.type === "tool";
      if (isSkillFile && src !== "kb_packages") {
        const name = fmString(d, "name") ?? d.rel.split("/").slice(-2, -1)[0] ?? d.title;
        const desc = fmString(d, "description") ?? "";
        rows.push({ kind: "skill", name, desc, id: d.id, hay: normalize(`${name} ${desc} ${d.rel}`) });
      } else if (isPkg && src !== "skill_files") {
        const desc = fmString(d, "description") ?? d.chunks[0]?.text ?? "";
        rows.push({ kind: `pacote(${d.status ?? "?"})`, name: d.title, desc, id: d.id, hay: normalize(`${d.title} ${desc} ${d.tags.join(" ")}`) });
      }
    }
    const filtered = terms.length ? rows.filter((r) => terms.every((t) => r.hay.includes(t))) : rows;
    filtered.sort((x, y) => x.kind.localeCompare(y.kind) || x.name.localeCompare(y.name) || x.id.localeCompare(y.id));
    const shown = filtered.slice(0, limit);
    const out = [`${filtered.length} skill(s)/pacote(s)${a.query ? ` para "${a.query}"` : ""}; mostrando ${shown.length}:`];
    for (const r of shown) out.push(`- [${r.kind}] ${r.name} — ${cut(r.desc, 160)} (${r.id})`);
    if (filtered.length > shown.length) out.push(`(+${filtered.length - shown.length}; aumente limit ou refine query)`);
    return out.join("\n");
  },
});
