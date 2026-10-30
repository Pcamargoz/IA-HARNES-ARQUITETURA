---
title: Component Scorecard and Review Ritual
type: metrics
status: active
updated: 2026-10-20
tags:
  - hermes
  - metrics
  - scorecard
---

# Component Scorecard and Review Ritual

Turns the [[Metrics/execution-log]] into decisions: which skills, MCPs, plugins, and models stay, get promoted, or get dropped.

## Component scorecard

One row per component that appears in the `Skill/MCP` column. Values come from `vault_metrics` (`by_component`) plus the log notes.

| Component | Kind | Uses (30d) | Helped? | Cost signal | Incidents | Decision | Reviewed |
|---|---|---|---|---|---|---|---|
| hermes-vault | mcp | 1 | yes — health check found a real issue | low | 0 | keep | 2026-10-20 |
| final-code-review | skill | 1 | — | — | 0 | keep (first wave) | 2026-10-20 |

Columns:

- **Uses (30d):** count from `vault_metrics` with `since` = 30 days ago.
- **Helped?:** yes / no / — with one reason taken from the log notes.
- **Cost signal:** low / medium / high context or money per use.
- **Incidents:** wrong output, security event, or breakage caused by the component.
- **Decision:** keep · promote (candidate → active) · watch · drop.

## Decision rules

| Situation | Decision |
|---|---|
| Candidate used in 2+ tasks and helped each time | promote to active in its catalog |
| Active, 0 uses in 90 days | watch; drop at the next quarterly review |
| Any security incident | drop or restrict immediately; record an ADR |
| Helped, but high cost signal | keep, and look for a cheaper path (narrower tool, smaller model) |
| Two components doing the same job | keep the one with better quality per cost; deprecate the other |

## Model scorecard

Same idea per model tier ([[HARNESS/LLM MODELS/models]]): group by `Model` and `Type` in `vault_metrics`, then compare average quality and loops. Move a task type down a tier when quality holds at ≥ 4 on the cheaper one for 3+ tasks.

## Weekly review (15 minutes)

1. Run `vault_metrics` with `since` = last Monday.
2. Run `vault_health`; fix broken links and frontmatter issues first.
3. Check leading signals ([[Metrics/framework]]): loops > 2, review rounds > 2, tasks without criteria.
4. Update this scorecard for every component used during the week.
5. Promote at most one learning from the log to a rule, skill, or note.

## Quarterly review

- Re-verify every catalog entry (repositories moved or archived, servers unmaintained).
- Apply the decision rules to every active component.
- Adjust targets in [[Metrics/framework]] with the real data gathered.

Related: [[Metrics/framework]], [[Optimization/skills-catalog]], [[Optimization/mcp-catalog]], [[Optimization/plugins-catalog]].
