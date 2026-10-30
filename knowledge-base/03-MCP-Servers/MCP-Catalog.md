---
title: "Catálogo de MCPs"
type: catalog
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, catalog, mcp]
---
# Catálogo de MCPs

## Em uso (verificado por leitura de configs/notas, sem alterar)
| MCP | Onde | Escopo | Fonte da informação |
|---|---|---|---|
| hermes-vault 0.3.1 (MCP do Harness, não do Hermes Agent) | Harness-Architecture `.mcp.json` | projeto | leitura do `.mcp.json` e `.mcp/` |
| [[Playwright-MCP]] 0.0.83 | Harness-Architecture `.mcp.json` | projeto | idem |
| firecrawl (HTTP) | Harness-Architecture `.mcp.json` | projeto | idem |
| [[Context7]] | Claude Code (user scope) | usuário | `Optimization/mcp-catalog.md` do Harness; skill hermes-agent-operacao |
| Figma | Hermes (fora do escopo do ecossistema do Pedro) | — | skill hermes-agent-operacao (2026-09-20) |

## Implementado nesta entrega (não conectado a nenhum cliente)
| MCP | Estado |
|---|---|
| [[Agent-Knowledge-MCP]] 0.1.0 | build e testes executados no Mac; configs de cliente só como **exemplo** |

## Candidatos avaliados (pesquisa 29/10/2026)
| MCP | Nota | Status | Próximo passo |
|---|---|---|---|
| [[Serena]] | 88 | top10 | E1 |
| [[GitHub-MCP-Server]] | 86 | top10 | F4, read-only |
| [[Basic-Memory]] | 83 | top10 | E2 |
| [[MCP-Reference-Servers]] | 77 | radar | referência |
| [[Repomix]] | 73 | radar | uso pontual |
| [[Postgres-MCP-Pro]] | 73 | radar | só dev |

## Candidatos já listados no Harness (não reavaliados aqui)
modelcontextprotocol/servers, GitHub, Perplexity, Chrome DevTools, Supabase, Notion, Exa (`Optimization/mcp-catalog.md`).

## Regras para adicionar um MCP
1. Somente leitura por padrão; escrita só com escopo restrito e ADR.
2. Escopo de projeto antes de escopo de usuário.
3. Credenciais via env do cliente, nunca em nota ou JSON versionado.
4. Medir o custo de definição das tools (cada tool ocupa contexto).
