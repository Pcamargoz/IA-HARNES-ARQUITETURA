---
title: "Índice — AI Agent Ecosystem"
type: index
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, index, moc]
---
# Índice — AI Agent Ecosystem

Knowledge Base de **Agent Engineering** do Pedro: ferramentas, MCPs, skills, Harness, economia de tokens, memória e pesquisa. Criada em 29/10/2026. Também é a base servida pelo MCP [[Agent-Knowledge-MCP]] (somente leitura).

> Convenção: notas novas usam frontmatter em inglês (`type`, `status`, `category`, `verified_at`…) para permitir filtros no MCP — ver [[ADR-005-Frontmatter-Padronizado]]. O resto do Cofre segue o [[CLAUDE]] (chaves em português).

## Comece por aqui
- [[Model-Catalog]] — qual modelo usar para cada tarefa, com cotas e regras de dados (29/10/2026)
- [[Prompt-Iniciar-Time-de-Agentes]] — montar o time de agentes (modelos, papéis, prompt por agente); usar depois do [[Prompt-Inicial-Configuracao]] (30/10/2026)
- [[Auditoria-Arquitetura-2026-10-29]] — auditoria de arquitetura contra arc42/C4, ISO 25010, ADR, OWASP LLM, MCP, OTel e provedores gratuitos (29/10/2026)
- [[Inventario-Ambiente]] — o que existe hoje no Cofre, no Harness-Architecture e no Harness-Arquitetura-Flow.
- [[Research-Overview]] — resumo da pesquisa de 29/10/2026 (23 projetos, Top 10).
- [[Implementation-Roadmap]] — fases F0–F5.
- [[Harness-Improvement-Proposal]] — melhorias propostas para o Harness-Architecture (nada foi alterado nele).
- [[MOC-Multi-Agent-Orchestration]] — Main Orchestrator e multiagentes (29/10/2026; documentado e simulado, não implantado no Harness).
- [[Fluxo-de-Atualizacao]] — como a KB é atualizada.
- [[CHANGELOG]] — histórico de mudanças da KB.

## Áreas
| Pasta | Conteúdo | Entrada |
|---|---|---|
| 01-Agent-Orchestration | arquitetura multiagente, papéis, comunicação, frameworks | [[MOC-Agent-Orchestration]] |
| 02-Agent-Skills | pacotes de skills e catálogo de skills | [[MOC-Agent-Skills]] |
| 03-MCP-Servers | servidores MCP avaliados | [[MOC-MCP-Servers]] |
| 04-Agent-Harness | análise e proposta para o Harness | [[MOC-Agent-Harness]] |
| 05-Token-Optimization | orçamento, roteamento, compressão | [[Estrategia-de-Tokens]] |
| 06-Memory-Systems | memória de agentes | [[Memoria-de-Agentes]] |
| 07-GitHub-Research | histórico, catálogo de repositórios, comparações, método; pesquisa de orquestração | [[Research-History]] · [[MOC-Orchestration-Research]] |
| 08-Implementation | ADRs, experimentos, resultados de validação | [[MOC-Implementation]] |
| 09-Agent-Knowledge-MCP | o servidor MCP desta KB | [[Agent-Knowledge-MCP]] |
| 10-Multi-Agent-Orchestration | orquestrador, registro de agentes, protocolos, métricas, workflows, governança, evolução do Harness | [[MOC-Multi-Agent-Orchestration]] |
| 11-Universal-Agent-Runtime | contrato único para delegar a CLIs/APIs de agentes, detecção de ambiente, roteador de modelos, métricas, Maestri | [[MOC-Universal-Agent-Runtime]] |

## Top 10 da pesquisa (29/10/2026)
| # | Ferramenta | Nota | Categoria |
|---|---|---|---|
| 1 | [[Serena]] | 88 | MCP / contexto de código |
| 2 | [[Context7]] | 86 | MCP / documentação |
| 3 | [[GitHub-MCP-Server]] | 86 | MCP / DevOps |
| 4 | [[Superpowers]] | 85 | Skills / processo |
| 5 | [[Spring-AI]] | 83 | Framework Java |
| 6 | [[Basic-Memory]] | 83 | Memória |
| 7 | [[Anthropic-Skills]] | 82 | Skills / referência |
| 8 | [[Headroom]] | 80 | Tokens / compressão |
| 9 | [[wshobson-agents]] | 78 | Skills / subagentes |
| 10 | [[MCP-Java-SDK]] | 78 | SDK |

Radar (13): [[MCP-Reference-Servers]], [[Claude-Mem]], [[LangChain4j]], [[Hermes-Agent]], [[Playwright-MCP]], [[Embabel-Agent]], [[LiteLLM]], [[Repomix]], [[Postgres-MCP-Pro]], [[Claude-Code-Router]], [[OpenCode]], [[Mem0]], [[A2A-Protocol]].

## Ligações com o resto do Cofre
- Projetos: [[Índice de Projetos]] · [[Control Free]] · [[Reserva de Mesas - Microservices]] · [[Hermes Agent no Docker]] (fora do escopo do ecossistema do Pedro)
- Skills dos agentes: [[Skills para main agents/Índice das Skills|Índice das Skills]]
- Prompt para configurar a integração: [[Prompt-Inicial-Configuracao]]
- Alvo de integração: o Harness em `~/Downloads/Harness-Architecture`. `hermes-vault` é o nome do MCP **do próprio Harness** (`.mcp/`), não o Hermes Agent.
- Ideias de origem: [[Estudos/System Design/Gestao melhorada de subgents|Gestão melhorada de subagents]] (desenho Excalidraw)
