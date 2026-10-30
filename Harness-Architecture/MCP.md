---
title: MCP Usage Guide
type: guide
status: active
updated: 2026-10-24
tags:
  - hermes
  - mcp
  - guide
---

# MCP Usage Guide

The vault ships with `hermes-vault`, a local MCP server that lets any MCP-compatible agent search, read, navigate, and (optionally) write to this knowledge base.

- **Transport:** stdio (no port, no network exposure)
- **Runtime:** Node.js 18+ (tested on Node 24)
- **Location:** `.mcp/`
- **Default mode:** read-only

## 1. Architecture

```mermaid
flowchart LR
    A[Agent / MCP client] -->|stdio JSON-RPC| S[hermes-vault]
    S --> R[Read layer]
    S --> W[Write layer]
    R --> V[(Obsidian vault)]
    W -->|Inbox only| V
    W -.optional.-> G[Git commit]
```

The server builds its in-memory index on first use, skips hidden folders (`.obsidian`, `.git`, `.mcp`) and `node_modules`, rebuilds it after writes, and re-checks the disk at most every `VAULT_INDEX_TTL_MS` so edits made in Obsidian or by another agent show up without a restart.

## 2. Install

```bash
cd ".mcp"
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm test
```

`npm test` runs four checks:

1. read-only smoke test (13 tools, search, retrieve, read, outline, query, recent, health, metrics, blocked write, path traversal);
2. `vault_retrieve` unit tests on a temporary fixture vault (chunking, default corpus, caps, folder traversal);
3. write-enabled test inside `Inbox/`, including index refresh after an external edit;
4. internal link validation for the whole vault.

Expected: all checks pass.

## 3. Configure your client

### Claude Code (this repository)

The repository root has a project-scope `.mcp.json`, so any Claude Code session opened in this folder gets these servers (ADR-010):

| Server | Transport | Auth | Notes |
|---|---|---|---|
| `hermes-vault` | stdio, `node .mcp/src/index.mjs` | none | read-only; `VAULT_ROOT` defaults to the repo root |
| `playwright` | stdio, `cmd /c npx -y @playwright/mcp@0.0.83 --isolated --headless` | none | `cmd /c` is required for `npx` on Windows |
| `firecrawl` | http, `https://mcp.firecrawl.dev/v2/mcp` | none (keyless tier) | 3 tools without a key |

Claude Code asks once to approve project servers. Approve them when a new `claude` session starts in this folder, then check with:

```bash
claude mcp list
```

Each server must show `Connected`. Perplexity is not in `.mcp.json` because it needs a key. To enable it for your user only, without committing the key:

```bash
claude mcp add --scope user --transport http perplexity https://api.perplexity.ai/mcp --header "Authorization: Bearer YOUR_PERPLEXITY_API_KEY"
```

The same pattern unlocks the full Firecrawl tool set: re-add `firecrawl` at user scope with an `Authorization: Bearer` header. Never put keys in `.mcp.json`, the URL, or chat.

### Claude Desktop

Config file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "node",
      "args": ["/absolute/path/to/HARNESS IA/.mcp/src/index.mjs"],
      "env": {
        "VAULT_ROOT": "/absolute/path/to/HARNESS IA"
      }
    }
  }
}
```

On Windows, use forward slashes or escaped backslashes:

```json
"args": ["C:/Users/pedro/Downloads/HARNESS IA/.mcp/src/index.mjs"]
```

### Cursor

Project config: `.cursor/mcp.json` (or the global equivalent).

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "node",
      "args": ["/absolute/path/.mcp/src/index.mjs"],
      "env": { "VAULT_ROOT": "/absolute/path" }
    }
  }
}
```

### OpenCode

`opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "hermes-vault": {
      "type": "local",
      "command": ["node", "/absolute/path/.mcp/src/index.mjs"],
      "environment": { "VAULT_ROOT": "/absolute/path" },
      "enabled": true
    }
  }
}
```

### OpenBot

MCP servers in OpenBot are **global**: add the server once and every agent gets the same tool set. No per-agent configuration is needed.

1. Open **Settings -> MCP servers** and add a server.
2. Fill the fields:

| Field | Value |
|---|---|
| Name | `hermes-vault` |
| Command | `C:/Program Files/nodejs/node.exe` |
| Arguments | `C:/Users/pedro/Downloads/HARNESS IA/.mcp/src/index.mjs` |
| Environment | `VAULT_ROOT=C:/Users/pedro/Downloads/HARNESS IA` |

3. Save and start a new chat. MCP tools are loaded at session start, so the current chat will not see them.

