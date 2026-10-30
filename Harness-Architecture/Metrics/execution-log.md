---
title: Execution Log
type: metrics
status: active
updated: 2026-10-28
tags:
  - hermes
  - metrics
  - log
---

# Execution Log

One row per relevant task. Use `—` for what was not measured. Do not estimate as if it were measured.

## Columns

| Column | Description |
|---|---|
| Date | YYYY-MM-DD |
| Task | short description |
| Type | feature / fix / docs / research / ops |
| Agent | main / builder / reviewer / researcher / content |
| Model | tier or name |
| Skill/MCP | component used, if any |
| Cost | tokens or currency, if available |
| Time | minutes |
| Loops | number of attempts |
| Review | review rounds (0 if none) |
| Rework | yes/no or % |
| Quality | 1–5 per [[Metrics/framework]] |
| Status | done / partial / blocked |
| Note | what was learned |

## Log

| Date | Task | Type | Agent | Model | Skill/MCP | Cost | Time | Loops | Review | Rework | Quality | Status | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2026-10-20 | Harness v0.2: MCP tools, catalogs, metrics | feature | main | claude-opus-5-5 | hermes-vault, final-code-review | — | — | 2 | 1 | no | — | done | `vault_health` caught an attachment false positive on its first run; tests guarded the fix. |
| 2026-10-28 | ControlFree E8 perfis de acesso + N0 saúde | feature | main | grok-4.7 | hermes-vault | — | — | 2 | 0 | yes | 3 | partial | Anotação no pacote da empresa fechou ciclo no ArchUnit; movida para shared. Suíte com Postgres não rodou: Docker parado. |

## How to fill

1. Add the row at the end of the task (columns may be added; `vault_metrics` reads them by name).
2. Use the real values; if unknown, `—`.
3. In `Note`, write one sentence: what worked, what failed, what to change.
4. Do not create a note per execution.

## When a row becomes a learning

Promote to a note/skill/rule when:
- the same finding appears in 2+ rows;
- it changes a decision (model, component, process);
- it prevents a repeatable error.

Otherwise, the row is enough.

## Privacy

Do not record client names, credentials, personal data, or sensitive content. Describe the task generically.

Related: [[Metrics/framework]], [[Metrics/scorecard]], [[Process/delivery]].
