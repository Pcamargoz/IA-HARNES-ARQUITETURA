import YAML from "yaml";

export interface Heading { level: number; text: string; line: number; } // line 1-based
export interface Chunk { heading: string; level: number; line: number; endLine: number; text: string; }
export interface ParsedDoc {
  frontmatter: Record<string, unknown>;
  frontmatterError?: string;
  bodyStartLine: number; // 1-based linha onde o corpo começa
  title: string;
  headings: Heading[];
  chunks: Chunk[];
  wikilinks: string[];
  urls: string[];
}

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;

export function parseMarkdown(content: string, fileName: string): ParsedDoc {
  const text = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const lines = text.split("\n");
  let frontmatter: Record<string, unknown> = {};
  let frontmatterError: string | undefined;
  let start = 0;
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    const endAlt = lines.indexOf("...", 1);
    const close = end === -1 ? endAlt : (endAlt === -1 ? end : Math.min(end, endAlt));
    if (close > 0) {
      const raw = lines.slice(1, close).join("\n");
      try {
        const v = YAML.parse(raw);
        if (v && typeof v === "object" && !Array.isArray(v)) frontmatter = v as Record<string, unknown>;
      } catch (e) {
        frontmatterError = (e as Error).message.split("\n")[0];
      }
      start = close + 1;
    }
  }
  const headings: Heading[] = [];
  let inFence = false;
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    if (FENCE.test(l)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = HEADING.exec(l);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: i + 1 });
  }
  // Chunks: do início do corpo até o 1º heading ("(intro)"), e de cada heading até o próximo.
  const chunks: Chunk[] = [];
  const bounds = [{ heading: "(intro)", level: 0, line: start + 1 }, ...headings.map((h) => ({ heading: h.text, level: h.level, line: h.line }))];
  for (let i = 0; i < bounds.length; i++) {
    const b = bounds[i];
    const endLine = i + 1 < bounds.length ? bounds[i + 1].line - 1 : lines.length;
    const fromIdx = b.level === 0 ? b.line - 1 : b.line; // pula a linha do heading
    const body = lines.slice(fromIdx, endLine).join("\n").trim();
    if (b.level === 0 && body === "") continue;
    chunks.push({ heading: b.heading, level: b.level, line: b.line, endLine, text: body });
  }
  const fmTitle = typeof frontmatter.title === "string" ? frontmatter.title : undefined;
  const h1 = headings.find((h) => h.level === 1)?.text;
  const title = fmTitle ?? h1 ?? fileName.replace(/\.md$/i, "");
  const wikilinks = uniq([...text.matchAll(/!?\[\[([^\]|#\n]+)(?:#[^\]|\n]*)?(?:\|[^\]\n]*)?\]\]/g)]
    .filter((m) => !m[0].startsWith("!"))
    .map((m) => m[1].trim()));
  const urls = uniq([...text.matchAll(/https?:\/\/[^\s)\]>"'`|]+/g)].map((m) => m[0].replace(/[.,;:]+$/, "")));
  return { frontmatter, frontmatterError, bodyStartLine: start + 1, title, headings, chunks, wikilinks, urls };
}

function uniq<T>(a: T[]): T[] { return [...new Set(a)]; }

/** Seção completa de um heading: até o próximo heading de nível <= ao dele. */
export function sectionRange(headings: Heading[], idx: number, totalLines: number): { start: number; end: number } {
  const h = headings[idx];
  let end = totalLines;
  for (let j = idx + 1; j < headings.length; j++) {
    if (headings[j].level <= h.level) { end = headings[j].line - 1; break; }
  }
  return { start: h.line, end };
}
