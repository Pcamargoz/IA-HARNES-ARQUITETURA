#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ALLOW_GIT,
  ALLOW_WRITES,
  MAX_READ_CHARS,
  STALE_DAYS,
  VAULT_ROOT,
  WRITE_ROOTS,
} from "./config.mjs";
import {
  healthReport,
  linksOf,
  listNotes,
  metricsSummary,
  normalize,
  outlineOf,
  queryNotes,
  readNote,
  recentNotes,
  retrieveChunks,
  searchNotes,
  walkNotes,
} from "./search.mjs";
import { gitCommit, writeNote } from "./vault.mjs";

const { version } = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const server = new McpServer({
  name: "hermes-vault",
  version,
});

function text(value) {
  const body = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: "text", text: body }] };
}

function failure(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      },
    ],
  };
}

function guard(handler) {
  return async (args) => {
    try {
      return await handler(args);
    } catch (error) {
      return failure(error);
    }
  };
}

server.registerTool(
  "vault_index",
  {
    title: "Vault index",
    description:
      "Returns the operating contract (AGENTS.md) and the vault area map. Call this first, before searching. Pass include_contract=false when the contract is already in context.",
    inputSchema: {
      include_contract: z.boolean().default(true),
    },
  },
  guard(async ({ include_contract }) => {
    const agentsPath = path.join(VAULT_ROOT, "AGENTS.md");
    let contract = null;
    if (include_contract && fs.existsSync(agentsPath)) {
      contract = fs.readFileSync(agentsPath, "utf8").slice(0, 8000);
    }
    const notes = walkNotes();
    const areas = new Map();
    for (const file of notes) {
      const rel = path.relative(VAULT_ROOT, file).split(path.sep).join("/");
      const top = rel.includes("/") ? rel.split("/")[0] : "(root)";
      areas.set(top, (areas.get(top) ?? 0) + 1);
    }
    return text({
      vault: VAULT_ROOT,
      server_version: version,
      writes_enabled: ALLOW_WRITES,
      git_enabled: ALLOW_GIT,
      write_roots: WRITE_ROOTS,
      notes: notes.length,
      areas: [...areas.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([area, count]) => ({ area, notes: count })),
      contract,
    });
  }),
);

server.registerTool(
  "vault_search",
  {
    title: "Search notes",
    description:
      "Lexical search ranked by title, tags, headings, and body. Returns path, score, and snippet. Use short terms.",
    inputSchema: {
      query: z.string().min(1).describe("Search terms (2 to 6 words)"),
      limit: z.number().int().min(1).max(20).default(5),
      folder: z.string().optional().describe("Restrict to a folder, e.g. Process"),
    },
  },
  guard(async ({ query, limit, folder }) => {
    const results = searchNotes(query, { limit, folder: folder ?? "" });
    if (!results.length) {
      return text(`No results for "${query}". Try synonyms or fewer terms.`);
    }
    return text({ query, count: results.length, results });
  }),
);

server.registerTool(
  "vault_retrieve",
  {
    title: "Retrieve knowledge chunks",
    description:
      "RAG over the knowledge pack: returns at most 3 heading chunks (<= 1500 chars each) with a citation. Default corpus: Knowledge/ plus Process/design-patterns.md and Process/minimal-validation.md. Local lexical ranking, no network.",
    inputSchema: {
      query: z.string().min(1).describe("Short query (2 to 8 words)"),
      folder: z.string().optional().describe("Relative folder to retrieve from; default is the knowledge pack"),
      limit: z.number().int().min(1).max(3).default(3),
      max_chars: z.number().int().min(200).max(1500).optional().describe("Per-chunk cap"),
    },
  },
  guard(async ({ query, folder, limit, max_chars }) => {
    const result = retrieveChunks(query, { folder: folder ?? "", limit, maxChars: max_chars ?? 1500 });
    if (!result.chunks.length) {
      return text(`No chunks for "${query}" in ${result.corpus.join(", ")}. Try other terms or vault_search.`);
    }
    return text({ query, ...result, count: result.chunks.length });
  }),
);

server.registerTool(
  "vault_read",
  {
    title: "Read note",
    description:
      "Reads a whole note or a single section by heading. Prefer heading to save context.",
    inputSchema: {
      path: z.string().min(1).describe("Relative path, e.g. Process/workflow.md"),
      heading: z.string().optional().describe("Section title substring"),
      max_chars: z.number().int().min(500).max(60000).optional(),
    },
  },
  guard(async ({ path: notePath, heading, max_chars }) => {
    const note = readNote(notePath, {
      heading: heading ?? "",
      maxChars: max_chars ?? MAX_READ_CHARS,
    });
    return text(note);
  }),
);

