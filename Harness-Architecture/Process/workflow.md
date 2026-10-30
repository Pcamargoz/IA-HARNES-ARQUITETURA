---
title: Standard Workflow
type: process
status: active
updated: 2026-10-29
tags:
  - hermes
  - workflow
  - process
---

# Standard Workflow

## Principle

The same skeleton for any project: understand before specifying, specify before executing, verify before delivering. Rigor scales with risk — a small task does not need a ceremony, but it does need a criterion.

## Stages and gates

| # | Stage | Output | Gate to advance |
|---|---|---|---|
| 1 | Understand | objective + acceptance criterion | criterion is verifiable |
| 2 | Specify | short spec | scope and out-of-scope explicit |
| 3 | Plan | steps + owners | 3+ steps listed |
| 4 | Execute | artifact | step criterion met |
| 5 | Validate | evidence | test/read-back/source |
| 6 | Deliver | report | status + evidence |
| 7 | Record | note/log | only if durable |

No stage is mandatory for a one-line task — except **understand**, **validate**, and **deliver**.

## 1. Understand

- What must exist at the end?
- How will we know it is done?
- What is the constraint (time, stack, cost, risk)?

If the criterion cannot be written, the task is not ready.

## 2. Specify

Short spec in [[Process/spec-driven]] format. For content work, the spec is the brief (audience, message, format).

## 3. Plan

Use a task list when there are 3+ steps. Each step has an owner and a check.

Do not plan beyond what is known: plan the next stage, execute, re-plan.

## 4. Execute

- Load only the necessary context.
- Follow the project architecture ([[Process/code-architecture]]).
- Keep changes reversible.
- Stop and report when blocked.

## 5. Validate

| Evidence | When |
|---|---|
| automated test | code |
| read-back | write/configuration |
| source | research |
| checklist | content/process |

"Looks right" is not evidence.

The minimum check before a merge, and what blocks it, is in [[Process/minimal-validation]].

## 6. Deliver

```
Status: done | partial | blocked
Result: ...
Evidence: ...
Open items: ...
```

Review happens here, at the end: [[Process/code-review]]. Do not interleave review with execution.

## 7. Record

- Structural decision → ADR.
- Reusable discovery → note in the area.
- Execution data → [[Metrics/execution-log]].

## Adaptation by project type

| Type | Emphasis |
|---|---|
| Software | spec + architecture + tests + review |
| Content | brief + sources + revision |
| Research | question + sources + confidence |
| Automation | input/output + failure handling |

## Flow diagram

```
Understand → Specify → Plan → Execute → Validate → Deliver → Record
      ↑                                      │
      └──────────── correction loop ─────────┘
```

The correction loop has a limit: see [[Process/loops]].

## Common failures

| Failure | Fix |
|---|---|
| Starting to code without a criterion | write the criterion first |
| Spec longer than the task | shorten |
| Review in the middle | move to delivery |
| "Done" without test | validate |
| Infinite correction | stop condition |

## Agent Knowledge gates

During Understand/Plan, follow [[Governance/knowledge-integration]] for progressive retrieval. External API work uses version-appropriate primary documentation before coding; use Context7 only if available and approved.

Before Execute: approved scope, file owners, budgets and runtime permissions are explicit. Before Deliver: each criterion has VERIFIED/PARTIAL/MISSING evidence and independent verification is identified or declared missing. Correction and terminal-state precedence follow [[Process/loops]].
