---
title: Delivery
type: process
status: active
updated: 2026-10-19
tags:
  - hermes
  - delivery
  - definition-of-done
---

# Delivery

## Definition of Done

A delivery is done when:

- [ ] the acceptance criteria were met;
- [ ] there is verifiable evidence;
- [ ] no blocker remains open;
- [ ] limitations are stated;
- [ ] the next step is clear, if any.

Without all of these, the status is `partial` or `blocked`.

## Format

```
Status: done | partial | blocked
Result: <2–5 lines>
Evidence: <test, file, command, source>
Open items: <what remains and who unblocks it>
```

Rules:
- Status first.
- Result without preamble.
- Evidence is concrete (command, path, link).
- Open items have an owner.

## Examples

### Done

```
Status: done
Result: CSV export implemented with a 10k-row test.
Evidence: `npm test` → 42 passing; src/export/csv.ts
Open items: none.
```

### Partial

```
Status: partial
Result: Export works; the 10k-row UI still freezes.
Evidence: test passes for 1k rows; benchmark at 10k fails.
Open items: move processing to a worker (next step).
```

### Blocked

```
Status: blocked
Result: Cannot test without staging credentials.
Evidence: error 401 on the staging call.
Open items: provide access or use the mock.
```

## What not to do

- "Should work" as evidence.
- Hiding a failure behind a success message.
- Delivering without saying what was not done.
- Attaching a giant log instead of the relevant excerpt.

## Post-delivery

1. Final review, if it applies ([[Process/code-review]]).
2. Record metrics when measurable ([[Metrics/execution-log]]).
3. Promote durable learning to a note, skill, or rule.
4. Close the loop with the user.

## Delivery quality

| Criterion | Question |
|---|---|
| Clarity | can someone else understand it in 30 s? |
| Verifiability | can the evidence be reproduced? |
| Honesty | are the limitations explicit? |
| Economy | is it free of filler? |

Related: [[Templates]], [[Process/workflow]].
