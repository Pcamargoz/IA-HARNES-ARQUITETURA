---
title: "Protocolo de comunicação entre agentes"
type: policy
policy_area: communication
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, communication]
---
# Protocolo de comunicação entre agentes

- **Hub-and-spoke:** só o orquestrador fala com os filhos; nada de mensagens filho↔filho (Harness `Agents/roles.md`).
- **Meio:** arquivos (handoff + resultado) e retorno da tool de subagente; sem barramento JSON cerimonial (EVITAR: protocolo do VoltAgent).
- **Estado compartilhado:** só leitura do cofre via MCP; escrita no cofre só pelo orquestrador com aprovação.
- **Entre clientes (Claude Code, Desktop; Hermes fora do escopo do ecossistema do Pedro):** a mesma KB via [[Agent-Knowledge-MCP]]; A2A fica no radar ([[A2A-Protocol]]).
Complementa [[Comunicacao-entre-Agentes]] (01-Agent-Orchestration).
