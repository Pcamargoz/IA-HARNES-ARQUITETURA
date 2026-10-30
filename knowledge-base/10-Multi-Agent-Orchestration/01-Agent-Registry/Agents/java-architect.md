---
title: "Java Architect"
type: agent-spec
status: conceptual
name: java-architect
role: specialist
description: "Decisões de arquitetura Java/Spring (módulos, contratos, ADRs)."
use_when: "nova arquitetura; ADR técnico; microsserviços"
avoid_when: "implementação rotineira"
tier: frontier
autonomy: A0
level: 1
tools: [Read, Grep, Glob]
disallowed_tools: [Write, Edit, Bash]
skills: [spring-cloud-microservices, api-design-openapi-contratos]
harness_ref: "kb:Harness-Recommendations Integração Java/Spring"
evidence: "só proposto; nenhum artefato"
budget: {max_turns: 15, max_retries: 1, timeout_min: 20}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, java, architecture]
---
# Java Architect

**Status:** Conceitual · **Papel:** specialist · **Tier:** frontier · **Autonomia:** A0 · **Nível:** 1 (1=lê, 2=escreve, 3=verifica)

## Missão
Decisões de arquitetura Java/Spring (módulos, contratos, ADRs).

## Use quando
nova arquitetura; ADR técnico; microsserviços.

## Não use para
implementação rotineira.

## Ferramentas
- Permitidas: Read, Grep, Glob
- Proibidas: Write, Edit, Bash

## Skills associadas
`spring-cloud-microservices`, `api-design-openapi-contratos` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=15 · max_retries=1 · timeout_min=20 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
só proposto; nenhum artefato.

Fonte no Harness (somente leitura): kb:Harness-Recommendations Integração Java/Spring.