server.registerTool(
  "vault_list",
  {
    title: "List notes",
    description: "Lists notes in a folder with bounded depth.",
    inputSchema: {
      folder: z.string().default("").describe("Relative folder; empty = root"),
      depth: z.number().int().min(1).max(6).default(2),
    },
  },
  guard(async ({ folder, depth }) => {
    const notes = listNotes(folder ?? "", depth);
    return text({ folder: folder ?? "/", count: notes.length, notes });
  }),
);

server.registerTool(
  "vault_links",
  {
    title: "Note links",
    description:
      "Returns outgoing links and backlinks for a note. Navigate without loading whole files.",
    inputSchema: {
      path: z.string().min(1),
    },
  },
  guard(async ({ path: notePath }) => text(linksOf(notePath))),
);

server.registerTool(
  "vault_outline",
  {
    title: "Note outline",
    description:
      "Returns a note's frontmatter and headings with the size of each section. Use it before vault_read to pick the cheapest section.",
    inputSchema: {
      path: z.string().min(1).describe("Relative path, e.g. Process/workflow.md"),
    },
  },
  guard(async ({ path: notePath }) => text(outlineOf(notePath))),
);

server.registerTool(
  "vault_query",
  {
    title: "Query by frontmatter",
    description:
      "Filters notes by frontmatter fields (type, status, tag, updated range) without reading their bodies.",
    inputSchema: {
      type: z.string().optional().describe("e.g. catalog, process, governance"),
      status: z.string().optional().describe("e.g. active, draft, deprecated"),
      tag: z.string().optional().describe("Exact tag, e.g. mcp"),
      folder: z.string().optional(),
      updated_before: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      updated_after: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      limit: z.number().int().min(1).max(100).default(20),
    },
  },
  guard(async ({ type, status, tag, folder, updated_before, updated_after, limit }) => {
    const notes = queryNotes({
      type,
      status,
      tag,
      folder: folder ?? "",
      updatedBefore: updated_before,
      updatedAfter: updated_after,
      limit,
    });
    return text({ count: notes.length, notes });
  }),
);

server.registerTool(
  "vault_recent",
  {
    title: "Recently changed notes",
    description: "Lists the most recently modified notes. Use it to catch up after another agent worked on the vault.",
    inputSchema: {
      limit: z.number().int().min(1).max(50).default(10),
      folder: z.string().optional(),
    },
  },
  guard(async ({ limit, folder }) => text({ notes: recentNotes({ limit, folder: folder ?? "" }) })),
);

server.registerTool(
  "vault_health",
  {
    title: "Vault health check",
    description:
      "Audits the vault against the documentation standards: broken links, frontmatter issues, orphan notes, stale and oversized notes.",
    inputSchema: {
      stale_days: z.number().int().min(1).max(3650).optional(),
    },
  },
  guard(async ({ stale_days }) => text(healthReport({ staleDays: stale_days ?? STALE_DAYS }))),
);

server.registerTool(
  "vault_metrics",
  {
    title: "Execution metrics summary",
    description:
      "Aggregates Metrics/execution-log.md: tasks, done rate, rework rate, loops, quality, and usage by model and component, checked against the targets.",
    inputSchema: {
      since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Only rows on or after this date"),
    },
  },
  guard(async ({ since }) => text(metricsSummary({ since: since ?? "" }))),
);

server.registerTool(
  "vault_write",
  {
    title: "Write note",
    description:
      "Creates, replaces, or appends content. Requires VAULT_ALLOW_WRITES=1 and a path inside VAULT_WRITE_ROOTS.",
    inputSchema: {
      path: z.string().min(1).describe("Relative path inside Inbox/"),
      content: z.string().describe("Full content or snippet to append"),
      mode: z.enum(["create", "replace", "append"]).default("create"),
    },
  },
  guard(async ({ path: notePath, content, mode }) => {
    const result = writeNote(notePath, content, mode);
    return text({ ok: true, ...result });
  }),
);

server.registerTool(
  "vault_commit",
  {
    title: "Git commit",
    description:
      "Stages and commits the given paths. Requires VAULT_ALLOW_GIT=1 and a Git repository.",
    inputSchema: {
      message: z.string().min(3).describe("Commit message"),
      paths: z.array(z.string().min(1)).min(1).describe("Relative paths"),
    },
  },
  guard(async ({ message, paths }) => text(await gitCommit(message, paths))),
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[hermes-vault] ready at ${normalize(VAULT_ROOT)}`);
