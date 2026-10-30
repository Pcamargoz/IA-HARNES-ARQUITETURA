---
title: "Comparação de Arquiteturas de Orquestração"
type: research-synthesis
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
tipo: sintese
verificado_em: 2026-10-29
pesos: {utilidade: 25, qualidade_tecnica: 20, manutencao: 15, integracao: 15, economia: 15, seguranca_doc: 10}
tags: [orquestracao, ranking, comparacao]
---

# Comparação de Arquiteturas

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Relacionados: [[Pattern-Catalog]] · [[Harness-Recommendations]]
> Metadados coletados pela API do GitHub e pelo conector GitHub em 29/10/2026. As notas são julgamento meu sobre as fontes lidas, ou seja, subjetivas.

## Tabela comparativa

| # | Repositório | Categoria | ⭐ | Último push | Release | Licença | Formato de agente | Delegação | Limites/HITL | Memória/estado | Roteamento de modelo | Nota |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | [[wshobson-agents-orquestracao\|wshobson-agents]] | plugins/subagentes/skills | 41.988 | 26/10/2026 | — | MIT | MD+YAML (`tools`, `model`) | team-lead, 2 a 5 teammates, DAG `blockedBy` | Cedar PreToolUse, recibos | Conductor (`tracks/`) | Opus/inherit/Sonnet/Haiku | **89** |
| 2 | [[anthropics-skills]] | spec de skills | 184.787 | 28/10/2026 | — | Mista (Apache-2.0 + proprietária) | SKILL.md | — | — | Divulgação progressiva | — | **87** |
| 3 | [[oh-my-claudecode]] | orquestrador Claude Code | 40.405 | 29/10/2026 | v5.7.20 | MIT | MD+YAML (`level`, `disallowedTools`) | Até 6 filhos, pipeline team-* | Loop limitado, kill switch, sem auto-aprovação | `.omc/` (state, notepad, memory, handoffs) | haiku/sonnet/opus | **86** |
| 4 | [[langgraph]] | runtime de grafo | 44.119 | 29/10/2026 | 1.2.18 | MIT | Código (nós) | Arestas condicionais | `interrupt()` durável e tipado | Checkpointers sqlite/postgres | — | **80** |
| 5 | [[voltagent-subagents]] | coleção de subagentes | 26.186 | 11/10/2026 | — | MIT | MD+YAML | Meta-orquestração (12 agentes) | Escritor único por arquivo | Arquivos compartilhados | sonnet/haiku/inherit | **76** |
| 6 | [[crewai]] | framework | 60.262 | 29/10/2026 | 1.15.33 | MIT | JSONC/YAML role/goal/backstory | sequential/hierarchical | `max_iter`, `max_retry_limit`, guardrails | Knowledge e memória | `function_calling_llm` | **74** |
| 7 | [[yigtwxx-awesome-claude-multi-agent]] | lista (fontes primárias) | 3 | 04/10/2026 | — | CC0 | — | — | — | — | — | **71** |
| 8 | [[ruflo]] (ex-claude-flow) | meta-harness/swarm | 80.137 | 29/10/2026 | v3.64.0 | MIT | MD+YAML (108 agentes) | Queen/hierarchical/mesh | Worktree por escritor, `--max-budget-usd` | AgentDB/vetorial | 3 tiers (codemod → Haiku → Sonnet/Opus) | **68** |
| 9 | [[andyrewlee-awesome-agent-orchestrators]] | lista | 2.308 | 29/10/2026 | — | CC0 | — | — | — | — | — | **67** |
| 10 | [[awesome-llms-labs-orchestration]] | lista + catálogo de padrões | 1 | 30/09/2026 | — | MIT | — | — | — | — | — | **64** |
| 11 | [[bradagi-awesome-cli-coding-agents]] | lista de harnesses | 1.427 | 26/10/2026 | — | **Sem licença** | — | — | — | — | — | **62** |
| 12 | [[0xfurai-subagents]] | coleção de subagentes | 1.020 | 15/10/2025 | — | MIT | MD+YAML (model ID fixo) | — | — | — | Fixo | **54** |
| 13 | [[autogen]] | framework (descontinuado) | 61.623 | 28/10/2026 | python-v0.7.5 (30/09/2025) | MIT + CC-BY-4.0 | Código | AgentTool, group chat | `max_tool_iterations` | — | — | **47** |
| 14 | [[vivy-yi-awesome-agent-orchestration]] | lista | 109 | 05/03/2026 | não verificado | Ambígua | — | — | — | — | — | **39** |

## Sub-notas (utilidade/qualidade/manutenção/integração/economia/segurança-doc)
wshobson 90/90/90/90/85/85 · anthropics 85/90/85/95/90/70 · OMC 90/85/95/85/80/75 · LangGraph 70/95/95/60/75/90 · VoltAgent 80/70/75/90/70/70 · CrewAI 65/85/95/55/70/80 · Yigtwxx 75/80/70/60/60/80 · ruflo 70/60/90/75/60/45 · andyrewlee 65/70/90/55/55/70 · Awesome-llms 65/80/55/50/55/80 · bradAGI 60/70/85/50/50/50 · 0xfurai 55/50/35/75/60/50 · AutoGen 45/80/10/40/55/40 · vivy 40/45/30/35/40/40

## Ranking de maturidade × aderência ao Harness do Pedro
1. **wshobson/agents (89):** o melhor modelo de *registro de agentes com fonte única, limites de contexto e gates de CI* para Claude Code.
2. **anthropics/skills (87):** o formato canônico de skill e a divulgação progressiva, base de economia de tokens.
3. **oh-my-claudecode (86):** o prompt de Main Orchestrator mais completo, com delegação, verificador, loop limitado e estado.
4. **LangGraph (80):** a referência conceitual de estado durável e HITL tipado, para adotar o conceito e não o runtime.
5. **VoltAgent (76):** templates por papel, incluindo Spring Boot e Java, e a matriz de ferramentas por papel. É preciso limpar o protocolo fictício.

Menções: CrewAI, pelos limites de spec, e ruflo, pelos princípios de governança, adotando as regras e não a instalação.

## Status especiais
- **Renomeado:** ruvnet/claude-flow → **ruvnet/ruflo** (o `package.json` ainda se chama `claude-flow`).
- **Descontinuado:** microsoft/autogen. O README declara o projeto arquivado, mas a API reporta `archived=false`. O sucessor é o Microsoft Agent Framework.
- **Em manutenção:** `langgraph-supervisor` e `langgraph-swarm` (LangGraph `AGENTS.md`).
- **Parados:** 0xfurai (último push em 10/2025) e vivy-yi (último push em 03/2026).
