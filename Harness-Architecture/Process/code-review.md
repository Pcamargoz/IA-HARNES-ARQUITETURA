---
title: Code Review
type: process
status: active
updated: 2026-10-19
tags:
  - hermes
  - review
  - quality
---

# Code Review

## Principle

Review **at the end of delivery**, once, against the acceptance criteria. Review is a quality gate, not a parallel activity that interrupts execution.

## When to review

| Situation | Review |
|---|---|
| Trivial change (typo, format) | no |
| Small fix | quick checklist |
| Feature | yes |
| Architecture/high risk | yes + independent reviewer |
| Security/data | yes + specific checklist |

## Order of analysis

1. **Correctness** — does it meet the acceptance criteria?
2. **Safety** — data, permissions, edge cases.
3. **Architecture** — responsibility, dependencies.
4. **Readability** — naming, size, duplication.
5. **Tests** — critical path covered.
6. **Style** — only what the project defines.

Do not comment on style before correctness.

## Severity

| Level | Meaning | Action |
|---|---|---|
| **Blocker** | breaks criterion, security, or data | fix before delivery |
| **Major** | real defect or risk | fix in the delivery |
| **Minor** | improvement with impact | fix if cheap; otherwise record |
| **Nit** | preference | optional; do not block |

A review without severity is noise.

## Limits (avoiding infinite review)

- Maximum **two rounds** per delivery.
- Round 2 only checks blockers and majors from round 1.
- New ideas become backlog, not rework.
- A finding outside the spec scope is a suggestion.

## Checklist

- [ ] The acceptance criteria are met and evidenced.
- [ ] There is no regression in the critical path.
- [ ] Errors and edge cases are handled.
- [ ] There are no secrets or sensitive data in the diff.
- [ ] Permissions and inputs are validated.
- [ ] The diff is minimal and focused.
- [ ] Tests exist for what changed.
- [ ] The documentation/contract was updated, if applicable.

## Review output

```markdown
## Review — <delivery>

Verdict: approve | approve with minors | request changes

### Blockers
- <file:line> — <problem> — <fix>

### Majors
- ...

### Minors / nits
- ...

### What is good
- ...
```

## What not to do

- Rewrite the code silently during review.
- Block on personal preference.
- Review files outside the diff "just in case".
- Open a third round for minors.
- Approve without evidence of tests.

## Reviewer vs author

| Author | Reviewer |
|---|---|
| delivers with evidence | checks the evidence |
| fixes blockers | does not fix silently |
| keeps the diff small | reviews the scope, not the whole repo |

Separate roles when the risk justifies it: [[HARNESS/HARNESS MAIN/orchestration]].
