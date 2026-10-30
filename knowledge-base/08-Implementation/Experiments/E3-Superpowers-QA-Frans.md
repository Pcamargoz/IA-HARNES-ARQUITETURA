---
title: "E3 — Superpowers + subagente QA em Haiku"
type: experiment
status: planned
updated: 2026-10-29
tags: [ai-agent-ecosystem, experiment, skills, routing]
---
# E3 — Superpowers + subagente QA em Haiku

## Hipótese
Seguir o fluxo do [[Superpowers]] (spec → plano → TDD → revisão) com um subagente QA em modelo pequeno reduz intervenções e mantém custo.

## Alvo
Projeto “Frans” do Pedro. Repositório e escopo: **a confirmar com o Pedro**.

## Preparação
Subagente `.claude/agents/qa-reviewer.md` (no repositório do projeto, não no Cofre):
```yaml
---
name: qa-reviewer
description: Roda testes e resume falhas (arquivo, teste, mensagem, 20 linhas de stack).
model: haiku
tools: Read, Grep, Bash
---
```
Superpowers instalado como plugin no escopo do projeto.

## Critérios
| Métrica | Critério |
|---|---|
| Intervenções humanas | ≤ 2 |
| Testes | verdes |
| Custo | ≤ baseline +10% |

## Resultado
Não executado.
