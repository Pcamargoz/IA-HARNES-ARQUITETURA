---
title: "E2 — Basic Memory como memória compartilhada"
type: experiment
status: planned
updated: 2026-10-29
tags: [ai-agent-ecosystem, experiment, memory]
---
# E2 — Basic Memory como memória compartilhada

## Hipótese
Uma memória em Markdown local ([[Basic-Memory]]) permite que Claude Code e Claude Desktop (sessões do Harness) compartilhem fatos sem conflito e com auditoria no Obsidian.

## Preparação
- Projeto do Basic Memory em **pasta dedicada** (fora do Cofre principal e do Harness).
- Formato dos fatos segue o schema do Harness: fact / scope / source / date / expires.
- Licença AGPL-3.0: uso local apenas.

## Procedimento
1. Registrar 10 fatos de teste (preferências, decisões de projeto) por um cliente.
2. Recuperar pelos outros dois clientes com perguntas parafraseadas.
3. Introduzir 1 atualização de fato e verificar se há conflito/duplicata.

## Critérios
≥ 8/10 fatos recuperados em cada um dos 3 clientes; zero conflitos; nenhuma escrita fora da pasta dedicada.

## Riscos
Ferramenta escreve (diferente do Agent-Knowledge-MCP).

## Resultado
Não executado.
