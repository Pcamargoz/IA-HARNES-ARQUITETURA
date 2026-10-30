---
title: Permissions and Access
type: security
status: active
updated: 2026-10-19
tags:
  - hermes
  - security
  - permissions
---

# Permissions and Access

## Principle

**Broad reading, narrow writing, explicit approval for the irreversible.**

## Access levels

| Level | Reading | Writing | Example |
|---|---|---|---|
| **L0 — Read** | everything in the vault | nothing | research, review |
| **L1 — Draft** | everything | `Inbox/` | content, proposals |
| **L2 — Canonical** | everything | authorized areas | maintenance |
| **L3 — External** | everything | external actions | publishing, sending |

Default for agents: **L0**. Promote to L1 only when there is a real need.

## MCP configuration

```env
VAULT_ALLOW_WRITES=0          # L0 (default)
# VAULT_ALLOW_WRITES=1
VAULT_WRITE_ROOTS=Inbox       # L1
VAULT_ALLOW_GIT=0             # commits disabled
```

Writes outside `VAULT_WRITE_ROOTS` are rejected by the server, not just by instruction.

## Irreversible actions

Always require explicit approval:

- sending messages or emails;
- publishing content;
- deleting files or data;
- paying, transferring, or contracting;
- force-push or history rewrite;
- changing production permissions;
- rotating or exposing credentials.

## Secrets

- Never store secrets in the vault.
- Never reproduce secrets in answers, logs, or commits.
- Use environment variables or a secret manager.
- If a secret leaks: revoke first, then clean up.

## Data classification

| Class | Rule |
|---|---|
| Public | can be cited |
| Internal | use in context, do not publish |
| Restricted | minimum access; avoid persisting |
| Secret | never in the vault |

## Agent rules

1. Read only what the task needs.
2. Write only where authorized.
3. Ask before any external action.
4. Do not install global dependencies without approval.
5. Do not change shared configuration silently.
6. Report suspicion of exposure immediately.

## Auditing

- Every write keeps a path and timestamp (Git when enabled).
- Critical actions are recorded in the delivery.
- Review permissions quarterly.

Related: [[Security/autonomy]], [[Optimization/mcp-catalog]], [[MCP]].
