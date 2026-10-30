import fs from "node:fs";
import path from "node:path";
import { parseMarkdown, sectionRange } from "../search/markdown.js";
import { normalize, truncate } from "../search/text.js";
import { splitDocId } from "../security/paths.js";
import type { IndexedDoc } from "../search/indexer.js";
import type { SearchHit } from "../search/query.js";
import { KB_DOCS, type KbDocKey } from "./kb-layout.js";
import { ToolInputError, type ToolContext } from "./types.js";

export interface ReadOptions {
  heading?: string;
  startLine?: number;
  maxLines?: number;
  maxChars?: number;
  outlineOnly?: boolean;
  includeLinks?: boolean;
  includeFrontmatter?: boolean;
}

export function kbPath(ctx: ToolContext, key: KbDocKey): { root: string; rel: string } {
  return { root: ctx.config.kbRoot, rel: `${ctx.config.kbSubdir}/${KB_DOCS[key]}` };
}

export function kbPrefix(ctx: ToolContext, area?: string): string {
  return area ? `${ctx.config.kbSubdir}/${area}` : ctx.config.kbSubdir;
}

export function clampLimit(ctx: ToolContext, n: number | undefined): number {
  return Math.min(ctx.config.maxResults, Math.max(1, n ?? ctx.config.defaultResults));
}

export function fmSummary(fm: Record<string, unknown>, maxKeys = 12): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(fm)) {
    if (parts.length >= maxKeys) break;
    let s: string;
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) s = v.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join(", ");
    else if (v instanceof Date) s = v.toISOString().slice(0, 10);
    else if (typeof v === "object") s = JSON.stringify(v);
    else s = String(v);
    if (s.length > 120) s = s.slice(0, 117) + "…";
    parts.push(`${k}: ${s}`);
  }
  return parts.join(" | ");
}

