---
title: "Verifier"
type: agent-spec
status: conceptual
name: verifier
role: verifier
description: "Verificador independente sem escrita: VERIFIED/PARTIAL/MISSING por critério com evidência fresca."
use_when: "fim de qualquer execução com critérios de aceite"
avoid_when: "corrigir o que encontrou; aprovar o próprio trabalho"
tier: balanced
autonomy: A1
level: 3
tools: [Read, Grep, Glob, Bash]
disallowed_tools: [Write, Edit]
skills: [final-code-review]
harness_ref: "kb:Harness-Recommendations R5"
evidence: "só proposto (R5); pode nascer do Reviewer do Harness"
budget: {max_turns: 20, max_retries: 1, timeout_min: 15}
owner: pedro
version: 0.1.0
category: orchestration
updated: 2026-10-29
tags: [agent, verification]
---
# Verifier

**Status:** Conceitual · **Papel:** verifier · **Tier:** balanced · **Autonomia:** A1 · **Nível:** 3 (1=lê, 2=escreve, 3=verifica)

## Missão
Verificador independente sem escrita: VERIFIED/PARTIAL/MISSING por critério com evidência fresca.

## Use quando
fim de qualquer execução com critérios de aceite.

## Não use para
corrigir o que encontrou; aprovar o próprio trabalho.

## Ferramentas
- Permitidas: Read, Grep, Glob, Bash
- Proibidas: Write, Edit

## Skills associadas
`final-code-review` (descobrir/confirmar com `find_relevant_skills`; ver divergência de skills em [[Agent-Registry]]).

## Orçamento
max_turns=20 · max_retries=1 · timeout_min=15 — campos não nativos do Claude Code; quem aplica é o orquestrador ou um hook (R2).

## Entrada e saída
- Entrada: handoff do [[Handoff-Protocol]].
- Saída: status `done | partial | blocked`, evidência e itens em aberto.

## Evidência do status
só proposto (R5); pode nascer do Reviewer do Harness.

Fonte no Harness (somente leitura): kb:Harness-Recommendations R5.
