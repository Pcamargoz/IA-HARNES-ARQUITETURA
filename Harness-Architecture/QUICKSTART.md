---
title: Quickstart — 15 Minutes
type: guide
status: active
updated: 2026-10-19
tags:
  - hermes
  - quickstart
---

# Quickstart

Get the vault and the MCP working on a new machine in about 15 minutes.

## 1. Open the vault (2 min)

1. Clone the private repository.
2. In Obsidian: **Open folder as vault**.
3. Open [[HOME]].
4. Read [[AGENTS]] — it is the operating contract.

## 2. Install the MCP (5 min)

Requirements: Node.js 18+.

```bash
cd ".mcp"
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm test
```

All checks must pass. If they do not, see the troubleshooting table in [[MCP]].

## 3. Connect your client (5 min)

Copy the block for your client from [[MCP]] and replace the absolute paths.

Minimal shape:

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

Restart the client. The tool list should show seven `vault_*` tools.

## 4. Verify (2 min)

Ask the agent:

```text
Use hermes-vault. Call vault_index, then search for "standard workflow".
Read only the "Stages and gates" section and list the gates.
```

Expected: the agent returns the gates from [[Process/workflow]] without loading the whole vault.

## 5. First real task (1 min + task time)

Use this structure:

```text
Goal: <one sentence>
Constraints: <time, stack, risk>
Done when: <observable criterion>
Start with vault_index, then load only the relevant area.
```

## 6. Optional: enable writes

Only if an agent must leave drafts:

```env
VAULT_ALLOW_WRITES=1
VAULT_WRITE_ROOTS=Inbox
```

Restart the MCP. Agents write to `Inbox/`; you promote to canonical areas.

## 7. Optional: enable commits

```env
VAULT_ALLOW_GIT=1
```

Requires a Git repository. Agents commit explicit paths with an `agent/<name>:` prefix.

## Checklist

- [ ] Vault opened in Obsidian
- [ ] `npm test` passes
- [ ] MCP client shows seven tools
- [ ] `vault_index` returns the contract
- [ ] `vault_search` finds a known note
- [ ] Writes disabled (default) or restricted to `Inbox/`
- [ ] First task completed with a documented result

## Next

- [[MCP]] — full tool reference and troubleshooting
- [[Process/workflow]] — how work gets done
- [[Agents/roles]] — who does what
- [[Templates]] — copy-paste specs, handoffs, ADRs
- [[Metrics/execution-log]] — record the first task
