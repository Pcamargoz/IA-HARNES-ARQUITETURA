# hermes-vault-mcp

Local MCP server (stdio) that exposes the Hermes vault to agents.

## Requirements

- Node.js 18+ (tested on 24)
- npm

## Install

```bash
cd .mcp
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm test
```

## Run

```bash
npm start
```

The MCP client usually starts the process itself. Typical configuration:

```json
{
  "mcpServers": {
    "hermes-vault": {
      "command": "node",
      "args": ["/path/to/HARNESS IA/.mcp/src/index.mjs"],
      "env": { "VAULT_ROOT": "/path/to/HARNESS IA" }
    }
  }
}
```

## Tools

| Tool | Input | Output |
|---|---|---|
| `vault_index` | `include_contract?` | `AGENTS.md` contract + area counts |
| `vault_search` | `query`, `limit?`, `folder?` | paths, score, snippet |
| `vault_read` | `path`, `heading?`, `max_chars?` | note or section content |
| `vault_outline` | `path` | frontmatter + headings with section sizes |
| `vault_list` | `folder?`, `depth?` | note list |
| `vault_links` | `path` | outgoing links and backlinks |
| `vault_query` | `type?`, `status?`, `tag?`, `folder?`, `updated_before?`, `updated_after?`, `limit?` | notes matching frontmatter |
| `vault_recent` | `limit?`, `folder?` | recently modified notes |
| `vault_health` | `stale_days?` | broken links, frontmatter issues, orphans, stale/oversized |
| `vault_metrics` | `since?` | execution-log aggregates vs targets |
| `vault_write` | `path`, `content`, `mode` | create/replace/append (gated) |
| `vault_commit` | `message`, `paths` | Git commit (gated) |

## Security

- Read-only by default.
- Writes require `VAULT_ALLOW_WRITES=1` and a path inside `VAULT_WRITE_ROOTS`.
- `vault_commit` requires `VAULT_ALLOW_GIT=1`.
- Path traversal blocked; limited extensions; no network.

## Limitations

- Lexical search, no embeddings.
- Indexes `.md` only; ignores hidden folders, `node_modules`, `.obsidian`, `.git`.
- Links resolve Obsidian-style: full path first, then bare file name.
- No watcher: the index re-checks the disk after `VAULT_INDEX_TTL_MS` (default 3 s) and after writes.
- Frontmatter parser covers the subset the vault uses (scalars, inline and block lists).

## Tests

```bash
npm test             # smoke (12 tools) + write/refresh + link check
npm run check:links  # validates internal vault links
```
