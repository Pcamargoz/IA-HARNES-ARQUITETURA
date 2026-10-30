---
title: "Postgres MCP Pro (crystaldba)"
type: tool
category: mcp-server
status: radar
description: "Servidor MCP para PostgreSQL focado em análise: planos de execução, recomendação de índices, health checks e execução de SQL com modo restrito."
score: 73
verified_at: 2026-10-29
integration: "MCP stdio (Docker ou uv) com modo de acesso restrito"
license: "MIT"
repo: https://github.com/crystaldba/postgres-mcp
docs: "README do repositório"
stars: 3443
last_push: "2026-08-17"
last_release: "v0.3.0 (2025-05-16)"
open_issues: 96
adoption: "avaliar (dev only)"
tags: [ai-agent-ecosystem, tool, mcp-server, postgres, database]
updated: 2026-10-29
---
# Postgres MCP Pro (crystaldba)

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Postgres MCP Pro (crystaldba) |
| Categoria | `mcp-server` |
| Status na pesquisa | `radar` (nota 73/100) |
| Adoção no ambiente | avaliar (dev only) |
| Repositório oficial | https://github.com/crystaldba/postgres-mcp |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 3443 / 96 |
| Último push / release | 2026-08-17 / v0.3.0 (2025-05-16) |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Servidor MCP para PostgreSQL focado em análise: planos de execução, recomendação de índices, *health checks* e execução de SQL com modo restrito.

## Problema que resolve
Modelagem e tuning do Postgres do [[Reserva de Mesas - Microservices]] sem o agente ter acesso de escrita ao banco.

## Casos de uso
- Explicar planos e sugerir índices em ambiente de desenvolvimento
- Health check do banco local do docker-compose

## Funcionalidades principais
- Modo restrito (somente leitura) vs irrestrito (segundo README)
- Análise de índices e EXPLAIN
- Checagens de saúde

## Requisitos
- PostgreSQL acessível
- URL de conexão (credencial) via ambiente

## Compatibilidade
- Claude Code/Desktop (stdio)

## Limitações
- **Última release em 2025-05** (manutenção a observar)
- 96 issues abertas

## Segurança
- Somente banco de desenvolvimento e usuário só leitura
- Nunca string de conexão de produção

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar: usar só se a skill [[Skills para main agents/data-modeling-postgres-reservas/SKILL|data-modeling-postgres-reservas]] precisar de dados reais de plano

## Integração com o Harness
Opcional, project scope do Reserva de Mesas, nível L1 (leitura) de `Security/permissions.md`.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 73 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (dev only)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[MCP-Catalog]] · [[Repository-Catalog]]