If the client accepts a JSON block (`mcpServers` shape):

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["C:/Users/pedro/Downloads/HARNESS IA/.mcp/src/index.mjs"],
      "env": {
        "VAULT_ROOT": "C:/Users/pedro/Downloads/HARNESS IA"
      }
    }
  }
}
```

Notes:

- Use the absolute `node.exe` path when the client cannot resolve `node` from `PATH`.
- Keep writes disabled (`VAULT_ALLOW_WRITES=0`, the default) until an agent actually needs `vault_write`.
- Verification: the tool list of a new session must show `vault_index`, `vault_search`, `vault_retrieve`, `vault_read`, and the other ten tools. If it does not, the path or the runtime is wrong - check section 9.

#### Enabling writes

Add the write variables to the same environment block, save, and start a new chat:

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "C:/Program Files/nodejs/node.exe",
      "args": ["C:/Users/pedro/Downloads/HARNESS IA/.mcp/src/index.mjs"],
      "env": {
        "VAULT_ROOT": "C:/Users/pedro/Downloads/HARNESS IA",
        "VAULT_ALLOW_WRITES": "1",
        "VAULT_WRITE_ROOTS": "Inbox"
      }
    }
  }
}
```

Add `"VAULT_ALLOW_GIT": "1"` as well to enable `vault_commit` (the vault must already be a Git repository).

Writes stay confined to `Inbox/` unless `VAULT_WRITE_ROOTS` lists other folders, comma-separated. Confirm the change worked by calling `vault_index`: it must report `"writes_enabled": true`. Roll back by removing the variable or setting it to `0`.

### Any other stdio client

Start the process and speak JSON-RPC over stdin/stdout:

```bash
VAULT_ROOT="/absolute/path" node "/absolute/path/.mcp/src/index.mjs"
```

Do not write logs to stdout between messages; the server logs to stderr for this reason.

## 4. Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VAULT_ROOT` | parent of `.mcp` | Vault directory |
| `VAULT_ALLOW_WRITES` | `0` | `1` enables `vault_write` |
| `VAULT_WRITE_ROOTS` | `Inbox` | Comma-separated writable folders |
| `VAULT_ALLOW_GIT` | `0` | `1` enables `vault_commit` |
| `VAULT_MAX_READ_CHARS` | `20000` | Read cap per call |
| `VAULT_INDEX_TTL_MS` | `3000` | Index trust window before re-checking disk (`0` = every call) |
| `VAULT_STALE_DAYS` | `90` | Age at which `vault_health` flags a note as stale |

Recommended: keep writes disabled until an agent actually needs them.

## 5. Tools

### `vault_index`

Bootstrap call. Returns the `AGENTS.md` contract, the vault path, note count, and area map.

```json
{ "name": "vault_index", "arguments": {} }
```

Use it once at the start of a session. It is the cheapest way to learn the rules. When the contract is already in context (for example, loaded from `AGENTS.md` by the client), pass `{ "include_contract": false }` to get only the map.

### `vault_search`

Lexical search ranked by title, filename, tags, headings, and body.

```json
{
  "name": "vault_search",
  "arguments": { "query": "code review", "limit": 5, "folder": "Process" }
}
```

Response (trimmed to one result; real scores depend on the vault content):

```json
{
  "query": "code review",
  "count": 5,
  "results": [
    {
      "path": "Process/code-review.md",
      "title": "Code Review",
      "score": 67.5,
      "snippet": "# Code Review ## Principle"
    }
  ]
}
```

Tips:
- use 2–6 terms, not full sentences;
- search for concepts, not exact phrasing;
- filter with `folder` when you know the area;
- if empty, try synonyms or fewer words.

### `vault_retrieve`

Retrieval-augmented generation (RAG) over the knowledge pack. Splits notes into heading chunks and returns only the best few, each with a citation, inside a fixed token budget. It does not replace `vault_search`: use `vault_retrieve` for operating guidance (specialists, orchestration, design patterns, token rules) and `vault_search` for the rest of the vault.

```json
{
  "name": "vault_retrieve",
  "arguments": { "query": "adapter payment provider" }
}
```

Arguments:

| Argument | Default | Limit | Meaning |
|---|---|---|---|
| `query` | required | — | 2–8 words |
| `folder` | knowledge pack | relative path inside the vault | retrieve from another folder instead |
| `limit` | `3` | max `3` | number of chunks |
| `max_chars` | `1500` | `200`–`1500` | per-chunk cap |

Response (trimmed to one chunk; `notes` is the number of notes in the corpus):

```json
{
  "query": "adapter payment provider",
  "corpus": ["Knowledge", "Process/design-patterns.md", "Process/minimal-validation.md"],
  "notes": 1,
  "count": 3,
  "chunks": [
    {
      "path": "Process/design-patterns.md",
      "title": "Design Patterns",
      "heading": "Adapter — today's bottleneck",
      "citation": "Process/design-patterns.md#Adapter — today's bottleneck",
      "line": 63,
      "score": 40.5,
      "text": "## Adapter — today's bottleneck\n\nThe drawing marks ...",
      "chars": 1133,
      "truncated": false
    }
  ]
}
```

