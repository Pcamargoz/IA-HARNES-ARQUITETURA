---
title: "ADR-007 — Orquestração documentada na KB antes de mudar o Harness"
type: adr
status: accepted
date: 2026-10-29
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, orchestration]
---
# ADR-007 — Orquestração documentada na KB antes de mudar o Harness

**Status:** accepted · 2026-10-29

## Contexto
O Pedro pediu um Main Orchestrator; o Harness-Architecture é somente leitura nesta etapa e tem mudanças locais do Pedro não commitadas.

## Decisão
Desenhar orquestrador, registro, protocolos e métricas em `10-Multi-Agent-Orchestration/` e expô-los por tools de leitura do MCP. Mudanças no Harness viram propostas EVO-xx com reversão.

## Consequências
Nada quebra no Harness; o desenho pode ser testado em simulação. Custo: duplicação temporária de conceitos até a migração.
