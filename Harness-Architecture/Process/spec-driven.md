---
title: Spec-Driven Development
type: process
status: active
updated: 2026-10-19
tags:
  - hermes
  - spec
  - process
---

# Spec-Driven Development

## Principle

Write the minimum specification that removes ambiguity, then execute against it. The spec is a **contract**, not a document for its own sake.

## When a spec is needed

| Task | Spec |
|---|---|
| one-line fix | no (objective + criterion in the prompt) |
| small feature | 5–15 lines |
| multi-file feature | 1 page |
| architecture change | 1–2 pages + ADR |

If the spec is longer than the implementation, it is probably wrong.

## Minimum structure

```markdown
# Spec — <name>

## Objective
<one sentence>

## Requirements
1. <verifiable>
2. <verifiable>

## Out of scope
- <explicit>

## Acceptance criteria
- [ ] <observable>

## Constraints
<stack, deadline, risk>

## Risks
<what can go wrong>
```

## Quality criteria for a spec

- **Verifiable:** each requirement can be checked.
- **Bounded:** out-of-scope is explicit.
- **Short:** readable in under 2 minutes.
- **Stable:** changes require a note, not a silent edit.
- **Technology-aware:** respects the project's architecture.

## How it fits the workflow

```
Understand → Spec → Plan → Execute → Validate → Deliver
```

The spec is the gate between understanding and execution. Without it, "done" becomes opinion.

## Without infinite review

The risk of spec-driven work is turning everything into a review loop.

Rules:
1. The spec is reviewed **once**, before execution.
2. The code review happens **at the end**, once, with a limit of two rounds ([[Process/code-review]]).
3. A finding that does not affect the acceptance criteria is a suggestion, not a blocker.
4. Do not reopen the spec during execution unless a real constraint changed.

## Spec vs. plan

| Spec | Plan |
|---|---|
| what must exist | how to get there |
| stable | adjustable |
| acceptance criteria | steps and owners |

## Example

```markdown
# Spec — CSV export

## Objective
Allow exporting the transaction list to CSV.

## Requirements
1. Button on the list screen.
2. File contains all visible columns.
3. Works with 10k rows without freezing the UI.

## Out of scope
- Scheduled export.
- XLSX format.

## Acceptance criteria
- [ ] Export produces a file with a header and N rows.
- [ ] Test with 10k rows completes under 3 s.
```

See [[Templates]] for the copy-paste version.
