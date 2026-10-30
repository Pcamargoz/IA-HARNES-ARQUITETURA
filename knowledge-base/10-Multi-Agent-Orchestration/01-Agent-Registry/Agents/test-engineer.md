---
title: "Test Engineer"
type: agent-spec
status: conceptual
name: test-engineer
role: worker
description: "Escreve e mantém testes (unitários, integração, Testcontainers)."
use_when: "cobrir feature com testes; reproduzir bug em teste"
avoid_when: "alterar código de produção além do necessário para testabilidade"
tier: small
autonomy: A3
level: 2
tools: [Read, Grep, Glob, Edit, Write, Bash]
disallowed_tools: []
skills: [spring-testing-strategy, frontend-testing-playwright]
harness_ref: "kb:Harness-Recommendations Integração Java/Spring"
evidence: "só proposto; nenhum artefato"
budget: {max_turns: 25, max_retries: 2, timeout_min: 20}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, tests]
---
# Test Engineer

**Status:** Conceitual · **Papel:** worker · **Tier:** small · **Autonomia:** A3 · **Nível:** 2 (1=lê, 2=escreve, 3=verifica)

## Missão
Escreve e mantém testes (unitários, integração, Testcontainers).

## Use quando
cobrir feature com testes; reproduzir bug em teste.

## Não use para
alterar código de produção além do necessário para testabilidade.

## Ferramentas
- Permitidas: Read, Grep, Glob, Edit, Write, Bash
- Proibidas: —

## Skills associadas
`spring-testing-strategy`, `frontend-testing-playwright` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=25 · max_retries=2 · timeout_min=20 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
só proposto; nenhum artefato.

Fonte no Harness (somente leitura): kb:Harness-Recommendations Integração Java/Spring.
