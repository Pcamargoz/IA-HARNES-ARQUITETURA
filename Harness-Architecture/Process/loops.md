---
title: Loops and Stop Conditions
type: process
status: active
updated: 2026-10-29
tags:
  - hermes
  - loops
  - process
---

# Loops and Stop Conditions

## Principle

Autonomous execution requires an **explicit exit condition**. A loop without a limit is a way to burn tokens and time without converging.

## Anatomy

```
while not done and attempts < limit:
    execute next step
    verify against the criterion
    if ok: done
    else: adjust based on evidence
```

Each iteration must change something: hypothesis, approach, tool, or context. Repeating the same action expecting a different result is failure.

## Limits by task type

| Task | Max attempts | Stop when |
|---|---|---|
| Simple fix | 2 | test passes |
| Feature | 3 per step | criterion met |
| Review | 2 rounds | no blockers/majors |
| Research | 3 searches per question | sources converge |
| Automation | 3 | stable execution |

## Stop conditions

Stop immediately and report when:

1. the criterion was met;
2. the limit was reached;
3. two failures have the same cause;
4. the action needs approval;
5. the cost exceeds the value;
6. the information depends on the user.

## Progress signals

| Signal | Meaning |
|---|---|
| The error changed | progress |
| Fewer tests fail | progress |
| The same error repeats | stuck |
| The context grows without a new fact | stuck |
| The agent starts guessing | regressed |

## Report when stopping

```
Status: blocked
What worked: ...
What failed: ...
Hypothesis: ...
What I need: ...
```

## Loops between agents

- One clarification round per delegation.
- The coordinator closes the loop; agents do not negotiate indefinitely.
- Repeating a request is a sign of a bad brief, not of a lazy agent.

## Anti-patterns

| Anti-pattern | Consequence |
|---|---|
| "Try again" without changing anything | waste |
| Review until perfection | never delivers |
| Retrying an external failure without backoff | rate limit |
| Ignoring the criterion to "improve" | scope creep |
| Hiding the blockage | false done |

## Example

```text
Attempt 1: test fails with TypeError
Attempt 2: fix type, test fails with assertion
Attempt 3: adjust logic, test passes → done
```

Three different failures = progress. The same failure three times = stop.

Related: [[Process/workflow]], [[Metrics/framework]].

## Terminal states and precedence (EVO-04)

Internal pipeline: plan → spec → exec → verify → fix. Runtime terminals are complete, failed, cancelled. Delivery keeps done, partial, blocked: complete maps to done; failed/cancelled normally maps to partial or blocked with the cause.

The task-specific limits above remain authoritative: simple fixes stop after two attempts; features after three per stage; reviews after two rounds. Three fixes is a ceiling, not permission to override a lower limit. Two failures with the same cause stop the loop before any automatic model escalation.

Resume only after checking repository state and the last incomplete stage. Cancellation never deletes vault files or the user's work.
