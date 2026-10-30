---
title: Orchestration and Delegation
type: architecture
status: active
updated: 2026-10-29
tags:
  - hermes
  - orchestration
  - delegation
---

# Orchestration and Delegation

## Principle

Orchestrating is **distributing work and responsibility**, not fanning out calls. Every delegation must answer: what scope, what context, what evidence, who validates.

## When to delegate

Delegate if at least two are true:

- the work needs a specialist domain;
- it is parallelizable without conflicts;
- it requires tools/accounts outside the coordinator's scope;
- the cost of a wrong decision alone is high;
- the scope is large enough that context would degrade.

Do not delegate when:
- the task takes less time than writing the brief;
- the context is hard to transfer and the gain is small;
- the work is sequential and depends on the coordinator's judgment;
- the same information would be sent to three agents.

## Delegation budget

```
cost(delegate) = brief + transferred context + execution + consolidation + risk of rework
```

If this exceeds the estimated cost of executing directly, do it directly.

Practical reference:
- 1–2 files / single question → direct.
- 3–10 files / one domain → direct or one subagent.
- multiple independent fronts → parallel subagents.
- high-risk decision → specialist + coordinator validation.

Detailed model: [[Optimization/delegation-cost]].

## Brief

```text
Objective: one sentence.
Context: only what is needed; no irrelevant private data.
Scope: what to do. Out of scope: what not to do.
Acceptance criteria: verifiable.
Expected evidence: test, file, source.
Constraints: deadline, stack, security.
Approvals: what is already authorized.
Expected status: done | partial | blocked.
```

## Topologies

| Topology | Use | Risk |
|---|---|---|
| Direct | small task | none |
| Sequential | dependent stages | accumulated latency |
| Parallel | independent fronts | duplicated context |
| Specialist + coordinator | high risk | slow decision |

## Consolidation

1. Compare results against the same criterion.
2. Resolve conflicts with evidence, not preference.
3. Summarize in 2–5 lines per front.
4. Discard redundant context.
5. Record only durable decisions.

## Avoiding loops between agents

- No agent asks another for something it can find in the vault.
- No ping-pong: the coordinator decides when to close.
- Each delegation has a maximum of one round of clarification.
- Two failed attempts → escalate to the user with the evidence.

## Quality gates

- Brief reviewed before sending.
- Result checked before consolidating.
- Evidence attached to delivery.
- Cost/time recorded when measurable.

## Anti-patterns

| Anti-pattern | Effect |
|---|---|
| Delegating to "save effort" without a brief | rework |
| Sending the whole vault in the context | cost and noise |
| Many agents on the same file | conflicts |
| Reviewing during execution | interruption |
| Trusting a summary without evidence | silent errors |

## Bounded delegation contract (EVO-03)

- No more than six concurrent children and two levels including the coordinator; a lower client limit wins.
- Children do not delegate. The coordinator schedules dependencies and owns consolidation.
- Assign one writer per file. Shared manifests, lockfiles and canonical notes remain with the coordinator.
- A child receives only the context within its declared budget, not a whole vault.
- Reuse only an implemented agent whose adapter and permissions pass [[Security/runtime-policy]].
- Cancelled or failed work returns evidence and the last completed stage. No silent retries or peer loops.

## Working state outside the vault (EVO-08)

In an explicitly authorized project repository, keep short-lived state in .harness/state.json, .harness/plans/, .harness/handoffs/ and .harness/notepad.md; add .harness/ to that project's .gitignore when adopting this convention. Do not create it in this vault automatically.

State contains task id, stage, status, owned paths, evidence references and next step; no credentials or raw private documents. Revalidate git status before resuming. Cancellation marks the task cancelled; deleting state requires authorization and never deletes project artifacts or vault files. The durable decision remains an ADR; temporary state is not another source of truth.

## Agent execution through AgentPort (EVO-11)

Retrieve get_runtime_architecture(component="port") for the contract and list_agent_adapters for declarations and manifest age. The coordinator records adapter id, implementation status, current availability, required capabilities, permission mode and timeout in the handoff.

The contract is init → send → receive → cancel/dispose, but availability and authentication must be checked before send. init currently checks CLI version; it does not itself prove login. The MCP tools retrieve architecture and metadata; they do not execute agents. No CLI adapter is promoted or launched merely by reading these tools. Execution gates and kill switch: [[Security/runtime-policy]].
