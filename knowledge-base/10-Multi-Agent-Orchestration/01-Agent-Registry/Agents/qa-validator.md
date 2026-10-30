---
title: "QA de validação antes do merge"
type: agent-spec
status: implemented
name: qa-validator
role: verifier
description: "Valida antes do merge com a validação mínima do Harness."
use_when: "antes de merge; checar testes e critérios"
avoid_when: "escrever o código que valida"
tier: small
autonomy: A1
level: 3
tools: [Read, Grep, Glob, Bash, agent-knowledge]
disallowed_tools: [Write, Edit]
skills: [frontend-testing-playwright, spring-testing-strategy]
harness_ref: "harness:Knowledge/specialists.md (Engenharia Reversa - QA A); harness:Process/minimal-validation.md"
evidence: "Validação real HARNESS-BOOT-001 no Maestri/Codex: quatro tools MCP nativas respondidas, validador das 13 specs aprovado; fixtures temporárias parcialmente bloqueadas no sandbox. Não é execução pelo adapter CLI AgentPort."
budget: {max_turns: 15, max_retries: 1, timeout_min: 15}
execution_transport: maestri-native-codex
activation_workflow: HARNESS-BOOT-001
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, specialist, qa, verification]
---
# QA de validação antes do merge

**Status:** Implementado · **Papel:** verifier · **Tier:** small · **Autonomia:** A1 · **Nível:** 3 (1=lê, 2=escreve, 3=verifica)

## Missão
Valida antes do merge com a validação mínima do Harness.

## Use quando
antes de merge; checar testes e critérios.

## Não use para
escrever o código que valida.

## Ferramentas
- Permitidas: Read, Grep, Glob, Bash
- Proibidas: Write, Edit

## Skills associadas
`frontend-testing-playwright`, `spring-testing-strategy` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=15 · max_retries=1 · timeout_min=15 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status

Validação real HARNESS-BOOT-001 no Maestri/Codex: quatro tools MCP nativas respondidas, validador das 13 specs aprovado; fixtures temporárias parcialmente bloqueadas no sandbox. Não é execução pelo adapter CLI AgentPort.

- Transporte: maestri-native-codex (sessão supervisionada, sandbox read-only).
- Terminal: Prumo; role local: Harness Technical Validator; workspace: projetos.
- Evidência: Agent-Knowledge-MCP/validation-output/harness-bootstrap-001.json e [[Integracao-Clientes-2026-10-29]].
- Limite: implementação confirmada neste ambiente nativo; adapters AgentPort CLI continuam spec-only. Nenhum modelo/cota/preço diferente foi presumido.
