---
title: "ADR-008 — Registro de agentes com status implemented/planned/conceptual"
type: adr
status: accepted
date: 2026-10-29
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, orchestration]
---
# ADR-008 — Registro de agentes com status implemented/planned/conceptual

**Status:** accepted · 2026-10-29

## Contexto
A pesquisa propõe agentes que não existem; o Harness tem role cards sem arquivos de agente.

## Decisão
Cada agente é uma nota `type: agent-spec` com `status` = implemented (existe e tem uso registrado), planned (definido no Harness) ou conceptual (só proposto). O orquestrador só executa `implemented`.

## Consequências
Evita tratar proposta como capacidade real. Promoção exige evidência.