How it works:

1. **Corpus.** Default: every note under `Knowledge/` plus `Process/design-patterns.md` and `Process/minimal-validation.md`. `folder` replaces the default with one folder.
2. **Chunking.** Each note is split at headings of level 1–3; deeper headings stay inside their parent chunk, and headings inside code fences are ignored. Heading-only sections are skipped.
3. **Ranking.** The same lexical tokenizer as `vault_search` (accent-insensitive, stopwords removed). Per term: heading match +6, note title +3, tag +2, body occurrences ×1.5 (capped at 5), plus +6 for the exact phrase and a bonus for covering more terms.
4. **Budget.** At most 3 chunks of at most 1500 characters each (about 1.2k tokens in total). Longer chunks are cut and marked `truncated: true`. A whole note is never returned.

`line` is the chunk's line in the note body (frontmatter excluded), the same convention as `vault_outline`. Follow up with `vault_read(path, heading)` only when the chunk is truncated and you need the rest.

Guards:
- read-only; no network and no embedding API on this path;
- `folder` with `..`, an absolute path, or a drive letter is rejected (`Folder outside the vault`);
- hidden folders (`.git`, `.obsidian`, `.mcp`) are never indexed;
- secrets never belong in the vault, so they are never in the index (see section 8).

A local embedding model may be added later. That requires an ADR in [[Governance/decisions]] first, and the tool's input and output must stay as documented here.

### `vault_read`

Reads a full note or a single section.

```json
{
  "name": "vault_read",
  "arguments": {
    "path": "Process/workflow.md",
    "heading": "Stages and gates"
  }
}
```

- `heading` matches part of the heading text, case-insensitive.
- The section ends at the next heading of the same or higher level.
- `max_chars` caps the response.

Prefer reading a section over a whole note. It is the main token-saving mechanism. An exact heading match wins over a partial one (`"Log"` returns `## Log`, not `# Execution Log`).

### `vault_outline`

Frontmatter plus every heading with its line and section size in characters. Call it before `vault_read` to choose the smallest useful section.

```json
{ "name": "vault_outline", "arguments": { "path": "Process/workflow.md" } }
```

### `vault_query`

Filters by frontmatter without reading bodies. All fields optional: `type`, `status`, `tag`, `folder`, `updated_before`, `updated_after`, `limit`.

```json
{ "name": "vault_query", "arguments": { "type": "catalog", "status": "active" } }
```

### `vault_recent`

Most recently modified notes (`limit`, `folder`). Use it to catch up after another agent or a human edited the vault.

### `vault_health`

Audits the vault against [[Governance/documentation-standards]]: broken links (including attachments), missing or invalid frontmatter, orphan notes, stale `updated` dates (`stale_days`), and notes over 250 lines. `ok` is `true` when there are no broken links, frontmatter issues, or orphans; stale and oversized notes are warnings.

```json
{ "name": "vault_health", "arguments": {} }
```

### `vault_metrics`

Parses the table under `## Log` in [[Metrics/execution-log]] and returns done rate, rework rate, first-pass rate, loops, review rounds, quality, usage by type/model/component, and each target from [[Metrics/framework]] as `met`, `missed`, or `not measured`. Optional `since: "YYYY-MM-DD"`.

```json
{ "name": "vault_metrics", "arguments": { "since": "2026-10-01" } }
```

### `vault_list`

Lists notes in a folder with a depth limit.

```json
{ "name": "vault_list", "arguments": { "folder": "Optimization", "depth": 2 } }
```

### `vault_links`

Returns outgoing links and backlinks for a note.

```json
{ "name": "vault_links", "arguments": { "path": "HOME.md" } }
```

Use it to navigate the graph without loading files.

### `vault_write`

Creates, replaces, or appends content. Disabled by default.

```json
{
  "name": "vault_write",
  "arguments": {
    "path": "Inbox/proposal.md",
    "content": "---\ntitle: Proposal\n---\n# Proposal\n...",
    "mode": "create"
  }
}
```

Modes: `create`, `replace`, `append`.

Guards:
- `VAULT_ALLOW_WRITES=1` required;
- path must be inside `VAULT_WRITE_ROOTS` (default `Inbox`);
- path traversal rejected;
- only text extensions (`.md`, `.txt`, `.yaml`, `.yml`, `.json`, `.canvas`).

Agents should write drafts to `Inbox/`. Promotion into a canonical area is a human decision.

### `vault_commit`

Stages and commits explicit paths. Disabled by default.

