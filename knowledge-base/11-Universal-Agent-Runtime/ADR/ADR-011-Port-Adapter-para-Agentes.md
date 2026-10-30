---
title: "ADR-011 — Ports & Adapters para delegar a agentes"
type: adr
status: accepted
date: 2026-10-29
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, runtime]
---
# ADR-011 — Ports & Adapters para delegar a agentes

**Status:** accepted · 2026-10-29 (plano de integração aprovado pelo Pedro)

## Contexto
O orquestrador precisa delegar a Claude Code, Codex, cursor-agent, Ollama e outros, cada um com flags, saídas e logins diferentes ([[CLI-Headless-Reference]]).

## Decisão
Um contrato único `AgentPort` ([[Agent-Port-Contract]]) com manifest de capacidades; um adapter por ferramenta. Adapters começam `spec-only` e só viram `implemented` depois de executados em teste.

## Consequências
- Trocar de ferramenta não muda o orquestrador.
- Custo: manter parsers por versão de CLI.
- Adapters não executados nunca são apresentados como funcionando.

## Aprovação e limite

Decisão aceita pelo Pedro na aprovação do plano de integração. Aceitar o contrato não promove adapters spec-only, não comprova execução real e não autoriza automaticamente o experimento com dois agentes.
