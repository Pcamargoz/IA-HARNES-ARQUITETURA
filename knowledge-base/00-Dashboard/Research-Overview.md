---
title: "Visão geral da pesquisa de 29/10/2026"
type: overview
status: active
verified_at: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, research]
---
# Visão geral da pesquisa de 29/10/2026

## Escopo
23 projetos open source de Agent Engineering avaliados para o ambiente do Pedro (Mac Intel, Claude Code/Desktop, Harness em `~/Downloads/Harness-Architecture`, stack Java 21 + Spring Boot 4.1.1 + React 19). Dados da API do GitHub coletados em 29/10/2026 entre 19h59 e 20h15 (BRT). Método: [[Metodologia-de-Avaliacao]].

## Pesos
utilidade 25% · qualidade 20% · manutenção 15% · integração 15% · economia de tokens 15% · segurança/documentação 10%.

## Resultado
- **Top 10:** Serena 88, Context7 86, GitHub MCP 86, Superpowers 85, Spring AI 83, Basic Memory 83, anthropics/skills 82, Headroom 80, wshobson/agents 78, MCP Java SDK 78.
- **Radar (13):** MCP servers 77, claude-mem 76, LangChain4j 76, Hermes Agent 76 (fora do escopo do ecossistema do Pedro), Playwright MCP 74, Embabel 74, LiteLLM 74, Repomix 73, Postgres MCP 73, Claude Code Router 72, OpenCode 72, Mem0 70, A2A 66.
- Catálogo completo com métricas: [[Repository-Catalog]].

## Principais conclusões
1. O maior custo estimado está na **leitura de código** → [[Serena]] é a aposta de maior impacto (a medir no [[E1-Serena-Context7-ControlFree]]).
2. Documentação atualizada já está resolvida com [[Context7]] (em uso no Claude Code).
3. Memória compartilhada entre clientes é a lacuna funcional → [[Basic-Memory]] no [[E2-Basic-Memory-Obsidian]].
4. Processo: [[Superpowers]] pode executar o fluxo que o Harness só descreve → [[E3-Superpowers-QA-Frans]].
5. Ferramentas que **deslocam custo** (Mem0, roteadores para outros provedores) não são economia real: ver [[Estrategia-de-Tokens]].

## Verificações e correções feitas na pesquisa
- `chopratejas/headroom` → hoje `headroomlabs-ai/headroom`; `sst/opencode` → `anomalyco/opencode`.
- MCP Registry contém `io.github.upstash/context7`, `io.github.oraios/serena`, `io.github.basicmachines-co/basic-memory`; o github-mcp-server não apareceu na busca simples.
- O README do claude-mem traz instruções de instalação dirigidas a agentes — **não foram seguidas**.

## Lacunas (não verificado)
Headroom em Intel (wheel x86_64 existe, não testado) · licença da Serena (GPL no README × NOASSERTION na API) · licença do anthropics/skills · contagem de issues do Hermes (51.901, parece anômala) · release do LiteLLM · imagem amd64 do github-mcp-server · cobertura Java do wshobson/agents · **todos os percentuais de economia de tokens**.

Ver também: [[Research-History]] · [[Technology-Comparisons]]
