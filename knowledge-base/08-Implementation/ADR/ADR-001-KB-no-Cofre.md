---
title: "ADR-001 — Base de conhecimento dentro do Cofre do Pedro"
type: adr
status: accepted
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr]
---
# ADR-001 — Base de conhecimento dentro do Cofre do Pedro

## Contexto
O Pedro tem dois vaults: o Cofre (pessoal, 485 notas, pt-BR) e o Harness-Architecture (referência de engenharia, inglês). A pesquisa de ferramentas precisava de um lugar próprio.

## Decisão
Criar `Cofre do Pedro/AI-Agent-Ecosystem/` (00–09) como pasta nova e isolada. Nenhuma nota existente é alterada; links de entrada a partir de notas existentes são **propostas** para o Pedro aprovar.

## Consequências
- (+) O conhecimento fica junto dos projetos e das skills, consultável pelas sessões do Harness. (Nota de 29/10/2026: Hermes fora do escopo do ecossistema do Pedro.)
- (+) O Harness continua fonte única de arquitetura (ADR-001 do Harness preservado).
- (−) Dois vaults a consultar → resolvido pelo [[Agent-Knowledge-MCP]] multi-raiz.
- (−) Obsidian Sync replica a pasta (aceitável; nenhum segredo nela).
