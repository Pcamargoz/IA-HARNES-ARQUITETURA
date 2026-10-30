---
title: Delegation Cost
type: catalog
status: active
updated: 2026-10-19
tags:
  - hermes
  - optimization
  - delegation
---

# Delegation Cost

## Principle

Delegating has a fixed cost that is easy to ignore: writing the brief, transferring context, and consolidating the result. Below a certain size, delegating costs more than doing it.

## Cost equation

```
cost(delegate) = brief + context + execution + consolidation + risk of rework
cost(direct)   = context + execution + verification
```

Delegate when `cost(delegate) < cost(direct)` **or** when the specialist's quality gain justifies the difference.

## Components

| Component | Grows with |
|---|---|
| Brief | scope ambiguity |
| Context | amount of information the agent does not have |
| Execution | task complexity |
| Consolidation | number of parallel fronts |
| Rework | bad brief or unchecked result |

## Practical table

| Task | Better path |
|---|---|
| 1 file, clear change | direct |
| 2–5 files, one domain | direct or 1 subagent |
| 10+ files, independent areas | parallel subagents |
| High-risk decision | specialist + validation |
| Repetitive task, many times | skill/script, not agent |

## Quality gain

Delegation can pay off even when it is more expensive, if:
- the specialist reduces the error rate;
- the task requires access the coordinator should not have;
- parallelism reduces total time.

In that case, compare **cost of error**, not just tokens.

## How to write a brief that reduces cost

1. Objective in one sentence.
2. Only the necessary context.
3. Explicit scope and out-of-scope.
4. Verifiable acceptance criteria.
5. Expected evidence.
6. Expected status.

See [[Templates]].

## Consolidation cost

- Each additional front adds a summary.
- Prefer 2–3 fronts over 10.
- Ask for a short format: result, evidence, open items.
- Do not ask for the full reasoning.

## When not to delegate

- The task takes less time than the brief.
- The context is hard to transfer.
- The work is sequential.
- The same information would go to several agents.
- The result cannot be verified.

## Indicators

| Indicator | Healthy |
|---|---|
| Rework after delegation | low |
| Briefs needing clarification | < 1 per task |
| Number of fronts per task | 1–4 |
| Cost per delivered result | stable or falling |

## Anti-pattern

Delegating to "save effort" without a criterion produces three costs: the brief, the wrong execution, and the rework.

Related: [[HARNESS/HARNESS MAIN/orchestration]], [[Metrics/execution-log]].
