---
title: "LangChain4j"
type: tool
category: agent-framework
status: radar
description: "Biblioteca Java para LLMs com AI Services declarativos, RAG, tools e clientes MCP; alternativa ao Spring AI."
score: 76
verified_at: 2026-10-29
integration: "Dependência Maven/Gradle; integração Spring Boot"
license: "Apache-2.0"
repo: https://github.com/langchain4j/langchain4j
docs: "https://docs.langchain4j.dev (link conhecido; não reaberto nesta rodada)"
stars: 13323
last_push: "2026-10-28"
last_release: "1.23.0 (2026-10-28)"
open_issues: 1062
adoption: "radar"
tags: [ai-agent-ecosystem, tool, java, framework, llm]
updated: 2026-10-29
---
# LangChain4j

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | LangChain4j |
| Categoria | `agent-framework` |
| Status na pesquisa | `radar` (nota 76/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/langchain4j/langchain4j |
| Documentação oficial | https://docs.langchain4j.dev (link conhecido; não reaberto nesta rodada) |
| Estrelas / issues abertas | 13323 / 1062 |
| Último push / release | 2026-10-28 / 1.23.0 (2026-10-28) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Biblioteca Java para LLMs com AI Services declarativos, RAG, tools e clientes MCP; alternativa ao Spring AI.

## Problema que resolve
Integrar LLMs em Java fora do modelo de programação do Spring ou com APIs declarativas.

## Casos de uso
- Prototipar IA embarcada em serviço Java
- Comparar com Spring AI antes da F5

## Funcionalidades principais
- AI Services (interfaces anotadas)
- RAG
- Tools e cliente MCP

## Requisitos
- Java 17+ (verificar a versão mínima na doc)

## Compatibilidade
- Spring Boot via starters

## Limitações
- Sobreposição com Spring AI: usar os dois aumenta complexidade

## Segurança
- Chaves via secret/env

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Manter no radar; decidir na [[Technology-Comparisons]]

## Integração com o Harness
Sem impacto direto no Harness.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 76 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Spring-AI]] · [[Technology-Comparisons]] · [[Repository-Catalog]]
