import { z } from "zod";
import { normalize, tokenize } from "../search/text.js";
import { cut, fmString } from "./helpers.js";
import { defineTool } from "./types.js";

export const findMcpServers = defineTool({
  name: "find_mcp_servers",
  title: "Encontrar servidores MCP catalogados",
  description:
    "Lista servidores MCP documentados na KB (notas type=tool com categoria ou tag MCP), com status (top10/radar), nota, licença, " +
    "modo de integração e caminho. Filtros opcionais por termo e status. Dados de catálogo, verificados na data indicada em verified_at.",
  inputSchema: {
    query: z.string().max(200).optional().describe("Ex.: java, github, memória, documentação."),
    status: z.string().optional().describe("top10, radar, adopted..."),
    limit: z.number().int().min(1).max(100).optional(),
  },
  handler(ctx, a) {
    const terms = a.query ? tokenize(a.query) : [];
    const rows = ctx.index.all().filter((d) => d.type === "tool" &&
      ((d.category && /mcp/i.test(d.category)) || d.tags.some((t) => /^mcp/i.test(t))));
    const filtered = rows.filter((d) => {
      if (a.status && normalize(d.status ?? "") !== normalize(a.status)) return false;
      if (!terms.length) return true;
      const hay = normalize(`${d.title} ${d.tags.join(" ")} ${d.category ?? ""} ${fmString(d, "integration") ?? ""} ${d.chunks.map((c) => c.text).join(" ").slice(0, 4000)}`);
      return terms.some((t) => hay.includes(t));
    });
    filtered.sort((x, y) => Number(fmString(y, "score") ?? 0) - Number(fmString(x, "score") ?? 0) || x.title.localeCompare(y.title));
    const limit = Math.min(ctx.config.maxResults, a.limit ?? ctx.config.maxResults);
    const out = [`${filtered.length} servidor(es) MCP${a.query ? ` para "${a.query}"` : ""}:`];
    for (const d of filtered.slice(0, limit)) {
      out.push(`- ${d.title} | status=${d.status ?? "?"} nota=${fmString(d, "score") ?? "?"} licença=${fmString(d, "license") ?? "?"} | integração: ${cut(fmString(d, "integration"), 90) || "?"} | ${d.id}`);
    }
    return out.join("\n");
  },
});
