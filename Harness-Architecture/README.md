---
title: README — Repository Setup
type: guide
status: active
updated: 2026-10-20
tags:
  - hermes
  - setup
  - mcp
---

# Hermes — Vault Repository

Obsidian vault + MCP server in a single Git repository. Clone it on any machine, open it in Obsidian, and connect your agents.

For the full MCP manual, see [[MCP]]. For a 15-minute setup, see [[QUICKSTART]]. To onboard an agent, paste [[INITIAL-PROMPT]].

## Structure

```
HARNESS IA/
├── HOME.md                  # central index
├── AGENTS.md                # global agent contract
├── INITIAL-PROMPT.md        # bootstrap prompt for any LLM
├── MCP.md                   # MCP usage guide
├── QUICKSTART.md            # 15-minute setup
├── Templates.md             # copy-paste artifacts
├── Ideas.md                 # original vision (preserved)
├── Governance/              # vision, ADRs, glossary, standards
├── HARNESS/
│   ├── HARNESS MAIN/        # architecture, main agent, orchestration
│   └── LLM MODELS/          # models and routing
├── Memory Agents/           # memory and context
├── Process/                 # workflow, spec, review, loops, delivery
├── Optimization/            # tokens, delegation, catalogs
├── Metrics/                 # indicators and log
├── Agents/                  # role cards
├── Security/                # permissions and autonomy
├── Inbox/                   # only free-write area for agents
└── .mcp/                    # MCP server (Obsidian ignores hidden folders)
```

## 1. Clone and open

```bash
git clone <private-repo-url> "HARNESS IA"
```

In Obsidian: **Open folder as vault** → select the folder. Obsidian ignores `.mcp/` because it is a hidden folder.

## 2. Install the MCP

Requirements: Node.js 18+ (tested on 24) and npm.

```bash
cd ".mcp"
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm test
```

The server uses **stdio** — it opens no port and exposes no network.

## 3. Configure your client

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "node",
      "args": ["C:/path/to/HARNESS IA/.mcp/src/index.mjs"],
      "env": { "VAULT_ROOT": "C:/path/to/HARNESS IA" }
    }
  }
}
```

On macOS/Linux, use `/Users/.../HARNESS IA/.mcp/src/index.mjs`.

Client-specific instructions (Claude Desktop, Cursor, OpenCode, generic stdio) are in [[MCP]].

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VAULT_ROOT` | parent of `.mcp` | Vault root |
| `VAULT_ALLOW_WRITES` | `0` | `1` enables writes |
| `VAULT_WRITE_ROOTS` | `Inbox` | Writable folders (comma-separated) |
| `VAULT_ALLOW_GIT` | `0` | `1` enables commits via MCP |
| `VAULT_MAX_READ_CHARS` | `20000` | Read cap per call |
| `VAULT_INDEX_TTL_MS` | `3000` | How long the index is trusted before checking disk (`0` = always) |
| `VAULT_STALE_DAYS` | `90` | Age at which `vault_health` flags a note as stale |

## 4. Tools

| Tool | Purpose | Writes |
|---|---|---|
| `vault_index` | Compact map: contract + areas | no |
| `vault_search` | Lexical search with ranking and snippets | no |
| `vault_read` | Read a note or a section | no |
| `vault_outline` | Headings with section sizes + frontmatter | no |
| `vault_list` | List notes in a folder | no |
| `vault_links` | Outgoing links and backlinks | no |
| `vault_query` | Filter by type, status, tag, updated range | no |
| `vault_recent` | Recently modified notes | no |
| `vault_health` | Audit links, frontmatter, orphans, stale/oversized | no |
| `vault_metrics` | Aggregate the execution log against targets | no |
| `vault_write` | Create/update a note (requires `VAULT_ALLOW_WRITES=1`) | yes |
| `vault_commit` | Git commit (requires `VAULT_ALLOW_GIT=1`) | yes |

Full reference in [[MCP]] and [[Optimization/mcp-catalog]].

## 5. Git flow between machines

```bash
git pull --rebase
# work / use the agents
git add -A && git commit -m "vault: <summary>"
git push
```

- Always `pull` before editing on another machine.
- Agents write to `Inbox/`; you promote to the canonical area.
- `.obsidian/workspace.json` stays out of Git (layout noise).
- Avoid versioning large binary attachments; prefer external links.

## 6. First publish

If the folder is not a repository yet:

```bash
git init
git add .
git commit -m "hermes: initial vault and MCP"
git branch -M main
git remote add origin <private-repo-url>
git push -u origin main
```

Then clone on the other machines. `node_modules` and `.env` stay out of Git.

## 7. Maintenance

- Run `npm test` after any MCP change.
- Review broken links monthly in Obsidian (or run `npm run check:links`).
- Update `updated:` in the frontmatter of changed notes.
- Record structural decisions in [[Governance/decisions]].
- Follow [[Governance/documentation-standards]].

## Known limitations

- Search is **lexical** (no embeddings). Real semantic search is on the roadmap.
- The MCP does not index `.obsidian/`, `.git/`, `node_modules/`, or attachments.
- Writes are blocked by default; enable only when needed.
- Metrics collection is manual until client instrumentation exists.
