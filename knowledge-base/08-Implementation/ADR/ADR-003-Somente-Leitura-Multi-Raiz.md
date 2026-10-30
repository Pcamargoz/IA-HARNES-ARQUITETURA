---
title: "ADR-003 — MCP somente leitura, multi-raiz com allowlist"
type: adr
status: accepted
date: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, adr, security]
---
# ADR-003 — MCP somente leitura, multi-raiz com allowlist

## Decisão
- Nenhuma tool escreve, move ou apaga. Anotações MCP: readOnlyHint=true, destructiveHint=false.
- Raízes nomeadas (`AKM_VAULT_ROOTS`), cada uma com allowlist de subpastas (`AKM_ROOT_INCLUDE`). Por padrão, no Cofre: só `AI-Agent-Ecosystem` e `Skills para main agents` (a nota do Hermes saiu em 29/10/2026: fora do escopo do ecossistema do Pedro).
- Bloqueios: `..`, caminho absoluto, symlinks, pastas ocultas (`.obsidian`, `.git`), `node_modules`, não-Markdown, arquivo acima do limite, nomes com chave/senha/secret/credencial/api key, padrões extras via `AKM_DENY_PATTERNS`.
- Redação de padrões de token em toda saída.

## Consequências
- Notas com credenciais conhecidas no Cofre (TRADERS FAKALUM) nunca são indexadas, nem mesmo numa varredura completa.
- Escrita de memória fica para outra ferramenta (E2).
