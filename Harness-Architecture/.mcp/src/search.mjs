import fs from "node:fs";
import path from "node:path";
import {
  IGNORED_DIRS,
  INDEX_TTL_MS,
  NOTE_EXTENSIONS,
  VAULT_ROOT,
} from "./config.mjs";

const STOPWORDS = new Set([
  "a", "o", "e", "de", "da", "do", "das", "dos", "em", "na", "no", "nas", "nos",
  "um", "uma", "para", "por", "com", "que", "se", "ao", "aos", "as", "os",
  "the", "and", "of", "to", "in", "for", "on", "is", "are", "it", "this",
]);

const WIKILINK = /\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g;

export function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function tokenize(text) {
  return normalize(text)
    .split(/[^a-z0-9_]+/g)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function unquote(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

// Minimal YAML subset: `key: value`, `key: [a, b]`, and block lists (`key:` + `  - item`).
export function parseFrontmatter(raw) {
  const text = raw.replace(/^﻿/, "");
  if (!text.startsWith("---")) return { meta: {}, body: text, hasFrontmatter: false };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: text, hasFrontmatter: false };
  const header = text.slice(3, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const meta = {};
  let listKey = null;
  for (const line of header.split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      meta[listKey].push(unquote(item[1]));
      continue;
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (value === "") {
      meta[key] = [];
      listKey = key;
    } else if (/^\[.*\]$/.test(value)) {
      meta[key] = value.slice(1, -1).split(",").map(unquote).filter(Boolean);
      listKey = null;
    } else {
      meta[key] = unquote(value);
      listKey = null;
    }
  }
  return { meta, body, hasFrontmatter: true };
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value) return [value];
  return [];
}

export function walkNotes(dir = VAULT_ROOT, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.isDirectory()) continue;
    if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkNotes(full, acc);
    } else if (NOTE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      acc.push(full);
    }
  }
  return acc;
}

function headingsOf(body) {
  return body
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, "").trim());
}

// Removes fenced and inline code so examples are not treated as real links.
function stripCode(body) {
  return body.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
}

function wikiTargets(body) {
  return [...stripCode(body).matchAll(WIKILINK)].map((match) =>
    match[1].trim().replace(/\\+$/, ""),
  );
}

function snippet(body, tokens) {
  const lines = body.split(/\r?\n/);
  const normalized = lines.map((line) => normalize(line));
  for (let i = 0; i < lines.length; i += 1) {
    if (tokens.some((token) => normalized[i].includes(token))) {
      const start = Math.max(0, i - 1);
      return lines
        .slice(start, Math.min(lines.length, i + 3))
        .join(" ")
        .replace(/\s+/g, " ")
        .slice(0, 240)
        .trim();
    }
  }
  return body.replace(/\s+/g, " ").slice(0, 200).trim();
}

let cache = { checkedAt: 0, signature: "", docs: [] };

function signatureOf(files) {
  let latest = 0;
  for (const file of files) {
    try {
      latest = Math.max(latest, fs.statSync(file).mtimeMs);
    } catch {
      // File vanished between walk and stat; the count change already invalidates.
    }
  }
  return `${files.length}:${latest}`;
}

function buildIndex(files) {
  const docs = [];
  for (const file of files) {
    let stat;
    let raw;
    try {
      stat = fs.statSync(file);
      raw = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const rel = path.relative(VAULT_ROOT, file).split(path.sep).join("/");
    const { meta, body, hasFrontmatter } = parseFrontmatter(raw);
    const title = (typeof meta.title === "string" && meta.title) || path.basename(file, ".md");
    const tags = asList(meta.tags);
    docs.push({
      path: rel,
      title,
      meta,
      hasFrontmatter,
      tags,
      tagText: normalize(tags.join(" ")),
      headings: headingsOf(body),
      body,
      lines: body.split(/\r?\n/).length,
      mtime: stat.mtimeMs,
    });
  }
  return docs;
}

// Rebuilds when files were added, removed, or edited outside the server.
function ensureIndex() {
  const now = Date.now();
  if (cache.docs.length && now - cache.checkedAt < INDEX_TTL_MS) return cache.docs;
  const files = walkNotes();
  const signature = signatureOf(files);
  if (!cache.docs.length || signature !== cache.signature) {
    cache.docs = buildIndex(files);
    cache.signature = signature;
  }
  cache.checkedAt = now;
  return cache.docs;
}

function inFolder(doc, folder) {
  const prefix = normalize(folder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, ""));
  if (!prefix) return true;
  const docPath = normalize(doc.path);
  return docPath === prefix || docPath.startsWith(`${prefix}/`);
}

