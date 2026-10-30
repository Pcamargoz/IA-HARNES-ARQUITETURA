---
title: "LiteLLM"
type: tool
category: llm-gateway
status: radar
description: "Gateway/SDK que unifica 100+ provedores de LLM numa API compatível com OpenAI, com orçamentos, logs e roteamento."
score: 74
verified_at: 2026-10-29
integration: "Proxy/gateway compatível com OpenAI"
license: "NOASSERTION na API (verificar)"
repo: https://github.com/BerriAI/litellm
docs: "README do repositório"
stars: 62327
last_push: "(não registrado)"
last_release: "v1.106.6 (28/10, primeira consulta — não reconfirmado)"
open_issues: 5609
adoption: "radar"
tags: [ai-agent-ecosystem, tool, llm-gateway, routing, cost]
updated: 2026-10-29
---
# LiteLLM

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | LiteLLM |
| Categoria | `llm-gateway` |
| Status na pesquisa | `radar` (nota 74/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/BerriAI/litellm |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 62327 / 5609 |
| Último push / release | (não registrado) / v1.106.6 (28/10, primeira consulta — não reconfirmado) |
| Licença | NOASSERTION na API (verificar) |
| Verificado em | 2026-10-29 |

## Descrição
Gateway/SDK que unifica 100+ provedores de LLM numa API compatível com OpenAI, com orçamentos, logs e roteamento.

## Problema que resolve
Roteamento de modelos por custo e controle de gasto entre vários agentes.

## Casos de uso
- Centralizar chaves e orçamentos se houver vários provedores

## Funcionalidades principais
- API unificada
- Budgets e logging
- Fallbacks

## Requisitos
- Python ou Docker

## Compatibilidade
- Clientes que aceitem base URL OpenAI-compatível

## Limitações
- 5609 issues abertas
- Overhead operacional para uso pessoal

## Segurança
- Concentra chaves de provedores: alto valor como alvo

## Licença
NOASSERTION na API (verificar). Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Radar; não necessário enquanto o uso for Claude via assinatura

## Integração com o Harness
Relacionado a `HARNESS/LLM MODELS/models.md` (matriz de roteamento) — só se houver multi-provedor.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 74 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Claude-Code-Router]] · [[Roteamento-de-Modelos]] · [[Repository-Catalog]]
