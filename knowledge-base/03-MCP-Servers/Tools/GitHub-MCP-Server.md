---
title: "GitHub MCP Server"
type: tool
category: mcp-server
status: top10
description: "Servidor MCP oficial do GitHub para repositórios, issues, pull requests e Actions, com toolsets selecionáveis e modo somente leitura."
score: 86
verified_at: 2026-10-29
integration: "MCP stdio via Docker (ghcr.io/github/github-mcp-server) com --read-only e toolsets limitados"
license: "MIT"
repo: https://github.com/github/github-mcp-server
docs: "README do repositório"
stars: 34070
last_push: "2026-10-29"
last_release: "v2.0.3 (2026-10-21)"
open_issues: 391
adoption: "avaliar (F4)"
tags: [ai-agent-ecosystem, tool, mcp-server, github, devops]
updated: 2026-10-29
---
# GitHub MCP Server

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | GitHub MCP Server |
| Categoria | `mcp-server` |
| Status na pesquisa | `top10` (nota 86/100) |
| Adoção no ambiente | avaliar (F4) |
| Repositório oficial | https://github.com/github/github-mcp-server |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 34070 / 391 |
| Último push / release | 2026-10-29 / v2.0.3 (2026-10-21) |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Servidor MCP oficial do GitHub para repositórios, issues, pull requests e Actions, com **toolsets** selecionáveis e modo somente leitura.

## Problema que resolve
Agentes de DevOps/QA precisam ler PRs, issues e status de CI sem copiar e colar, com escopo controlado.

## Casos de uso
- Revisão de PR com contexto de diff e comentários
- Triagem de issues
- Ler falhas de GitHub Actions para o agente de QA/DevOps

## Funcionalidades principais
- Toolsets (`GITHUB_TOOLSETS`, ex.: `repos,issues,pull_requests,actions`)
- Flag `--read-only`
- Imagem Docker oficial

## Requisitos
- Docker
- Token do GitHub com escopo mínimo (fine-grained, só leitura) — **fora das notas**

## Compatibilidade
- Claude Code / Claude Desktop (stdio via `docker run`)
- Hermes — fora do escopo do ecossistema do Pedro
- Imagem amd64 para Intel: **não verificada**

## Limitações
- 391 issues abertas
- Toolsets amplos aumentam o número de tools no contexto (custo de tokens por definição de tool)

## Segurança
- Usar token fine-grained somente leitura e `--read-only`
- Nunca registrar o token em nota ou `.mcp.json` versionado; usar env do cliente

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Adotar na F4 em modo read-only com 2–4 toolsets
- Já é *next adoption* no catálogo do Harness — formalizar por ADR

## Integração com o Harness
O Harness já lista GitHub MCP como próxima adoção (read-only). A proposta mantém isso, em **project scope**, alinhado a `Security/permissions.md` (nível L1 leitura).

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
# do README; token vem do ambiente, nunca da nota
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN -e GITHUB_TOOLSETS=repos,issues,pull_requests,actions ghcr.io/github/github-mcp-server stdio --read-only
```

## Status
- Pesquisa: `top10` · nota 86 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (F4)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[MCP-Catalog]] · [[Harness-Improvement-Proposal]] · [[Repository-Catalog]]
