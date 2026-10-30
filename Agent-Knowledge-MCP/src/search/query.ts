import type { IndexedDoc, KnowledgeIndex } from "./indexer.js";
import { countOccurrences, makeSnippet, normalize, tokenize } from "./text.js";

export interface DocFilter {
  root?: string;
  pathPrefix?: string;
  type?: string | string[];
  status?: string | string[];
  category?: string;
  tag?: string;
}

export interface SearchHit {
  doc: IndexedDoc;
  score: number;
  heading: string;
  line: number;
  snippet: string;
}

function oneOf(value: string | undefined, want: string | string[] | undefined): boolean {
  if (want === undefined) return true;
  const list = (Array.isArray(want) ? want : [want]).map((w) => normalize(w));
  return value !== undefined && list.includes(normalize(value));
}

/** Filtro genérico por frontmatter/caminho — base para as tools atuais e futuras. */
export function matchesFilter(d: IndexedDoc, f: DocFilter): boolean {
  if (f.root && d.root !== f.root) return false;
  if (f.pathPrefix && !d.rel.startsWith(f.pathPrefix.replace(/^\/+/, ""))) return false;
  if (!oneOf(d.type, f.type)) return false;
  if (!oneOf(d.status, f.status)) return false;
  if (f.category && !(d.category && normalize(d.category).includes(normalize(f.category)))) return false;
  if (f.tag && !d.tags.some((t) => normalize(t) === normalize(f.tag!.replace(/^#/, "")))) return false;
  return true;
}

export function filterDocs(index: KnowledgeIndex, f: DocFilter): IndexedDoc[] {
  return index.all().filter((d) => matchesFilter(d, f)).sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Busca lexical ponderada (sem embeddings): título×4, tags×3, heading×3, caminho×2, metadados×2, corpo×1,
 * bônus para frase exata e fator de cobertura dos termos. Um resultado (melhor seção) por documento.
 */
export function search(index: KnowledgeIndex, query: string, f: DocFilter, limit: number, snippetChars: number): { hits: SearchHit[]; terms: string[]; considered: number } {
  const terms = tokenize(query);
  const phrase = normalize(query).trim();
  const docs = index.all().filter((d) => matchesFilter(d, f));
  const hits: SearchHit[] = [];
  if (terms.length === 0) return { hits, terms, considered: docs.length };
  for (const d of docs) {
    let docBase = 0; const docMatched = new Set<string>();
    for (const t of terms) {
      const s = (d.nTitle.includes(t) ? 4 : 0) + (d.nTags.includes(t) ? 3 : 0) + (d.nPath.includes(t) ? 2 : 0) + (d.nMeta.includes(t) ? 2 : 0);
      if (s > 0) { docBase += s; docMatched.add(t); }
    }
    let best: { score: number; i: number } | undefined;
    for (let i = 0; i < d.nChunks.length; i++) {
      const c = d.nChunks[i];
      let s = 0; const matched = new Set(docMatched);
      for (const t of terms) {
        const inHead = c.heading.includes(t) ? 3 : 0;
        const inBody = countOccurrences(c.text, t, 5);
        if (inHead || inBody) { s += inHead + inBody; matched.add(t); }
      }
      if (phrase.length > 3 && terms.length > 1 && (c.text.includes(phrase) || c.heading.includes(phrase))) s += 5;
      const coverage = matched.size / terms.length;
      const total = (s + docBase) * coverage * coverage;
      if (total > 0 && (!best || total > best.score)) best = { score: total, i };
    }
    if (!best && docBase > 0) {
      const coverage = docMatched.size / terms.length;
      best = { score: docBase * coverage * coverage, i: 0 };
    }
    if (!best || best.score <= 0) continue;
    const chunk = d.chunks[best.i];
    hits.push({
      doc: d, score: Math.round(best.score * 10) / 10,
      heading: chunk?.heading ?? "(intro)", line: chunk?.line ?? 1,
      snippet: chunk ? makeSnippet(chunk.text, terms, snippetChars) : "",
    });
  }
  hits.sort((a, b) => b.score - a.score || a.doc.id.localeCompare(b.doc.id));
  return { hits: hits.slice(0, limit), terms, considered: docs.length };
}
