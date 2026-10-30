---
title: "Spring Boot Implementer"
type: agent-spec
status: conceptual
name: spring-boot-implementer
role: worker
description: "Implementa feature Spring Boot com testes, dentro do handoff."
use_when: "implementar feature Spring Boot com testes"
avoid_when: "revisão; arquitetura nova"
tier: balanced
autonomy: A3
level: 2
tools: [Read, Grep, Glob, Edit, Write, Bash]
disallowed_tools: []
skills: [java-spring-backend-senior, spring-testing-strategy, spring-data-jpa-postgres]
harness_ref: "kb:Harness-Recommendations R2 (exemplo de spec) e Integração Java/Spring"
evidence: "só proposto na pesquisa; nenhum artefato no Harness"
budget: {max_turns: 30, max_retries: 2, timeout_min: 20}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, java, spring, implementation]
---
# Spring Boot Implementer

**Status:** Conceitual · **Papel:** worker · **Tier:** balanced · **Autonomia:** A3 · **Nível:** 2 (1=lê, 2=escreve, 3=verifica)

## Missão
Implementa feature Spring Boot com testes, dentro do handoff.

## Use quando
implementar feature Spring Boot com testes.

## Não use para
revisão; arquitetura nova.

## Ferramentas
- Permitidas: Read, Grep, Glob, Edit, Write, Bash
- Proibidas: —

## Skills associadas
`java-spring-backend-senior`, `spring-testing-strategy`, `spring-data-jpa-postgres` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=30 · max_retries=2 · timeout_min=20 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
só proposto na pesquisa; nenhum artefato no Harness.

Fonte no Harness (somente leitura): kb:Harness-Recommendations R2 (exemplo de spec) e Integração Java/Spring.
