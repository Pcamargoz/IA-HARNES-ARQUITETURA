import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { redact } from "../security/redact.js";
import { kbPath, readDocument } from "../tools/helpers.js";
import type { ToolContext } from "../tools/types.js";

/** Recursos estáticos: índice da KB e estado do índice. */
export function registerResources(server: McpServer, ctx: ToolContext): void {
  server.registerResource("kb-index", "akm://kb/index", {
    title: "Índice da Knowledge Base",
    description: "Nota 00-Dashboard/Indice-AI-Agent-Ecosystem.md da KB (truncada no limite de caracteres).",
    mimeType: "text/markdown",
  }, async (uri) => {
    const ref = kbPath(ctx, "index");
    let text: string;
    try { text = readDocument(ctx, ref.root, ref.rel, {}); } catch (e) { text = `Índice indisponível: ${(e as Error).message}`; }
    return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: redact(text) }] };
  });
  server.registerResource("kb-status", "akm://kb/status", {
    title: "Estado do índice",
    description: "Contagem de documentos/seções e última reindexação.",
    mimeType: "application/json",
  }, async (uri) => {
    ctx.index.refresh();
    return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(ctx.index.stats) }] };
  });
}
