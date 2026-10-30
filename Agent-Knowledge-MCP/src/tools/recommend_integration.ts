import { z } from "zod";
import { search } from "../search/query.js";
import { clampLimit, cut, fmString } from "./helpers.js";
import { defineTool } from "./types.js";

export const recommendIntegration = defineTool({
  name: "recommend_integration",
  title: "Recomendar integração",
  description:
    "Dada uma necessidade (ex.: 'reduzir tokens ao ler código Java', 'memória compartilhada entre agentes'), sugere ferramentas " +
    "catalogadas na KB (notas type=tool), ordenadas por relevância textual ponderada pela nota da pesquisa. Mostra status, licença, " +
    "modo de integração e o trecho que justificou. É uma triagem: a decisão final deve virar ADR/experimento.",
  inputSchema: {
    need: z.string().min(3).max(400),
    limit: z.number().int().min(1).max(20).optional().describe("Padrão 3."),
    status: z.string().optional().describe("Restringe a top10, radar etc."),
  },
  handler(ctx, a) {
    const limit = Math.min(clampLimit(ctx, a.limit ?? 3), 20);
    const { hits } = search(ctx.index, a.need, { type: "tool", status: a.status }, 50, ctx.config.snippetChars);
    const ranked = hits.map((h) => {
      const score = Number(fmString(h.doc, "score") ?? 50);
      return { h, final: Math.round(h.score * (1 + (Number.isFinite(score) ? score : 50) / 100) * 10) / 10 };
    }).sort((x, y) => y.final - x.final).slice(0, limit);
    if (ranked.length === 0) return `Nenhuma ferramenta catalogada corresponde a "${a.need}". Registre a lacuna em 07-GitHub-Research/Research-History.md.`;
    const out = [`Sugestões para "${a.need}" (triagem lexical; validar com experimento):`];
    ranked.forEach(({ h, final }, i) => {
      const d = h.doc;
      out.push(`${i + 1}. ${d.title} — relevância=${final} nota=${fmString(d, "score") ?? "?"} status=${d.status ?? "?"} licença=${fmString(d, "license") ?? "?"}`);
      out.push(`   integração: ${cut(fmString(d, "integration"), 140) || "?"}`);
      out.push(`   por quê: ${h.heading} — ${h.snippet}`);
      out.push(`   nota: ${d.id}`);
    });
    return out.join("\n");
  },
});
