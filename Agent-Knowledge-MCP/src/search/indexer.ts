import fs from "node:fs";
import path from "node:path";
import type { PathGuard, ResolvedRoot } from "../security/paths.js";
import { toPosix } from "../security/paths.js";
import type { Logger } from "../server/logger.js";
import { parseMarkdown, type Chunk, type Heading } from "./markdown.js";
import { normalize } from "./text.js";

export interface IndexedDoc {
  id: string;          // "raiz:caminho/rel.md"
  root: string;
  rel: string;
  mtimeMs: number;
  size: number;
  title: string;
  frontmatter: Record<string, unknown>;
  frontmatterError?: string;
  type?: string;
  status?: string;
  category?: string;
  tags: string[];
  headings: Heading[];
  chunks: Chunk[];
  wikilinks: string[];
  urls: string[];
  // campos normalizados para busca
  nTitle: string;
  nPath: string;
  nTags: string;
  nMeta: string;
  nChunks: Array<{ heading: string; text: string }>;
}

export interface IndexStats {
  docs: number;
  chunks: number;
  roots: Record<string, number>;
  lastRefreshAt?: string;
  lastRefreshMs?: number;
  reparsed: number;
  removed: number;
  skippedDenied: number;
  skippedSymlinks: number;
  skippedLarge: number;
  parseWarnings: number;
  refreshCount: number;
}

function str(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(String).join(", ");
  return undefined;
}

function tagsOf(fm: Record<string, unknown>): string[] {
  const t = fm.tags;
  if (Array.isArray(t)) return t.map((x) => String(x).replace(/^#/, ""));
  if (typeof t === "string") return t.split(/[,\s]+/).filter(Boolean).map((x) => x.replace(/^#/, ""));
  return [];
}

/**
 * Índice em memória (frontmatter + headings + chunks por seção).
 * Reindexação incremental: a cada consulta (respeitando TTL) varre o diretório,
 * compara mtime/tamanho e só re-parseia o que mudou; remove o que sumiu.
 */
export class KnowledgeIndex {
  private docs = new Map<string, IndexedDoc>();
  private lastCheck = 0;
  stats: IndexStats = { docs: 0, chunks: 0, roots: {}, reparsed: 0, removed: 0, skippedDenied: 0, skippedSymlinks: 0, skippedLarge: 0, parseWarnings: 0, refreshCount: 0 };

  constructor(private guard: PathGuard, private log: Logger, private opts: { maxFileBytes: number; ttlMs: number }) {}

  all(): IndexedDoc[] { this.refresh(); return [...this.docs.values()]; }
  get(id: string): IndexedDoc | undefined { this.refresh(); return this.docs.get(id); }

  /** Força uma varredura completa na próxima consulta. */
  invalidate(): void { this.lastCheck = 0; }

  refresh(force = false): void {
    const now = Date.now();
    if (!force && this.lastCheck !== 0 && now - this.lastCheck < this.opts.ttlMs) return;
    const t0 = Date.now();
    const seen = new Set<string>();
    let reparsed = 0; let denied = 0; let symlinks = 0; let large = 0; let warnings = 0;
    for (const root of this.guard.roots.values()) {
      const starts = root.include.length ? root.include : [""];
      for (const inc of starts) {
        const absStart = inc ? path.join(root.real, ...inc.split("/")) : root.real;
        this.walk(root, absStart, (abs, rel, st) => {
          const id = `${root.name}:${rel}`;
          seen.add(id);
          const prev = this.docs.get(id);
          if (prev && prev.mtimeMs === st.mtimeMs && prev.size === st.size) return;
          try {
            const content = fs.readFileSync(abs, "utf8");
            const doc = this.build(root.name, rel, content, st);
            if (doc.frontmatterError) { warnings++; this.log.warn(`frontmatter inválido em ${id}: ${doc.frontmatterError}`); }
            this.docs.set(id, doc);
            reparsed++;
          } catch (e) {
            warnings++;
            this.log.warn(`falha ao indexar ${id}: ${(e as Error).message}`);
          }
        }, { onDenied: () => denied++, onSymlink: () => symlinks++, onLarge: () => large++ });
      }
    }
    let removed = 0;
    for (const id of [...this.docs.keys()]) if (!seen.has(id)) { this.docs.delete(id); removed++; }
    const rootsCount: Record<string, number> = {};
    let chunks = 0;
    for (const d of this.docs.values()) { rootsCount[d.root] = (rootsCount[d.root] ?? 0) + 1; chunks += d.chunks.length; }
    this.lastCheck = Date.now();
    this.stats = {
      docs: this.docs.size, chunks, roots: rootsCount,
      lastRefreshAt: new Date(this.lastCheck).toISOString(), lastRefreshMs: this.lastCheck - t0,
      reparsed, removed, skippedDenied: denied, skippedSymlinks: symlinks, skippedLarge: large,
      parseWarnings: warnings, refreshCount: this.stats.refreshCount + 1,
    };
    if (reparsed || removed) this.log.debug("índice atualizado", { reparsed, removed, docs: this.docs.size, ms: this.stats.lastRefreshMs });
  }

  private walk(root: ResolvedRoot, abs: string, onFile: (abs: string, rel: string, st: fs.Stats) => void,
    cb: { onDenied: () => void; onSymlink: () => void; onLarge: () => void }): void {
    let st: fs.Stats;
    try { st = fs.lstatSync(abs); } catch { return; }
    const rel = toPosix(path.relative(root.real, abs));
    if (st.isSymbolicLink()) { cb.onSymlink(); return; }
    if (rel && this.guard.isDenied(rel)) { cb.onDenied(); return; }
    if (st.isDirectory()) {
      let entries: string[] = [];
      try { entries = fs.readdirSync(abs); } catch (e) { this.log.warn(`sem acesso a ${root.name}:${rel}: ${(e as Error).message}`); return; }
      for (const name of entries.sort()) this.walk(root, path.join(abs, name), onFile, cb);
      return;
    }
    if (!st.isFile() || !abs.toLowerCase().endsWith(".md")) return;
    if (st.size > this.opts.maxFileBytes) { cb.onLarge(); return; }
    onFile(abs, rel, st);
  }

  private build(root: string, rel: string, content: string, st: fs.Stats): IndexedDoc {
    const p = parseMarkdown(content, path.posix.basename(rel));
    const fm = p.frontmatter;
    const tags = tagsOf(fm);
    const type = str(fm.type ?? fm.tipo);
    const status = str(fm.status);
    const category = str(fm.category ?? fm.categoria);
    const metaBits = [type, status, category, str(fm.integration), str(fm.description), str(fm.name)].filter(Boolean).join(" ");
    return {
      id: `${root}:${rel}`, root, rel, mtimeMs: st.mtimeMs, size: st.size,
      title: p.title, frontmatter: fm, frontmatterError: p.frontmatterError,
      type, status, category, tags, headings: p.headings, chunks: p.chunks,
      wikilinks: p.wikilinks, urls: p.urls,
      nTitle: normalize(p.title), nPath: normalize(rel), nTags: normalize(tags.join(" ")), nMeta: normalize(metaBits),
      nChunks: p.chunks.map((c) => ({ heading: normalize(c.heading), text: normalize(c.text) })),
    };
  }
}
