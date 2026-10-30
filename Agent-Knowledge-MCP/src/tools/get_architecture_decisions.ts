import { z } from "zod";
import { normalize } from "../search/text.js";
import { clampLimit, cut, kbPrefix, readDocument } from "./helpers.js";
import { HARNESS_DOCS } from "./kb-layout.js";
import { fmText, readRaw, termScore, terms } from "./orchestration-helpers.js";
import type { ToolContext } from "./types.js";
import { defineTool, ToolInputError } from "./types.js";

interface Decision { key: string; source: "kb" | "harness"; id: string; title: string; status: string; date?: string; ref: string; body: string }

function kbDecisions(ctx: ToolContext): Decision[] {
  const prefix = kbPrefix(ctx) + "/";
  return ctx.index.all()
    .filter((d) => d.root === ctx.config.kbRoot && d.rel.startsWith(prefix) && d.type === "adr")
    .map((d) => {
      const id = (d.rel.match(/ADR-\d{3}/i) ?? d.title.match(/ADR-\d{3}/i) ?? [d.title])[0].toUpperCase();
      return { key: `kb:${id}`, source: "kb" as const, id, title: d.title.replace(/^ADR-\d{3}\s*[—–:-]\s*/i, ""), status: d.status ?? "?", date: fmText(d, "updated"), ref: d.id, body: d.chunks.map((c) => c.text).join("\n") };
    });
}

/** Faz o parse de Governance/decisions.md do Harness: blocos "## ADR-NNN — Título" fora de cercas de código. */
export function parseHarnessDecisions(content: string, ref: string): Decision[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const out: Decision[] = [];
  let fence = false;
  let cur: Decision | undefined;
  const flush = () => { if (cur) { cur.body = cur.body.trim(); out.push(cur); cur = undefined; } };
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; if (cur) cur.body += line + "\n"; continue; }
    const m = !fence && line.match(/^##\s+(ADR-\d{3})\s*[—–-]\s*(.+?)\s*$/);
    if (m) { flush(); cur = { key: `harness:${m[1]}`, source: "harness", id: m[1], title: m[2], status: "?", ref, body: "" }; continue; }
    if (!fence && /^#{1,2}\s/.test(line)) { flush(); continue; }
    if (!cur) continue;
    const s = line.match(/\*\*Status:?\*\*:?\s*([A-Za-zÀ-ú-]+)(?:\s*[·|,-]\s*(\d{4}-\d{2}-\d{2}))?/);
    if (s && cur.status === "?") { cur.status = s[1].toLowerCase(); cur.date = s[2]; }
    cur.body += line + "\n";
  }
  flush();
  return out;
}

function harnessDecisions(ctx: ToolContext): Decision[] {
  const root = ctx.config.harnessRoot;
  if (!root) return [];
  const d = ctx.index.get(`${root}:${HARNESS_DOCS.decisions}`);
  if (!d) return [];
  return parseHarnessDecisions(readRaw(ctx, d), d.id);
}

export const getArchitectureDecisions = defineTool({
  name: "get_architecture_decisions",
  title: "Decisões de arquitetura (ADRs)",
  description:
    "Lista ou lê ADRs de duas fontes: KB (notas type=adr, ex.: 08-Implementation/ADR e 10-Multi-Agent-Orchestration/07-Governance/ADR) " +
    "e Harness (Governance/decisions.md). Os números se repetem entre fontes: use id 'kb:ADR-007' ou 'harness:ADR-007'. Filtros: source, status, query.",
  inputSchema: {
    id: z.string().max(40).optional().describe("kb:ADR-NNN, harness:ADR-NNN ou ADR-NNN (todas as fontes)."),
    source: z.enum(["all", "kb", "harness"]).optional(),
    status: z.string().max(30).optional().describe("accepted, proposed, superseded…"),
    query: z.string().max(300).optional(),
    limit: z.number().int().min(1).max(100).optional(),
    format: z.enum(["text", "json"]).optional(),
  },
  handler(ctx, a) {
    const src = a.source ?? "all";
    let all = [...(src !== "harness" ? kbDecisions(ctx) : []), ...(src !== "kb" ? harnessDecisions(ctx) : [])];
    if (a.id) {
      const w = a.id.trim().toUpperCase();
      const hits = all.filter((d) => d.key.toUpperCase() === w || d.id === w);
      if (hits.length === 0) throw new ToolInputError(`ADR "${a.id}" não encontrada. Disponíveis: ${all.map((d) => d.key).join(", ")}`);
      if (a.format === "json") return JSON.stringify(hits);
      return hits.map((d) => {
        if (d.source === "kb") { const [r, ...rest] = d.ref.split(":"); return readDocument(ctx, r, rest.join(":"), {}); }
        return `# ${d.key} — ${d.title}\nstatus=${d.status}${d.date ? ` · ${d.date}` : ""} (fonte: ${d.ref})\n\n${cut(d.body, ctx.config.maxDocChars)}`;
      }).join("\n\n---\n\n");
    }
    if (a.status) all = all.filter((d) => normalize(d.status) === normalize(a.status!));
    const q = terms(a.query);
    let rows = all.map((d) => ({ ...d, score: q.length ? termScore(q, `${d.title} ${d.body}`).score : 0 }));
    if (q.length) rows = rows.filter((r) => r.score > 0).sort((x, y) => y.score - x.score);
    const shown = rows.slice(0, a.limit ?? Math.max(clampLimit(ctx, undefined), 50));
    if (a.format === "json") return JSON.stringify(shown.map(({ body, ...r }) => ({ ...r, summary: cut(body.replace(/\s+/g, " "), 200) })));
    const count = (s: string) => rows.filter((r) => r.source === s).length;
    const out = [`${rows.length} ADR(s) [kb=${count("kb")} harness=${count("harness")}]:`];
    for (const r of shown) out.push(`- ${r.key} — ${r.title} | status=${r.status}${r.date ? ` · ${r.date}` : ""}${q.length ? ` score=${r.score}` : ""} (${r.ref})`);
    out.push("Leia uma: get_architecture_decisions id=kb:ADR-NNN ou harness:ADR-NNN.");
    return out.join("\n");
  },
});