```json
{
  "name": "vault_commit",
  "arguments": {
    "message": "agent/main: add proposal",
    "paths": ["Inbox/proposal.md"]
  }
}
```

Requires `VAULT_ALLOW_GIT=1` and a Git repository. Never commit secrets or unrelated files.

## 6. Recommended agent workflow

```mermaid
sequenceDiagram
    participant A as Agent
    participant M as hermes-vault
    A->>M: vault_index
    M-->>A: contract + map
    A->>M: vault_retrieve("delegation cost")
    M-->>A: up to 3 cited chunks
    A->>M: vault_search("delegation cost") (outside the pack)
    M-->>A: ranked notes + snippets
    A->>M: vault_outline(path)
    M-->>A: headings + section sizes
    A->>M: vault_read(path, heading)
    M-->>A: section only
    A->>M: vault_links(path) (optional)
    M-->>A: graph neighbors
    A->>M: vault_write("Inbox/draft.md")
    M-->>A: created
    A->>M: vault_commit(message, paths) (optional)
```

Rules:
1. Bootstrap once per session.
2. Retrieve (knowledge pack) or search (rest of the vault) before reading.
3. Read sections, not whole files (`vault_outline` first when unsure).
4. Stop after three failed searches; change strategy.
5. Never load the whole vault.
6. Write only what is durable and allowed.

## 7. Example prompts for clients

```text
Use the hermes-vault MCP. Start with vault_index.
Find the standard workflow, read only the relevant section,
and summarize the gates I must respect for a medium task.
```

```text
Search the vault for "delegation cost".
Read the section on the break-even rule,
then tell me whether I should delegate a 30-minute task.
```

```text
Draft a new ADR in Inbox/ proposing a semantic search layer.
Use vault_search to check for duplicates first.
Do not promote it to Governance/ without my approval.
```

## 8. Security model

| Control | Behavior |
|---|---|
| Default access | Read-only |
| Write scope | `Inbox/` (configurable) |
| Path traversal | Blocked |
| File types | Text extensions only |
| Read size | Capped |
| Network | None (stdio only) |
| Git | Opt-in, explicit paths |
| Secrets | Never store in the vault |

The server does not read `.obsidian`, `.git`, `node_modules`, or other hidden folders. It does not execute note content.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No tools listed | Wrong path or Node not found | Use absolute paths; check `node --version` |
| `spawn node ENOENT` | Client cannot resolve `node` | Use the absolute `node` binary path |
| `Error: Note not found` | Wrong relative path | Run `vault_search` or `vault_list` |
| Empty search | Accent/synonym mismatch | Use fewer, simpler terms |
| `vault_retrieve` returns nothing | Note is outside the knowledge pack | Pass `folder` or use `vault_search` |
| Write rejected | Writes disabled or outside `Inbox` | Set `VAULT_ALLOW_WRITES=1`, use `Inbox/` |
| Commit rejected | Git disabled or not a repo | Set `VAULT_ALLOW_GIT=1`; run `git init` |
| Stale results | Edit landed inside the TTL window | Wait `VAULT_INDEX_TTL_MS` or set it to `0` |
| `vault_health` not ok | Broken link, frontmatter, or orphan | Fix the listed notes; rerun |
| JSON parse error | A log was printed to stdout | Keep logs on stderr |

## 10. Testing and maintenance

```bash
cd .mcp
npm test              # full suite
npm run test:readonly # server protocol + read tools
npm run test:retrieve # vault_retrieve unit tests
npm run test:write    # write path
npm run check:links   # vault link integrity
```

After changing `src/`, run `npm test` before using the server with agents.

## 11. Extending the server

1. Add the tool in `.mcp/src/index.mjs` with a Zod schema.
2. Put filesystem logic in `.mcp/src/vault.mjs`.
3. Put indexing/ranking logic in `.mcp/src/search.mjs`.
4. Add a smoke check in `.mcp/test/smoke.mjs`.
5. Update this guide and [[Optimization/mcp-catalog]].
6. Record a structural decision in [[Governance/decisions]] if permissions change.

## 12. Remote hosting (not implemented)

Local stdio is intentional. If you later need mobile or cloud agents:

- use **Streamable HTTP** with authentication (bearer token or OAuth);
- prefer a long-running host with a persistent volume (Railway) over serverless (Vercel) for Git/file operations;
- restrict the exposed scope;
- add rate limits and write audit logs;
- write a new ADR before implementing.

See [[Governance/decisions]] (ADR-002) for the rationale.

## 13. Related documents

- [[README]] — repository setup and Git workflow
- [[QUICKSTART]] — 15-minute setup
- [[AGENTS]] — agent contract
- [[Optimization/mcp-catalog]] — MCP catalog
- [[Security/permissions]] — permissions model
