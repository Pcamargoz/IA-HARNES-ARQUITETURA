---
title: "HITL e escalonamento"
type: policy
policy_area: hitl
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, hitl]
---
# HITL e escalonamento

Base: R10 + Harness `Security/autonomy.md`, `Security/permissions.md`, `Process/loops.md`.

## Quando parar e perguntar ao Pedro
- Ação irreversível (lista em [[Execution-Policy]]).
- Informação que só o Pedro tem.
- Duas falhas com a mesma causa; limite de tentativas atingido.
- Custo maior que o valor.
- Mudança de regra global (exige ADR).

## Formato do pedido
Uma pergunta focada, com opções e recomendação; sem anexar contexto irrelevante.

## Mecanismos propostos (não aplicados)
- Hook `PreToolUse` com exit 2 para irreversíveis (Claude Code) — EVO-10.
- Kill switch por variável de ambiente (ex.: `HARNESS_ORCH_DISABLE=1`) — EVO-10.
- Orquestrador headless: pausa com schema de resposta (conceito `interrupt()` do LangGraph).
