---
title: "Histórico de pesquisas"
type: research-log
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, research, log]
---
# Histórico de pesquisas

Uma seção `##` por rodada, título começando pela data (AAAA-MM-DD) — o MCP (`get_research_history`) lista as rodadas por esse título.

## 2026-10-29 — Rodada inicial: ecossistema de Agent Engineering
- **Coleta:** API do GitHub, 29/10/2026, 19h59–20h15 (BRT); README/docs oficiais; MCP Registry; HN.
- **Escopo:** 23 projetos em 6 categorias (MCP, skills/harness, frameworks Java, memória, tokens, protocolos).
- **Método:** [[Metodologia-de-Avaliacao]] (utilidade 25, qualidade 20, manutenção 15, integração 15, economia 15, segurança/docs 10).
- **Resultado:** Top 10 = Serena 88, Context7 86, GitHub MCP 86, Superpowers 85, Spring AI 83, Basic Memory 83, anthropics/skills 82, Headroom 80, wshobson/agents 78, MCP Java SDK 78. Radar = 13. Catálogo: [[Repository-Catalog]].
- **Correções de identidade:** chopratejas/headroom → headroomlabs-ai/headroom; sst/opencode → anomalyco/opencode.
- **MCP Registry:** encontrados io.github.upstash/context7, io.github.oraios/serena, io.github.basicmachines-co/basic-memory; github-mcp-server não encontrado na busca simples.
- **HN:** Superpowers (item 47623101, 50 pts, 03/04/2026); Headroom (48999841, 10 pts, 21/07/2026); Context7 Show HN (43507993).
- **Segurança:** README do claude-mem com instruções dirigidas a agentes — ignoradas.
- **Citados, não avaliados:** langgraph, crewAI, openai-agents-python, deer-flow, graphiti, letta, cognee, ReMe, redis/agent-memory-server, n8n-mcp, goose, aider, gemini-cli, codex, mastra, pydantic-ai, dapr-agents.
- **Não verificado:** Headroom em Intel; licença da Serena; licença do anthropics/skills; nº de issues do Hermes; release do LiteLLM; imagem amd64 do github-mcp-server; cobertura Java do wshobson/agents; percentuais de economia.
- **Fontes agregadoras:** registry.modelcontextprotocol.io; listas awesome-agent-harnesses, awesome-agent-infrastructure, awesome-AI-agent-orchestration.
- **Entregas da rodada:** esta KB (AI-Agent-Ecosystem) e o servidor [[Agent-Knowledge-MCP]].

## 2026-10-29 — Rodada de orquestração multiagente
- **Coleta:** API do GitHub e leitura de arquivos dos repositórios, 29/10/2026, feita na box do Grok Bot e importada para a KB no mesmo dia.
- **Escopo:** 14 repositórios de orquestração (runtimes, coleções de subagentes, harnesses, listas). Fichas e sínteses em [[MOC-Orchestration-Research]].
- **Resultado:** ranking em [[Architecture-Comparison]] (wshobson/agents 89, anthropics/skills 87, oh-my-claudecode 86, langgraph 80, VoltAgent 76, crewAI 74…); padrões em [[Pattern-Catalog]]; recomendações R1–R10 em [[Harness-Recommendations]].
- **Licenças:** respeitadas nas fichas (sínteses próprias, citações curtas); bradAGI sem licença e vivy-yi ambígua → só fatos e links.
- **Entregas da rodada:** [[MOC-Multi-Agent-Orchestration]] (área 10) e 8 tools de orquestração no [[Agent-Knowledge-MCP]] 0.2.0.

## Próxima rodada (sugestão)
Reverificar os itens “não verificado”; avaliar os citados de memória (graphiti, letta, cognee); medir com telemetria real (ADR-009) antes de adotar qualquer runtime de orquestração.
