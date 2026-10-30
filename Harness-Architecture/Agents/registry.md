---
title: Canonical Agent Registry
type: catalog
status: active
updated: 2026-10-29
tags: [harness, agent-knowledge, integration]
---

# Canonical Agent Registry

## Source of truth

Canonical specs live in the approved KB, not a second Agents/specs directory here:

`cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/*.md`

Use list_registered_agents for metadata and get_agent_specification for the selected agent. The MCP currently reads only that KB area. Creating specs elsewhere will not register an agent.

## Status and factory gates

- implemented: evidence of executable or actual use; no status promotion based on a role card alone.
- planned: designed role; provisioning requires a concrete task, supported client and recorded approval.
- conceptual: research only.
- Factory/provisioning is a controlled workflow, not an installed service: validate spec → verify adapter and authentication → request missing authorization → create client-native definition only when required → execute bounded check → attach evidence → promote status.
- No automatic agent creation or copies of specs. Use [[Agents/roles]] for role contracts.

## Validation

Run `node /Users/macbook/Downloads/Agent-Knowledge-MCP/scripts/validate-harness.mjs`.

Required: unique name, type=agent-spec, honest status, description, tier alias, explicit tools, evidence and positive budgets. Verifiers prohibit Write/Edit. Validation reads only this Harness documentation and the approved KB registry; never .env, project notes or credential files.

## Rollback

Revert this reference and validator changes. Canonical specs and client definitions are not copied or deleted by validation.

## Native operating instances (ADR-013)

| Canonical role | Maestri terminal | Native implementation evidence |
|---|---|---|
| reviewer | Lince | HARNESS-BOOT-001, two independent review rounds; findings returned through terminal inspection |
| qa-validator | Prumo | HARNESS-BOOT-001, four native MCP tools and registry validation; sandbox limitations reported |

Their canonical KB specs now record implemented specifically for maestri-native-codex. Reuse these terminals and their scoped roles. This does not change any AgentPort adapter manifest. CLI adapter execution, Claude hook invocation and Desktop chat acceptance remain separate evidence.
