---
title: "Main Agent (orquestrador)"
type: agent-spec
status: implemented
name: main-agent
role: orchestrator
description: "Ponto único de entrada: entende, decide, orquestra, valida e entrega."
use_when: "qualquer tarefa que chega ao Harness; coordenar subagentes; consolidar resultados"
avoid_when: "trabalho longo de implementação que caiba num Builder; autoaprovação"
tier: balanced
autonomy: A1
level: 2
tools: [Read, Grep, Glob, Edit, Write, Bash, hermes-vault, agent-knowledge]
disallowed_tools: []
skills: [vault-context, short-spec, handoff-brief, delivery-report, tech-lead-orquestracao]
harness_ref: "harness:Agents/roles.md#Main Agent; harness:HARNESS/HARNESS MAIN/main-agent.md"
evidence: "role card no Harness + 2 linhas com Agent=main em Metrics/execution-log.md (2026-10-20, 2026-10-28); executa como sessão do Claude Code lendo AGENTS.md com o MCP hermes-vault (MCP do Harness)"
budget: {max_turns: 60, max_retries: 2, timeout_min: 60}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, orchestrator, main]
---
# Main Agent (orquestrador)

**Status:** Implementado · **Papel:** orchestrator · **Tier:** balanced · **Autonomia:** A1 · **Nível:** 2 (1=lê, 2=escreve, 3=verifica)

## Missão
Ponto único de entrada: entende, decide, orquestra, valida e entrega.

## Use quando
qualquer tarefa que chega ao Harness; coordenar subagentes; consolidar resultados.

## Não use para
trabalho longo de implementação que caiba num Builder; autoaprovação.

## Ferramentas
- Permitidas: Read, Grep, Glob, Edit, Write, Bash, hermes-vault, agent-knowledge
- Proibidas: —

## Skills associadas
`vault-context`, `short-spec`, `handoff-brief`, `delivery-report`, `tech-lead-orquestracao` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=60 · max_retries=2 · timeout_min=60 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
role card no Harness + 2 linhas com Agent=main em Metrics/execution-log.md (2026-10-20, 2026-10-28); executa como sessão do Claude Code lendo AGENTS.md com o MCP hermes-vault (MCP do Harness).

Fonte no Harness (somente leitura): harness:Agents/roles.md#Main Agent; harness:HARNESS/HARNESS MAIN/main-agent.md.
