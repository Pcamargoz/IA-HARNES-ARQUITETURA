import { z } from "zod";
import fs from "node:fs";
import { parseMarkdown } from "../search/markdown.js";
import { cut, kbPath, readDocument } from "./helpers.js";
import { defineTool } from "./types.js";

export const getResearchHistory = defineTool({
  name: "get_research_history",
  title: "Histórico de pesquisas",
  description:
    "Lista as rodadas de pesquisa registradas (07-GitHub-Research/Research-History.md), mais recentes primeiro, com resumo de uma linha. " +
    "Passe heading para ler uma rodada específica.",
  inputSchema: {
    heading: z.string().max(200).optional(),
    limit: z.number().int().min(1).max(50).optional(),
    max_chars: z.number().int().min(200).max(100000).optional(),
  },
  handler(ctx, a) {
    const ref = kbPath(ctx, "researchHistory");
    if (a.heading) return readDocument(ctx, ref.root, ref.rel, { heading: a.heading, maxChars: a.max_chars });
    const { abs } = ctx.guard.resolve(ref.root, ref.rel, ctx.config.maxFileBytes);
    const p = parseMarkdown(fs.readFileSync(abs, "utf8"), "Research-History.md");
    const h2 = p.chunks.filter((c) => c.level === 2);
    // Rodadas são seções "## AAAA-MM-DD — ..."; outras seções H2 (ex.: "Próxima rodada") vêm depois, na ordem do arquivo.
    const dated = h2.filter((c) => /^\d{4}-\d{2}-\d{2}/.test(c.heading)).sort((x, y) => y.heading.localeCompare(x.heading));
    const others = h2.filter((c) => !/^\d{4}-\d{2}-\d{2}/.test(c.heading));
    const entries = [...dated, ...others];
    const limit = a.limit ?? 10;
    const out = [`${dated.length} rodada(s) datada(s)${others.length ? ` + ${others.length} outra(s) seção(ões)` : ""} (fonte: ${ref.root}:${ref.rel}):`];
    for (const e of entries.slice(0, limit)) out.push(`- ${e.heading} (L${e.line}): ${cut(e.text, 200)}`);
    out.push('Use heading="<título>" para a rodada completa.');
    return out.join("\n");
  },
});
