---
title: "Spring AI"
type: tool
category: agent-framework
status: top10
description: "Framework do ecossistema Spring para aplicações com IA: ChatClient, advisors, tool calling, RAG/vector stores e starters MCP (client e server) sobre o SDK Java oficial."
score: 83
verified_at: 2026-10-29
integration: "Dependência Maven/Gradle; starters de MCP client/server"
license: "Apache-2.0"
repo: https://github.com/spring-projects/spring-ai
docs: "https://docs.spring.io/spring-ai/reference/ (link conhecido; não reaberto nesta rodada)"
stars: 9603
last_push: "2026-10-29"
last_release: "v2.0.2 (2026-10-23)"
open_issues: 1575
adoption: "avaliar (F5)"
tags: [ai-agent-ecosystem, tool, java, spring, framework, mcp]
updated: 2026-10-29
---
# Spring AI

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Spring AI |
| Categoria | `agent-framework` |
| Status na pesquisa | `top10` (nota 83/100) |
| Adoção no ambiente | avaliar (F5) |
| Repositório oficial | https://github.com/spring-projects/spring-ai |
| Documentação oficial | https://docs.spring.io/spring-ai/reference/ (link conhecido; não reaberto nesta rodada) |
| Estrelas / issues abertas | 9603 / 1575 |
| Último push / release | 2026-10-29 / v2.0.2 (2026-10-23) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Framework do ecossistema Spring para aplicações com IA: ChatClient, advisors, tool calling, RAG/vector stores e starters MCP (client e server) sobre o SDK Java oficial.

## Problema que resolve
Expor o domínio (ex.: regras de reserva, Control Free) como ferramentas MCP e integrar LLMs em apps Spring sem código ad hoc.

## Casos de uso
- F5: servidor MCP do domínio em Spring Boot
- IA embarcada em serviços (ver [[Estudos/Spring boot + IA/Sobre as dependenicias do spring boot iA|estudos de Spring + IA]])

## Funcionalidades principais
- ChatClient e advisors
- Tool calling
- Starters de MCP server/client
- Integração com vector stores

## Requisitos
- Spring AI 2.x exige **Spring Boot 4.x**; 1.1.x para Boot 3.5.x
- Java 17+ (stack do Pedro: Java 21, Boot 4.1.1 → 2.x é compatível em tese)

## Compatibilidade
- Stack do [[Skills para main agents/Índice das Skills|Índice das Skills]] (Boot 4.1.1, Cloud 2025.1.3)

## Limitações
- 1575 issues abertas
- APIs ainda evoluindo entre majors

## Segurança
- Chaves de provedor via config externa/secret, nunca no repositório

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Escolher **um** entre Spring AI e LangChain4j por projeto ([[Technology-Comparisons]])
- Começar por um MCP server de domínio pequeno e read-only

## Integração com o Harness
Camada **Execution** (servidores MCP de domínio). Não afeta o Harness diretamente; entra na F5 do roadmap.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `top10` · nota 83 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (F5)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[LangChain4j]] · [[MCP-Java-SDK]] · [[Embabel-Agent]] · [[Technology-Comparisons]] · [[Repository-Catalog]]
