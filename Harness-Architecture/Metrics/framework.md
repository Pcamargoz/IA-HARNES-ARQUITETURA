---
title: Metrics Framework
type: metrics
status: active
updated: 2026-10-20
tags:
  - hermes
  - metrics
---

# Metrics Framework

## Principle

Measure to decide, not to decorate. Each metric must answer a question that changes a choice: model, skill, MCP, rule, or process.

## Core metrics

| Metric | Question it answers | Unit |
|---|---|---|
| Cost per task | is this task worth it? | tokens/currency |
| Result quality | did it meet the criterion? | pass/fail or 1–5 |
| Time | how long did it take? | minutes |
| Loops | how many attempts? | count |
| Rework | how much was redone? | % or count |
| Context used | how much was loaded? | tokens |
| Model used | which tier solved it? | name/tier |
| Skill/MCP used | did the component help? | name |

## Derived indicators

Computed from [[Metrics/execution-log]]; `vault_metrics` calculates the ones marked ⚙.

| Indicator | Formula | Question | Target |
|---|---|---|---|
| ⚙ Done rate | `done / tasks` | do tasks close or stall? | ≥ 80% |
| ⚙ Rework rate | `tasks with rework / tasks with rework measured` | is the spec/brief good enough? | < 20% |
| ⚙ Average loops | `Σ loops / tasks` | does execution converge? | ≤ 2 |
| ⚙ Average quality | `Σ quality / rated tasks` | is the bar met? | ≥ 4 |
| ⚙ Review rounds | `max review rounds` | does review stay bounded? | ≤ 2 |
| ⚙ First-pass rate | `tasks with loops = 1 and no rework / tasks` | how often does the first attempt land? | ≥ 60% |
| Cost per point | `cost / quality` per task type | is a tier over- or under-sized? | stable or falling |
| Delegation ROI | `(direct estimate − delegated real) / direct estimate` | did delegating pay off? | > 0 ([[Optimization/delegation-cost]]) |
| Escaped defects | defects found after `done` | does Validate catch problems? | 0 per month |
| Context efficiency | `context used / output size` | are we loading too much? | falling |

Indicators without data stay `not measured` — never fill them with estimates.

## Leading vs lagging

| Leading (act this week) | Lagging (confirms later) |
|---|---|
| tasks without acceptance criteria | rework rate |
| loops > 2 on a task | done rate |
| review rounds > 2 | escaped defects |
| vault health issues (`vault_health`) | cost per point |

Act on leading signals; use lagging ones to adjust targets.

## Quality rubric

Use a simple scale, defined before execution:

| Score | Meaning |
|---|---|
| 5 | met all criteria + evidence, no rework |
| 4 | met all criteria, minor rework |
| 3 | met the criteria with ressalvas |
| 2 | partially met, required intervention |
| 1 | did not meet, discarded |

Avoid decimal scores without a defined criterion — they look precise and are not.

## Study questions

1. Which model delivers the best result per cost for each task type?
2. Which skills actually reduce time or rework?
3. Which MCPs earn their context cost?
4. Which rules prevent errors?
5. Which processes are ceremony without effect?

## Collection

Minimum viable: log at the end of each relevant task in [[Metrics/execution-log]].

Automatic instrumentation depends on the client. While it does not exist, record manually and mark `—` when a value is not measured.

Aggregation is automatic: the `vault_metrics` MCP tool parses the log and returns the ⚙ indicators, usage by model/component/type, and the target check. Use `since: YYYY-MM-DD` for weekly or monthly windows. Component decisions use [[Metrics/scorecard]].

## Analysis

| Frequency | What to look at |
|---|---|
| Weekly | tasks, loops, rework — ritual in [[Metrics/scorecard]] |
| Monthly | cost by model/task |
| Quarterly | whether skills/MCPs still pay off |

Rules:
- Do not compare tasks of different sizes without normalizing.
- Correlation is not proof; small samples deceive.
- A metric without a decision is noise.

## Targets (initial)

| Target | Why |
|---|---|
| Rework < 20% | quality of spec and brief |
| Loops ≤ 2 per task | convergence |
| Review ≤ 2 rounds | avoids infinite loop |
| Cost stable per task type | efficiency |
| Zero secret incidents | security |

Targets are hypotheses to be adjusted with real data.

## Anti-metrics

- Number of prompts.
- Lines of code.
- Number of agents.
- Number of notes created.
- Tokens saved by skipping verification.

They measure activity, not result.

Related: [[Metrics/execution-log]], [[Metrics/scorecard]], [[Optimization/token-strategy]].
