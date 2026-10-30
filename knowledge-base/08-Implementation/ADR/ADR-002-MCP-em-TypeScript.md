---
title: "ADR-002 — MCP em TypeScript com SDK oficial"
type: adr
status: accepted
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, mcp]
---
# ADR-002 — MCP em TypeScript com SDK oficial

## Contexto
O Mac tem Node 22.23.2 (nvm), npm 10.9.8 e Python 3.9.6, sem `uv`. O SDK Python oficial do MCP exige Python ≥ 3.10. Não é permitido instalar nada globalmente.

## Decisão
TypeScript com `@modelcontextprotocol/sdk` 1.32.2, transporte stdio, dependências locais (`npm install` na pasta do projeto). Testes com `node:test` e cliente MCP real do SDK.

## Alternativas
- Python SDK: exigiria Python 3.10+ (instalação nova).
- Java SDK / Spring AI: coerente com a stack, mas JVM no startup e mais peso para um servidor de leitura; fica para o MCP de domínio (F5).

## Consequências
- (+) Roda com o que já existe no Mac; mesmo SDK de referência dos clientes.
- (−) Clientes precisam de Node no PATH. (Hermes fora do escopo do ecossistema do Pedro desde 29/10/2026.)