function findDoc(docs, relativePath, { byTitle = false } = {}) {
  const key = normalize(relativePath.replace(/\\/g, "/").replace(/^\/+/, ""));
  const withExt = key.endsWith(".md") ? key : `${key}.md`;
  return (
    docs.find((item) => normalize(item.path) === withExt) ||
    docs.find((item) => normalize(item.path).endsWith(`/${withExt}`)) ||
    (byTitle ? docs.find((item) => normalize(item.title) === key) : undefined)
  );
}

function requireDoc(docs, relativePath, options) {
  const doc = findDoc(docs, relativePath, options);
  if (!doc) {
    const error = new Error(`Note not found: ${relativePath}`);
    error.code = "ENOENT";
    throw error;
  }
  return doc;
}

// Obsidian-style resolution: full path without extension, or bare file name.
function linkResolver(docs) {
  const map = new Map();
  for (const doc of docs) {
    const noExt = doc.path.replace(/\.md$/i, "").toLowerCase();
    map.set(noExt, doc.path);
    const base = path.posix.basename(noExt);
    if (!map.has(base)) map.set(base, doc.path);
  }
  return (target) => {
    const key = target.toLowerCase().replace(/\.md$/i, "");
    return map.get(key) ?? null;
  };
}

export function searchNotes(query, { limit = 5, folder = "" } = {}) {
  const docs = ensureIndex();
  const tokens = tokenize(query);
  const phrase = normalize(query).trim();
  if (!tokens.length) return [];

  const results = [];
  for (const doc of docs.filter((item) => inFolder(item, folder))) {
    const title = normalize(doc.title);
    const fileName = normalize(path.basename(doc.path, ".md"));
    const headings = normalize(doc.headings.join(" "));
    const body = normalize(doc.body);

    let score = 0;
    let hits = 0;
    for (const token of tokens) {
      let local = 0;
      if (title.includes(token)) local += 8;
      if (fileName.includes(token)) local += 6;
      if (doc.tagText.includes(token)) local += 5;
      if (headings.includes(token)) local += 4;
      if (body.includes(token)) local += 1.5;
      if (local > 0) hits += 1;
      score += local;
    }
    if (phrase.length > 3 && body.includes(phrase)) score += 6;
    score *= 1 + (hits / tokens.length) * 0.5;

    if (score > 0) {
      results.push({
        path: doc.path,
        title: doc.title,
        score: Math.round(score * 100) / 100,
        snippet: snippet(doc.body, tokens),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function readNote(relativePath, { heading = "", maxChars = 20000 } = {}) {
  const doc = requireDoc(ensureIndex(), relativePath, { byTitle: true });

  let text = doc.body;
  let section = "";

  if (heading) {
    const lines = doc.body.split(/\r?\n/);
    const wanted = normalize(heading);
    const headingText = (line) => normalize(line.replace(/^#{1,6}\s+/, "").trim());
    const isHeading = (line) => /^#{1,6}\s+/.test(line);
    // Exact match wins over substring, so "Log" does not land on "Execution Log".
    let start = lines.findIndex((line) => isHeading(line) && headingText(line) === wanted);
    if (start === -1) {
      start = lines.findIndex((line) => isHeading(line) && headingText(line).includes(wanted));
    }
    if (start === -1) {
      const error = new Error(
        `Heading not found in ${doc.path}: ${heading}. Use vault_outline to list headings.`,
      );
      error.code = "ENOHEADING";
      throw error;
    }
    const level = (lines[start].match(/^#+/)?.[0] ?? "#").length;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      const match = lines[i].match(/^(#{1,6})\s+/);
      if (match && match[1].length <= level) {
        end = i;
        break;
      }
    }
    text = lines.slice(start, end).join("\n");
    section = lines[start].replace(/^#{1,6}\s+/, "").trim();
  }

  const truncated = text.length > maxChars;
  return {
    path: doc.path,
    title: doc.title,
    heading: section || null,
    content: truncated ? `${text.slice(0, maxChars)}\n\n[... truncated at ${maxChars} characters]` : text,
    truncated,
    chars: Math.min(text.length, maxChars),
  };
}

export function outlineOf(relativePath) {
  const doc = requireDoc(ensureIndex(), relativePath, { byTitle: true });
  const lines = doc.body.split(/\r?\n/);
  const marks = [];
  let fenced = false;
  lines.forEach((line, index) => {
    if (/^```/.test(line)) fenced = !fenced;
    const match = !fenced && line.match(/^(#{1,6})\s+(.*)$/);
    if (match) marks.push({ level: match[1].length, heading: match[2].trim(), line: index });
  });
  const headings = marks.map((mark, i) => {
    const next = marks.slice(i + 1).find((other) => other.level <= mark.level);
    const end = next ? next.line : lines.length;
    const chars = lines.slice(mark.line, end).join("\n").length;
    return { level: mark.level, heading: mark.heading, line: mark.line + 1, chars };
  });
  return {
    path: doc.path,
    title: doc.title,
    meta: doc.meta,
    total_chars: doc.body.length,
    headings,
  };
}

export function listNotes(folder = "", depth = 2) {
  const docs = ensureIndex();
  const prefix = folder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const baseDepth = prefix ? prefix.split("/").filter(Boolean).length : 0;

  return docs
    .filter((doc) => inFolder(doc, prefix))
    .filter((doc) => doc.path.split("/").length - 1 - baseDepth < depth)
    .map((doc) => ({ path: doc.path, title: doc.title }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function linksOf(relativePath) {
  const docs = ensureIndex();
  const doc = requireDoc(docs, relativePath);
  const resolve = linkResolver(docs);

  const outgoing = new Set(wikiTargets(doc.body));
  for (const match of doc.body.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)) {
    outgoing.add(match[1].trim());
  }

  const backlinks = docs
    .filter((item) => item.path !== doc.path)
    .filter((item) => wikiTargets(item.body).some((target) => resolve(target) === doc.path))
    .map((item) => ({ path: item.path, title: item.title }));

  return {
    path: doc.path,
    title: doc.title,
    outgoing: [...outgoing],
    backlinks,
  };
}

function metaMatches(value, wanted) {
  if (!wanted) return true;
  return asList(value).some((item) => normalize(item) === normalize(wanted));
}

export function queryNotes({ type, status, tag, folder = "", updatedBefore, updatedAfter, limit = 20 } = {}) {
  return ensureIndex()
    .filter((doc) => inFolder(doc, folder))
    .filter((doc) => metaMatches(doc.meta.type, type))
    .filter((doc) => metaMatches(doc.meta.status, status))
    .filter((doc) => !tag || doc.tags.some((item) => normalize(item) === normalize(tag)))
    .filter((doc) => !updatedBefore || (doc.meta.updated ?? "") < updatedBefore)
    .filter((doc) => !updatedAfter || (doc.meta.updated ?? "") > updatedAfter)
    .sort((a, b) => a.path.localeCompare(b.path))
    .slice(0, limit)
    .map((doc) => ({
      path: doc.path,
      title: doc.title,
      type: doc.meta.type ?? null,
      status: doc.meta.status ?? null,
      updated: doc.meta.updated ?? null,
      tags: doc.tags,
    }));
}

export function recentNotes({ limit = 10, folder = "" } = {}) {
  return ensureIndex()
    .filter((doc) => inFolder(doc, folder))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)
    .map((doc) => ({
      path: doc.path,
      title: doc.title,
      modified: new Date(doc.mtime).toISOString(),
      updated: doc.meta.updated ?? null,
    }));
}

export const STANDARD = {
  required: ["title", "type", "status", "updated", "tags"],
  types: [
    "index", "governance", "architecture", "process", "catalog", "metrics",
    "security", "guide", "reference", "policy", "bootstrap",
  ],
  statuses: ["draft", "active", "deprecated", "reference"],
  maxLines: 250,
  // Original sources are preserved verbatim (see HOME, "Operating rules").
  exempt: ["Ideas.md"],
  // Entry points are reached directly, so they are never orphans.
  entryPoints: ["HOME.md", "AGENTS.md", "README.md"],
};

export function healthReport({ staleDays = 90, today = new Date() } = {}) {
  const docs = ensureIndex();
  const resolve = linkResolver(docs);
  const cutoff = new Date(today.getTime() - staleDays * 86400000).toISOString().slice(0, 10);

  const brokenLinks = [];
  const inbound = new Map(docs.map((doc) => [doc.path, 0]));
  for (const doc of docs) {
    for (const target of wikiTargets(doc.body)) {
      // Attachments (images, PDFs) resolve from the vault root or next to the note.
      if (/\.[a-z0-9]{2,5}$/i.test(target) && !/\.md$/i.test(target)) {
        const candidates = [
          path.join(VAULT_ROOT, target),
          path.join(VAULT_ROOT, path.dirname(doc.path), target),
        ];
        if (!candidates.some((file) => fs.existsSync(file))) brokenLinks.push({ from: doc.path, target });
        continue;
      }
      const hit = resolve(target);
      if (hit) inbound.set(hit, inbound.get(hit) + (hit === doc.path ? 0 : 1));
      else brokenLinks.push({ from: doc.path, target });
    }
  }

  const frontmatter = [];
  const stale = [];
  const oversized = [];
  for (const doc of docs) {
    if (STANDARD.exempt.includes(doc.path) || doc.path.startsWith("Inbox/")) continue;
    const problems = [];
    if (!doc.hasFrontmatter) problems.push("missing frontmatter");
    for (const key of STANDARD.required) {
      if (doc.hasFrontmatter && (doc.meta[key] === undefined || asList(doc.meta[key]).length === 0)) {
        problems.push(`missing ${key}`);
      }
    }
    if (doc.meta.type && !STANDARD.types.includes(doc.meta.type)) problems.push(`unknown type "${doc.meta.type}"`);
    if (doc.meta.status && !STANDARD.statuses.includes(doc.meta.status)) problems.push(`unknown status "${doc.meta.status}"`);
    if (doc.meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(doc.meta.updated)) problems.push("updated is not YYYY-MM-DD");
    if (problems.length) frontmatter.push({ path: doc.path, problems });
    if (doc.meta.updated && doc.meta.updated < cutoff) stale.push({ path: doc.path, updated: doc.meta.updated });
    if (doc.lines > STANDARD.maxLines) oversized.push({ path: doc.path, lines: doc.lines });
  }

  const orphans = docs
    .filter((doc) => inbound.get(doc.path) === 0)
    .filter((doc) => !STANDARD.entryPoints.includes(doc.path) && !doc.path.startsWith("Inbox/"))
    .map((doc) => doc.path);

  const issues = brokenLinks.length + frontmatter.length + orphans.length;
  return {
    ok: issues === 0,
    notes: docs.length,
    summary: {
      broken_links: brokenLinks.length,
      frontmatter_issues: frontmatter.length,
      orphans: orphans.length,
      stale: stale.length,
      oversized: oversized.length,
    },
    broken_links: brokenLinks,
    frontmatter,
    orphans,
    stale,
    oversized,
    note: "ok counts broken links, frontmatter issues, and orphans. Stale and oversized notes are warnings.",
  };
}

function parseTable(section) {
  const rows = section
    .split(/\r?\n/)
    .filter((line) => /^\|.*\|\s*$/.test(line.trim()))
    .map((line) => line.trim().slice(1, -1).split("|").map((cell) => cell.trim()));
  if (rows.length < 2) return [];
  const [header, , ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((name, i) => [name.toLowerCase(), cells[i] ?? ""])));
}

function numberOf(value) {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function average(values) {
  const real = values.filter((value) => value !== null);
  if (!real.length) return null;
  return Math.round((real.reduce((sum, value) => sum + value, 0) / real.length) * 100) / 100;
}

function countBy(rows, key) {
  const counts = {};
  for (const row of rows) {
    for (const value of String(row[key] ?? "—").split(/[,+]/).map((item) => item.trim()).filter(Boolean)) {
      counts[value] = (counts[value] ?? 0) + 1;
    }
  }
  return counts;
}

export function metricsSummary({ logPath = "Metrics/execution-log.md", since = "" } = {}) {
  const log = readNote(logPath, { heading: "Log", maxChars: 1_000_000 });
  const rows = parseTable(log.content)
    .filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date ?? ""))
    .filter((row) => !since || row.date >= since);

  const reworkKnown = rows.filter((row) => row.rework && row.rework !== "—");
  const reworked = reworkKnown.filter((row) => /^(yes|sim|true)$/i.test(row.rework) || (numberOf(row.rework) ?? 0) > 0);
  const loops = rows.map((row) => numberOf(row.loops));
  const quality = rows.map((row) => numberOf(row.quality));
  const done = rows.filter((row) => normalize(row.status) === "done").length;

  const reviews = rows.map((row) => numberOf(row.review));
  const isReworked = (row) => reworked.includes(row);
  const firstPass = rows.filter((row) => numberOf(row.loops) === 1 && !isReworked(row));
  const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : null);
  const maxOf = (values) => {
    const real = values.filter((value) => value !== null);
    return real.length ? Math.max(...real) : null;
  };

  const doneRate = pct(done, rows.length);
  const reworkRate = pct(reworked.length, reworkKnown.length);
  const avgQuality = average(quality);
  const maxLoops = maxOf(loops);
  const maxReview = maxOf(reviews);
  const firstPassRate = loops.some((value) => value !== null) ? pct(firstPass.length, rows.length) : null;
  const verdict = (value, ok) => (value === null ? "not measured" : ok(value) ? "met" : "missed");

  return {
    source: log.path,
    since: since || null,
    tasks: rows.length,
    done_rate_pct: doneRate,
    rework_rate_pct: reworkRate,
    first_pass_rate_pct: firstPassRate,
    avg_loops: average(loops),
    max_review_rounds: maxReview,
    avg_quality: avgQuality,
    by_status: countBy(rows, "status"),
    by_type: countBy(rows, "type"),
    by_model: countBy(rows, "model"),
    by_component: countBy(rows, "skill/mcp"),
    targets: {
      "done rate >= 80%": verdict(doneRate, (value) => value >= 80),
      "rework < 20%": verdict(reworkRate, (value) => value < 20),
      "loops <= 2 per task": verdict(maxLoops, (value) => value <= 2),
      "review <= 2 rounds": verdict(maxReview, (value) => value <= 2),
      "first pass >= 60%": verdict(firstPassRate, (value) => value >= 60),
      "quality >= 4": verdict(avgQuality, (value) => value >= 4),
    },
  };
}

// --- Retrieval (RAG over heading chunks) -------------------------------------

export const RETRIEVE = {
  // Default corpus: the knowledge pack plus the design patterns and minimal validation notes.
  defaultFolders: ["Knowledge"],
  defaultNotes: ["Process/design-patterns.md", "Process/minimal-validation.md"],
  maxChunks: 3,
  maxChunkChars: 1500,
  // Sections deeper than this stay inside their parent chunk.
  chunkLevel: 3,
};

// Rejects absolute paths and `..` segments so retrieval never leaves the vault.
function safeFolder(folder) {
  const clean = String(folder ?? "").replace(/\\/g, "/").trim();
  if (path.isAbsolute(clean) || /^[a-z]:/i.test(clean) || clean.split("/").includes("..")) {
    const error = new Error(`Folder outside the vault: ${folder}`);
    error.code = "EOUTSIDE";
    throw error;
  }
  return clean.replace(/^\/+|\/+$/g, "");
}

// Splits a note body into heading sections (level <= chunkLevel), ignoring code fences.
export function chunkNote(body, { level = RETRIEVE.chunkLevel } = {}) {
  const lines = body.split(/\r?\n/);
  const chunks = [];
  let current = { heading: null, start: 0, lines: [] };
  let fenced = false;
  const flush = () => {
    const text = current.lines.join("\n").trim();
    const content = current.heading === null ? text : current.lines.slice(1).join("\n").trim();
    if (content) chunks.push({ heading: current.heading, line: current.start + 1, text });
  };
  lines.forEach((line, index) => {
    if (/^```/.test(line)) fenced = !fenced;
    const match = !fenced && line.match(/^(#{1,6})\s+(.*)$/);
    if (match && match[1].length <= level) {
      flush();
      current = { heading: match[2].trim(), start: index, lines: [line] };
    } else {
      current.lines.push(line);
    }
  });
  flush();
  return chunks;
}

function retrievalCorpus(docs, folder) {
  if (folder) return docs.filter((doc) => inFolder(doc, folder));
  return docs.filter(
    (doc) =>
      RETRIEVE.defaultFolders.some((item) => inFolder(doc, item)) ||
      RETRIEVE.defaultNotes.some((item) => normalize(item) === normalize(doc.path)),
  );
}

function scoreChunk(doc, chunk, tokens, phrase) {
  const title = normalize(doc.title);
  const heading = normalize(chunk.heading ?? "");
  const body = normalize(chunk.text);
  let score = 0;
  let hits = 0;
  for (const token of tokens) {
    let local = 0;
    if (heading.includes(token)) local += 6;
    if (title.includes(token)) local += 3;
    if (doc.tagText.includes(token)) local += 2;
    // Term frequency, capped so one repetitive section cannot dominate.
    const occurrences = body.split(token).length - 1;
    local += Math.min(occurrences, 5) * 1.5;
    if (local > 0) hits += 1;
    score += local;
  }
  if (phrase.length > 3 && body.includes(phrase)) score += 6;
  return score * (1 + (hits / tokens.length) * 0.5);
}

/**
 * Returns the best heading chunks for a query, each capped at maxChars.
 * Inputs: query (2-8 words), optional folder (relative), limit, maxChars.
 * Output: { corpus, chunks: [{ path, title, heading, citation, score, text, chars, truncated }] }.
 */
export function retrieveChunks(query, { folder = "", limit = RETRIEVE.maxChunks, maxChars = RETRIEVE.maxChunkChars } = {}) {
  const scope = safeFolder(folder);
  const cappedLimit = Math.max(1, Math.min(limit, RETRIEVE.maxChunks));
  const cappedChars = Math.max(200, Math.min(maxChars, RETRIEVE.maxChunkChars));
  const docs = retrievalCorpus(ensureIndex(), scope);
  const corpus = scope ? [scope] : [...RETRIEVE.defaultFolders, ...RETRIEVE.defaultNotes];
  const tokens = tokenize(query);
  const phrase = normalize(query).trim();
  if (!tokens.length) return { corpus, notes: docs.length, chunks: [] };

  const ranked = [];
  for (const doc of docs) {
    for (const chunk of chunkNote(doc.body)) {
      const score = scoreChunk(doc, chunk, tokens, phrase);
      if (score > 0) ranked.push({ doc, chunk, score });
    }
  }

  const chunks = ranked
    .sort((a, b) => b.score - a.score || a.doc.path.localeCompare(b.doc.path) || a.chunk.line - b.chunk.line)
    .slice(0, cappedLimit)
    .map(({ doc, chunk, score }) => {
      const truncated = chunk.text.length > cappedChars;
      const text = truncated ? `${chunk.text.slice(0, cappedChars)}\n[... truncated at ${cappedChars} characters]` : chunk.text;
      return {
        path: doc.path,
        title: doc.title,
        heading: chunk.heading,
        citation: chunk.heading ? `${doc.path}#${chunk.heading}` : doc.path,
        line: chunk.line,
        score: Math.round(score * 100) / 100,
        text,
        chars: Math.min(chunk.text.length, cappedChars),
        truncated,
      };
    });

  return { corpus, notes: docs.length, chunks };
}

export function invalidateIndex() {
  cache = { checkedAt: 0, signature: "", docs: [] };
}
