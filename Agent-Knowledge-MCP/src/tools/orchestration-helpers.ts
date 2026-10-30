import fs from "node:fs";
import type { IndexedDoc } from "../search/indexer.js";
import { filterDocs } from "../search/query.js";
import { normalize, tokenize } from "../search/text.js";
import { kbPrefix } from "./helpers.js";
import { KB_AREAS } from "./kb-layout.js";
import type { ToolContext } from "./types.js";

/**
 * Utilidades das tools de orquestração. Tudo é guiado por frontmatter dentro de
 * <KB>/10-Multi-Agent-Orchestration: type (agent-spec, policy, procedure, workflow-template,
 * metric-catalog, telemetry-schema) e policy_area. Notas novas entram sem mudar código.
 */
export function orchPrefix(ctx: ToolContext): string {
  return kbPrefix(ctx, KB_AREAS.multiAgent);
}

export function orchDocs(ctx: ToolContext, type: string | string[]): IndexedDoc[] {
  return filterDocs(ctx.index, { root: ctx.config.kbRoot, pathPrefix: orchPrefix(ctx) + "/", type });
}

export function fmList(d: IndexedDoc, key: string): string[] {
  const v = d.frontmatter[key];
  if (Array.isArray(v)) return v.map((x) => String(x));
  if (typeof v === "string" && v.trim()) return v.split(/\s*,\s*/).filter(Boolean);
  return [];
}

export function fmObj(d: IndexedDoc, key: string): Record<string, unknown> | undefined {
  const v = d.frontmatter[key];
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined;
}

export function fmText(d: IndexedDoc, key: string): string | undefined {
  const v = d.frontmatter[key];
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v.map(String).join(", ");
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Fração dos termos da tarefa presentes no texto (0–1) e os termos casados. Determinística. */
export function termScore(taskTerms: string[], hay: string): { score: number; matched: string[] } {
  if (taskTerms.length === 0) return { score: 0, matched: [] };
  const h = normalize(hay);
  const matched = [...new Set(taskTerms.filter((t) => h.includes(t)))];
  return { score: Math.round((matched.length / new Set(taskTerms).size) * 1000) / 1000, matched };
}

export function terms(s: string | undefined): string[] {
  return s ? [...new Set(tokenize(s))] : [];
}

export function agentName(d: IndexedDoc): string {
  return fmText(d, "name") ?? d.rel.split("/").pop()!.replace(/\.md$/i, "");
}

/** Extrai a primeira tabela Markdown cujo cabeçalho contém a coluna `firstCol`. */
export function parseTable(content: string, firstCol: string): Array<Record<string, string>> {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const split = (l: string) => l.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim());
  for (let i = 0; i < lines.length - 1; i++) {
    if (!lines[i].trim().startsWith("|")) continue;
    const head = split(lines[i]).map((h) => normalize(h).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""));
    if (head[0] !== firstCol || !/^\|?\s*:?-{2,}/.test(lines[i + 1].trim())) continue;
    const rows: Array<Record<string, string>> = [];
    for (let j = i + 2; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      const cells = split(lines[j]);
      const row: Record<string, string> = {};
      head.forEach((h, k) => { row[h] = (cells[k] ?? "").replace(/\\\|/g, "|"); });
      rows.push(row);
    }
    return rows;
  }
  return [];
}

/** Lê o conteúdo bruto de um documento indexado, sempre via PathGuard. */
export function readRaw(ctx: ToolContext, d: IndexedDoc): string {
  const { abs } = ctx.guard.resolve(d.root, d.rel, ctx.config.maxFileBytes);
  return fs.readFileSync(abs, "utf8").replace(/\r\n?/g, "\n");
}
