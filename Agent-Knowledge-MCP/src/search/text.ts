const STOP = new Set([
  "a","o","as","os","de","da","do","das","dos","e","em","no","na","nos","nas","um","uma","para","por","com","que","se","ao","aos","ou","como","mais","sem",
  "the","of","and","to","in","for","on","with","is","are","an","by","or","at","be","it","this","that","from","how","what",
]);

export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function tokenize(s: string): string[] {
  return normalize(s).split(/[^a-z0-9]+/).filter((t) => t.length >= 2 && !STOP.has(t));
}

export function countOccurrences(hay: string, needle: string, cap = 5): number {
  if (!needle) return 0;
  let n = 0; let i = 0;
  while (n < cap) {
    const j = hay.indexOf(needle, i);
    if (j === -1) break;
    n++; i = j + needle.length;
  }
  return n;
}

/** Trecho curto ao redor da primeira ocorrência de algum termo, em uma linha. */
export function makeSnippet(text: string, terms: string[], max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const norm = normalize(flat);
  let pos = -1;
  for (const t of terms) {
    const p = norm.indexOf(t);
    if (p !== -1 && (pos === -1 || p < pos)) pos = p;
  }
  if (pos === -1) return flat.slice(0, max - 1) + "…";
  const start = Math.max(0, pos - Math.floor(max / 3));
  const piece = flat.slice(start, start + max);
  return (start > 0 ? "…" : "") + piece + (start + max < flat.length ? "…" : "");
}

export function truncate(s: string, max: number): { text: string; truncated: boolean } {
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
}
