---
title: "OpenCode"
type: tool
category: agent-harness
status: radar
description: "Agente de código open source para terminal (antes em sst/opencode, hoje anomalyco/opencode), com suporte a múltiplos provedores de modelo e MCP."
score: 72
verified_at: 2026-10-29
integration: "Agente de código de terminal, multi-provedor, cliente MCP"
license: "MIT"
repo: https://github.com/anomalyco/opencode
docs: "README do repositório"
stars: 223045
last_push: "2026-10-29"
last_release: "sem release publicada na API"
open_issues: 3801
adoption: "radar"
tags: [ai-agent-ecosystem, tool, harness, coding-agent, open-source]
updated: 2026-10-29
---
# OpenCode

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | OpenCode |
| Categoria | `agent-harness` |
| Status na pesquisa | `radar` (nota 72/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/anomalyco/opencode |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 223045 / 3801 |
| Último push / release | 2026-10-29 / sem release publicada na API |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Agente de código open source para terminal (antes em `sst/opencode`, hoje `anomalyco/opencode`), com suporte a múltiplos provedores de modelo e MCP.

## Problema que resolve
Alternativa ao Claude Code sem lock-in de provedor.

## Casos de uso
- Rodar tarefas baratas com modelos alternativos
- Comparação de harness de cliente

## Funcionalidades principais
- Multi-provedor
- Cliente MCP

## Requisitos
- Ver README

## Compatibilidade
- MCP padrão

## Limitações
- 3801 issues abertas
- Repositório migrou de organização (sst → anomalyco)

## Segurança
- Chaves de provedores locais

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar; considerar só se o custo do Claude Code virar gargalo

## Integração com o Harness
Cabe no modelo cliente/LLM/harness de `HARNESS/LLM MODELS/ide-harness.md`.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 72 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Claude-Code-Router]] · [[Hermes-Agent]] · [[Repository-Catalog]]
