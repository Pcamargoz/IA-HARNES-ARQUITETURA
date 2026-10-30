---
title: "ADR-010 — Validação do orquestrador por simulação determinística"
type: adr
status: accepted
date: 2026-10-29
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, orchestration]
---
# ADR-010 — Validação do orquestrador por simulação determinística

**Status:** accepted · 2026-10-29

## Contexto
Validar o desenho sem gastar com LLM nem chamar APIs pagas.

## Decisão
Script Node com o cliente MCP oficial executa os 9 passos com regras fixas (pontuação por termos) e grava handoff + telemetria.

## Consequências
Prova o encadeamento das tools e dos dados, não a qualidade de um LLM real. Teste com LLM fica para depois, com aprovação.