/** Lê um documento (sempre do disco, via PathGuard) com leitura parcial e limite de caracteres. */
export function readDocument(ctx: ToolContext, rootName: string, rel: string, o: ReadOptions = {}): string {
  const { abs, rel: safeRel } = ctx.guard.resolve(rootName, rel, ctx.config.maxFileBytes);
  const content = fs.readFileSync(abs, "utf8").replace(/\r\n?/g, "\n");
  const lines = content.split("\n");
  const p = parseMarkdown(content, path.posix.basename(safeRel));
  const maxChars = Math.min(ctx.config.maxDocChars * 4, Math.max(200, o.maxChars ?? ctx.config.maxDocChars));
  const head: string[] = [`# ${p.title}`];
  const meta = `fonte: ${rootName}:${safeRel}`;
  const fm = o.includeFrontmatter === false ? "" : fmSummary(p.frontmatter);
  if (o.outlineOnly) {
    head.push(meta + ` | ${lines.length} linhas`);
    if (fm) head.push(`frontmatter: ${fm}`);
    head.push("", "Seções (linha · nível · título · ≈caracteres):");
    p.headings.forEach((h, i) => {
      const r = sectionRange(p.headings, i, lines.length);
      const size = lines.slice(h.line, r.end).join("\n").length;
      head.push(`L${h.line} ${"#".repeat(h.level)} ${h.text} (≈${size})`);
    });
    if (p.headings.length === 0) head.push("(sem headings)");
    if (o.includeLinks) head.push(...linksBlock(p.wikilinks, p.urls));
    return head.join("\n");
  }
  let start = p.bodyStartLine; let end = lines.length; let label = "documento";
  if (o.heading) {
    const want = normalize(o.heading.replace(/^#+\s*/, "")).trim();
    let idx = p.headings.findIndex((h) => normalize(h.text).trim() === want);
    if (idx === -1) idx = p.headings.findIndex((h) => normalize(h.text).includes(want));
    if (idx === -1) {
      const avail = p.headings.slice(0, 25).map((h) => `${"#".repeat(h.level)} ${h.text}`).join("; ");
      throw new ToolInputError(`Seção "${o.heading}" não encontrada em ${rootName}:${safeRel}. Seções: ${avail || "(nenhuma)"}`);
    }
    const r = sectionRange(p.headings, idx, lines.length);
    start = r.start; end = r.end; label = `seção "${p.headings[idx].text}"`;
  } else if (o.startLine) {
    start = Math.max(1, Math.min(lines.length, o.startLine));
    end = Math.min(lines.length, start + Math.max(1, o.maxLines ?? 80) - 1);
    label = "trecho";
  }
  const body = lines.slice(start - 1, end).join("\n").trim();
  const t = truncate(body, maxChars);
  head.push(`${meta} | ${label} L${start}-${end} de ${lines.length}`);
  if (fm) head.push(`frontmatter: ${fm}`);
  head.push("---", t.text);
  if (t.truncated) {
    const rest = body.length - t.text.length;
    head.push(`\n[truncado: +${rest} caracteres. Peça uma seção com "heading", um intervalo com "start_line", ou use outline_only=true.]`);
  }
  if (o.includeLinks) head.push(...linksBlock(p.wikilinks, p.urls));
  return head.join("\n");
}

function linksBlock(wikilinks: string[], urls: string[]): string[] {
  const out = ["", `wikilinks (${wikilinks.length}): ${wikilinks.slice(0, 40).join("; ") || "-"}`];
  out.push(`fontes externas (${urls.length}): ${urls.slice(0, 40).join(" ; ") || "-"}`);
  return out;
}

/** Aceita "raiz:caminho" ou caminho + raiz; se só caminho, procura em todas as raízes. */
export function resolveDocRef(ctx: ToolContext, ref: string, rootHint?: string): { root: string; rel: string } {
  const { root, rel } = splitDocId(ref, rootHint);
  if (root) return { root, rel };
  const matches = ctx.index.all().filter((d) => d.rel === rel || d.rel.endsWith("/" + rel) || d.rel === rel + ".md" || d.rel.endsWith("/" + rel + ".md"));
  if (matches.length === 1) return { root: matches[0].root, rel: matches[0].rel };
  if (matches.length > 1) throw new ToolInputError(`Caminho ambíguo; use "raiz:caminho". Candidatos: ${matches.slice(0, 8).map((m) => m.id).join(", ")}`);
  return { root: ctx.config.kbRoot, rel };
}

export function formatHits(query: string, hits: SearchHit[], considered: number): string {
  if (hits.length === 0) return `0 resultados para "${query}" (${considered} documentos considerados). Tente termos diferentes ou remova filtros.`;
  const out = [`${hits.length} resultado(s) para "${query}" (${considered} documentos considerados):`];
  hits.forEach((h, i) => {
    const d = h.doc;
    const meta = [d.type && `type=${d.type}`, d.status && `status=${d.status}`].filter(Boolean).join(" ");
    out.push(`${i + 1}. ${d.title} — ${d.id} › ${h.heading} (L${h.line}) score=${h.score}${meta ? " " + meta : ""}`);
    if (h.snippet) out.push(`   ${h.snippet}`);
  });
  return out.join("\n");
}

export function hitsJson(hits: SearchHit[]): string {
  return JSON.stringify(hits.map((h) => ({
    id: h.doc.id, root: h.doc.root, path: h.doc.rel, title: h.doc.title, heading: h.heading, line: h.line,
    score: h.score, type: h.doc.type, status: h.doc.status, snippet: h.snippet,
  })));
}

export function fmString(d: IndexedDoc, key: string): string | undefined {
  const v = d.frontmatter[key];
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v.map(String).join(", ");
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

export function cut(s: string | undefined, n: number): string {
  if (!s) return "";
  const flat = s.replace(/\s+/g, " ").trim();
  return flat.length > n ? flat.slice(0, n - 1) + "…" : flat;
}
