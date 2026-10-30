---
title: "Protocolo de handoff"
type: policy
policy_area: handoff
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, handoff]
---
# Protocolo de handoff

1. O orquestrador escolhe o agente (`get_agent_specification`) e o workflow (`find_workflow_template`).
2. Preenche [[Handoff-Template]] — todos os campos; campo desconhecido = "não informado", nunca inventado.
3. Grava o handoff (proposta R8: `.harness/handoffs/<tarefa>.md` no repositório de trabalho; **não** no cofre).
4. O filho responde com `done | partial | blocked`, evidência e itens em aberto.
5. O orquestrador registra o evento `handoff` e `agent_result` na telemetria ([[Telemetry-Schema]]).

Gerado automaticamente pelo script de simulação ([[Validacao-Orquestracao-2026-10-29]]).
