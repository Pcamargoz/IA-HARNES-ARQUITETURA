---
title: Templates
type: reference
status: active
updated: 2026-10-29
tags:
  - hermes
  - templates
---

# Templates

Copy-paste blocks for the artifacts used across the ecosystem. Keep them short; length is not quality.

## 1. Spec

```markdown
# Spec — <name>

## Objective
<one sentence: what must exist at the end>

## Context
<facts that matter; links to notes>

## Requirements
1. <verifiable>
2. <verifiable>

## Out of scope
- <what will not be done>

## Acceptance criteria
- [ ] <observable>
- [ ] <observable>

## Constraints
<stack, deadline, cost, security>

## Risks
<what can go wrong and the mitigation>
```

## 2. Handoff

```markdown
Objective: <one sentence>
Context: <facts the receiver needs; no irrelevant private data>
Scope: <what to do>
Out of scope: <what not to do>
Acceptance criteria: <verifiable>
Expected evidence: <test, file, source>
Constraints: <deadline, stack, security>
Approvals: <what the user already authorized>
Expected status: done | partial | blocked
```

## 3. ADR

```markdown
## ADR-00N — <title>

**Status:** proposed | accepted | superseded by ADR-00M · YYYY-MM-DD

**Context:** <why a decision is needed>

**Decision:** <what was decided>

**Consequences:** <trade-offs, what changes>
```

## 4. Skill card

```markdown
## <skill-name>

- **Status:** proposed | active | deprecated
- **Purpose:** <one sentence>
- **Triggers:** <when to use>
- **Agents:** <who can use it>
- **Prerequisites:** <tools, access>
- **Inputs:** <what is needed>
- **Steps:** <short summary; details in the skill file>
- **Output:** <artifact>
- **Success criterion:** <verifiable>
- **Cost:** <tokens/complexity>
- **Limitations:** <what it does not cover>
- **File:** <path>
- **Last review:** YYYY-MM-DD
```

## 5. Delivery

```markdown
Status: done | partial | blocked
Result: <2–5 lines, directly>
Evidence: <test, file, command, source>
Open items: <owner and next step>
```

## 6. Task log row

```markdown
| 2026-10-19 | <task> | main | balanced | — | — | 25 min | 1 | 0 | 8 | done | <note> |
```

Use `—` for unmeasured values. Do not estimate as if it were measured.

## 7. Agent bootstrap prompt

```text
You are working inside the Hermes vault.
1. Call vault_index and follow AGENTS.md.
2. Search before reading; read only the relevant section.
3. State the goal and acceptance criterion before acting.
4. Use the workflow gates.
5. Report status with evidence.
6. Write only to Inbox/ if writes are enabled.
```

## 8. Project summary (for long tasks)

```markdown
## Project summary — <name>

Goal:
Decisions:
Files changed:
Open items:
Verified facts:
Next step:
```

Use this before compaction or when switching areas.

## 9. Budgeted delegation supplement (M9, EVO-07)

```text
Owned files:
Required adapter/capabilities:
Permission mode: read-only | workspace-write (explicitly approved)
Context sources and maximum characters/tokens:
max_turns:
max_retries:
timeout_ms:
max_cost_usd: measured ceiling or unavailable
Budget enforcement: client flag | process timeout | orchestrator rule | unavailable
Independent verifier and expected evidence:
Last completed stage / resume point:
```

Do not claim unsupported fields are enforced by a CLI. AgentPort enforces context size and process timeout; spec budgets are orchestration rules unless wired to supported client flags. No worker may enlarge its own budget or permissions.
