---
title: Autonomy Levels
type: security
status: active
updated: 2026-10-19
tags:
  - hermes
  - security
  - autonomy
---

# Autonomy Levels

## Principle

Autonomy is granted by **risk**, not by convenience. The agent can do more alone where the error is cheap and reversible.

## Levels

| Level | Agent can | Needs approval | Examples |
|---|---|---|---|
| **A0 — Suggest** | propose only | everything | high-risk decisions |
| **A1 — Local read** | read, analyze, plan | any write/action | research, review |
| **A2 — Local write** | write in `Inbox/` | canonical areas, external actions | drafts, specs |
| **A3 — Supervised execution** | execute in the repo, run tests | publish, delete, production | implementation |
| **A4 — Bounded autonomy** | execute and deliver within the criterion | irreversible actions | recurring, well-defined tasks |

Default: **A1**. Each promotion requires a record and a review period.

## Risk classification

| Risk | Criteria | Level |
|---|---|---|
| Low | reversible, local, no sensitive data | A2/A3 |
| Medium | affects shared code or content | A3 |
| High | external, financial, destructive, or personal data | A0/A1 + approval |

## Rules by level

### A0–A1
- Do not write.
- Do not execute external actions.
- Always present evidence and options.

### A2
- Write only to `Inbox/`.
- Do not promote to a canonical area without authorization.
- Keep drafts identifiable.

### A3
- Execute in the project scope.
- Run tests before delivery.
- Stop on a blocker.
- Do not change permissions or infrastructure.

### A4
- Operate within the defined criterion.
- Escalate when the situation leaves the scope.
- Keep a record of each execution.

## Promotion

To increase autonomy:
1. record the history of correct executions;
2. define the explicit scope;
3. define the escalation criterion;
4. review after a trial period.

Demotion is immediate upon a serious failure.

## Failure signals

| Signal | Action |
|---|---|
| Scope drift | back to A1 |
| Unverified delivery | back to A2 |
| Secret exposure | revoke and investigate |
| Repeated rework | review brief/process |

## Autonomy is not absence of supervision

Even at A4, the agent must:
- report status and evidence;
- stop for irreversible actions;
- respect permissions;
- record durable decisions.

Related: [[Security/permissions]], [[Process/loops]], [[AGENTS]].
