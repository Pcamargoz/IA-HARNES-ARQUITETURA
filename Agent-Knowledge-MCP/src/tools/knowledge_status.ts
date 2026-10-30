import { z } from "zod";
import { defineTool } from "./types.js";

export const knowledgeStatus = defineTool({
  name: "knowledge_status",
  title: "Estado do índice",
  description: "Diagnóstico: raízes autorizadas (por nome), documentos e seções indexados, última reindexação e limites ativos. reindex=true força varredura.",
  inputSchema: { reindex: z.boolean().optional() },
  handler(ctx, a) {
    ctx.index.refresh(Boolean(a.reindex));
    const s = ctx.index.stats;
    const roots = [...ctx.guard.roots.values()].map((r) => `${r.name}(${r.include.length ? r.include.join(" | ") : "*"})`).join("; ");
    return [
      `raízes: ${roots}`,
      `kb: ${ctx.config.kbRoot}:${ctx.config.kbSubdir} | harness: ${ctx.config.harnessRoot}`,
      `documentos: ${s.docs} (${Object.entries(s.roots).map(([k, v]) => `${k}=${v}`).join(", ")}) | seções: ${s.chunks}`,
      `última reindexação: ${s.lastRefreshAt} (${s.lastRefreshMs} ms; reparseados ${s.reparsed}, removidos ${s.removed}; varreduras ${s.refreshCount})`,
      `ignorados: negados=${s.skippedDenied} symlinks=${s.skippedSymlinks} grandes=${s.skippedLarge} | avisos de parse: ${s.parseWarnings}`,
      `limites: resultados ${ctx.config.defaultResults}/${ctx.config.maxResults}, snippet ${ctx.config.snippetChars}, doc ${ctx.config.maxDocChars} chars, ttl ${ctx.config.indexTtlMs} ms`,
      "modo: somente leitura",
    ].join("\n");
  },
});
