// Unit tests for vault_retrieve (retrieveChunks / chunkNote) on a throwaway fixture vault.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "hermes-retrieve-"));
function put(relative, content) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const front = (title) => `---\ntitle: ${title}\ntype: guide\nstatus: active\nupdated: 2026-10-20\ntags:\n  - hermes\n---\n`;
put("Knowledge/README.md", `${front("Knowledge Pack")}# Knowledge Pack\n\n## Read order\n\nStart here, then open one specialist note and stop.\n\n## Stop rule\n\nIf the note is not in this folder, search with the MCP.\n`);
put("Knowledge/specialists.md", `${front("Specialists")}# Specialists\n\n## Builder\n\nThe builder reads the contract, its role, and one process note.\n\n\`\`\`md\n## Not a heading inside a fence\n\`\`\`\n`);
put("Process/design-patterns.md", `${front("Design Patterns")}# Design Patterns\n\n## Adapter\n\nAn adapter wraps a foreign API behind PaymentProvider.charge.\n\n## Large\n\n${"padding adapter text ".repeat(400)}\n`);
put("Process/workflow.md", `${front("Workflow")}# Workflow\n\n## Read order\n\nOutside the knowledge pack; vault_search covers it.\n`);

process.env.VAULT_ROOT = root;
process.env.VAULT_INDEX_TTL_MS = "0";
const { chunkNote, retrieveChunks, RETRIEVE } = await import("../src/search.mjs");

const checks = [];
function check(name, condition, detail = "") {
  checks.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}
function throwsOutside(folder) {
  try {
    retrieveChunks("adapter", { folder });
    return false;
  } catch (error) {
    return error.code === "EOUTSIDE";
  }
}

try {
  const chunks = chunkNote("# T\n\n## A\n\nalpha\n\n```\n## fenced\n```\n\n#### Deep\n\nstill A\n\n## B\n\nbeta\n");
  check("chunks split by heading, skip fences and deep headings",
    chunks.map((item) => item.heading).join("|") === "A|B" && chunks[0].text.includes("still A"),
    chunks.map((item) => item.heading).join("|"));

  const knowledge = retrieveChunks("read order");
  check("returns a chunk from Knowledge/", knowledge.chunks[0]?.path === "Knowledge/README.md"
    && knowledge.chunks[0]?.heading === "Read order", knowledge.chunks[0]?.citation);
  check("default corpus excludes other folders", knowledge.chunks.every((item) => item.path !== "Process/workflow.md"));
  check("citation is path#heading", knowledge.chunks[0]?.citation === "Knowledge/README.md#Read order");

  const patterns = retrieveChunks("design patterns adapter");
  check("default corpus includes Process/design-patterns.md",
    patterns.chunks.some((item) => item.path === "Process/design-patterns.md"));

  check("at most 3 chunks", retrieveChunks("adapter", { limit: 10 }).chunks.length <= RETRIEVE.maxChunks);

  const large = retrieveChunks("padding", { maxChars: 99999 });
  const big = large.chunks.find((item) => item.heading === "Large");
  check("large section capped at 1500 chars", big?.truncated === true && big.chars === 1500
    && big.text.length < 1600, `${big?.text.length} chars`);
  check("never returns a whole note", large.chunks.every((item) => !item.text.includes("## Adapter")));

  check("folder override scopes the corpus",
    retrieveChunks("read order", { folder: "Process" }).chunks.every((item) => item.path.startsWith("Process/")));
  check("refuses ../ folder", throwsOutside("../etc"));
  check("refuses nested ../ folder", throwsOutside("Knowledge/../../etc"));
  check("refuses absolute folder", throwsOutside("/etc") && throwsOutside("C:/Windows"));

  check("stopword-only query returns no chunks", retrieveChunks("the and of").chunks.length === 0);
} catch (error) {
  check("runs without exception", false, error.stack);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

const failed = checks.filter((item) => !item.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
