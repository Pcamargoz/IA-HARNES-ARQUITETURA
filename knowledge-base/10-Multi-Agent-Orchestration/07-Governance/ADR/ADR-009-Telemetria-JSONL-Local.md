---
title: "ADR-009 — Telemetria JSONL local, fora do cofre"
type: adr
status: proposed
date: 2026-10-29
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, orchestration]
---
# ADR-009 — Telemetria JSONL local, fora do cofre

**Status:** proposed · 2026-10-29

## Contexto
Métricas do Harness são manuais; R9 propõe JSONL e depois OTel GenAI.

## Decisão
Começar com JSONL local (schema `akm.orchestration.v1`) fora do cofre, sem prompts nem conteúdo de notas. OTel/Langfuse/Phoenix só depois de nova ADR.

## Consequências
Baixo custo e sem dependência; precisa de agregação manual ou script.
