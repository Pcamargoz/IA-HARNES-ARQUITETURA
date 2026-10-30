---
title: "ADR-012 — Detecção de login só por comando oficial"
type: adr
status: accepted
date: 2026-10-29
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, runtime, seguranca]
---
# ADR-012 — Detecção de login só por comando oficial

**Status:** accepted · 2026-10-29 (plano de integração aprovado pelo Pedro)

## Contexto
Saber se uma CLI está logada é necessário para delegar, mas ler arquivos de credencial expõe segredos.

## Decisão
Login é verificado só pelo comando oficial de status de cada CLI (`claude auth status`, `codex login status`, `cursor-agent status`, `opencode auth list`). Arquivos de credencial nunca são abertos; quando citados, só a existência. E-mails, orgId e ids são removidos da saída. Sem comando oficial → `unknown`.

## Consequências
- Qwen Code fica `unknown` (não há comando de status).
- Nenhum segredo entra no manifest (verificado por teste e por busca no manifest real).

## Aprovação e limite

Decisão aceita pelo Pedro na aprovação do plano de integração. Aceitar o contrato não promove adapters spec-only, não comprova execução real e não autoriza automaticamente o experimento com dois agentes.
