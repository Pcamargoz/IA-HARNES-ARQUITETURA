---
title: IDE, LLM, and Harness Split
type: architecture
status: active
updated: 2026-10-19
tags:
  - hermes
  - ide
  - harness
---

# IDE, LLM, and Harness Split

## Three distinct pieces

| Piece | What it is | What it decides |
|---|---|---|
| **IDE / client** | where the work happens | files, terminal, diffs, extensions |
| **LLM** | who generates | quality of reasoning and code |
| **Harness** | how it operates | context, process, limits, verification |

Changing the model does not fix a missing process. Changing the IDE does not fix bad context. Each layer has its own failure mode.

## Candidates from the original vision

The source note ([[Governance/original-ideas]]) lists:

- **LLM:** Claude Code, Cursor, Grok, or similar.
- **Proprietary harness:** Grok Bot or Hermes Agent.

Interpretation:

- "Claude Code", "Cursor", and "Grok" mix products with different roles — some are clients, some are model families. Choose one **client** and one **model**, not three of each.
- "Hermes" is the harness we are building here; it must be able to run on top of more than one client.
- Avoid locking rules into a single vendor's configuration file: the vault is the source, the client is the adapter.

## What to evaluate in a client

| Criterion | Why it matters |
|---|---|
| MCP support | required to read the vault |
| Tool/terminal quality | execution reliability |
| Diff and review | safe editing |
| Context control | cost and quality |
| Project rules support | loads [[AGENTS]] |
| Portability | macOS and Windows |

## What to evaluate in a model

See [[HARNESS/LLM MODELS/models]]: reasoning, coding, context, tool use, latency, cost.

## Recommended architecture

```
Vault (source of truth)
   ↓ via MCP
Client (Claude Desktop / Cursor / OpenCode / other)
   ↓
Model (chosen per task)
```

The client is replaceable. The vault and the processes are not.

## Fit test

Before adopting a client/model pair, run the same task three times:

1. a small, well-specified bug fix;
2. a feature requiring a search in the vault;
3. a review with an intentional flaw.

Compare: correctness, evidence, context used, and time. Record in [[Metrics/execution-log]].

## Anti-patterns

- Duplicating rules in each client's file.
- Depending on a feature that only exists in one client.
- Choosing a model because of a benchmark, without the fit test.
- Treating the harness as "just a system prompt".
