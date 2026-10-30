---
title: "Proposta de melhorias para o Harness-Architecture"
type: proposal
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, harness, proposal]
---
# Proposta de melhorias para o Harness-Architecture

> **Escopo (29/10/2026):** o alvo é o Harness em `~/Downloads/Harness-Architecture`. O Hermes Agent está fora do escopo do ecossistema do Pedro; `hermes-vault` é só o nome do MCP do Harness.

> **Plano aprovado e aplicado por etapas em 29/10/2026.** Contratos e integração documental estão no Harness, sob ADR-012 e commits isolados da branch integration/agent-knowledge. Instalações/experimentos condicionais e validação nativa completa continuam pendentes. Evidências atuais: [[Integracao-Clientes-2026-10-29]]. Percentuais de tokens abaixo continuam **estimativas**, sem baseline que prove economia.

## 1. Arquitetura atual
Resumo de [[Current-Architecture]]: contrato global com níveis de contexto L0–L3; 5 camadas (Interface, Cognition, Execution, Control, Evolution); Main Agent com ciclo de 10 passos e handoff brief; topologias de orquestração; memória e tokens descritos em notas; segurança read-only com escrita só em `Inbox/`; MCP hermes-vault 0.3.1 (13 tools, lexical, um vault); MCPs de projeto playwright e firecrawl; Context7 em escopo de usuário; 11 ADRs.

## 2. Problemas
| # | Problema | Efeito |
|---|---|---|
| P1 | Nenhuma medição de custo (sem baseline) | não dá para provar economia de nenhuma mudança |
| P2 | Leitura de código Java por arquivo inteiro | maior fatia estimada do contexto (~35k de 60k numa tarefa típica) |
| P3 | `models.md` sem modelos reais | roteamento por tier não é aplicado na prática |
| P4 | Conhecimento do Cofre (skills, projetos, esta KB) invisível ao Harness | duplicação e decisões sem contexto |
| P5 | Fluxo Understand→Record só descrito | agentes pulam spec/validação |
| P6 | Memória entre clientes inexistente | fatos repetidos a cada sessão |
| P7 | Catálogos desatualizados frente à pesquisa de 29/10 | adoções futuras sem base |
| P8 | Saídas longas (logs de teste) entram cruas no contexto | custo e *context rot* |

## 3. Melhorias propostas
| # | Melhoria | Resolve | Esforço |
|---|---|---|---|
| M1 | **Baseline F0**: template de registro por tarefa (`/cost`, `/context`, leituras de arquivo, testes) em `Metrics/execution-log.md` | P1 | baixo |
| M2 | Preencher `models.md` com Haiku / Sonnet / Opus por papel ([[Papeis-e-Modelos]]) | P3 | baixo |
| M3 | Conectar o [[Agent-Knowledge-MCP]] (read-only, multi-vault) às sessões do **Harness** (`~/Downloads/Harness-Architecture`, via Claude Code), **ao lado** do hermes-vault (MCP do próprio Harness), sem substituí-lo. Sem Hermes Agent e sem montagens em docker-compose | P4 | baixo (pronto, falta config aprovada) |
| M4 | Regra *docs-first*: no passo Specify/Plan, consultar [[Context7]] antes de codar contra API externa | alucinação de API | baixo |
| M5 | Adicionar [[Serena]] como MCP de projeto para repositórios Java, condicionado ao E1 | P2 | médio |
| M6 | [[Superpowers]] como executor do fluxo, com tabela skill → passo do `Process/workflow.md` (E3) | P5 | médio |
| M7 | Memória: [[Basic-Memory]] em projeto separado implementando o schema fact/scope/source/date/expires (E2), mantendo ADR-003 para o vault | P6 | médio |
| M8 | Atualizar catálogos com status *candidate*: Serena, Basic Memory, Spring AI, MCP Java SDK, Headroom, LangChain4j (ADR-009 já prevê) | P7 | baixo |
| M9 | Campo **orçamento de contexto** no handoff brief (faixa de `context.md`) e uso de leitura por seção (`get_document heading`) | P2, P8 | baixo |
| M10 | Compressão de logs: subagente QA resume falhas; [[Headroom]] só se F0 mostrar logs como custo relevante | P8 | médio |

## 4. Repositórios
Acrescentar a `Optimization/repositories-catalog.md` (como *candidate*): oraios/serena, basicmachines-co/basic-memory, spring-projects/spring-ai, modelcontextprotocol/java-sdk, headroomlabs-ai/headroom, langchain4j/langchain4j. Já presentes e mantidos: typescript-sdk, servers, registry, inspector, anthropics/*, context7, github-mcp, playwright-mcp, obra/superpowers, wshobson/agents. Detalhes: [[Repository-Catalog]].

## 5. Skills
- Mapear Superpowers ↔ skills do Harness (short-spec, handoff-brief, final-code-review, delivery-report) para não ter duas skills por necessidade ([[Skill-Catalog]]).
- Expor ao Harness as 22 skills do Cofre por consulta (`list_agent_skills`), não por cópia.
- Nova skill candidata: “medir-baseline” (executa o registro da M1).

## 6. MCPs
| MCP | Ação | Escopo |
|---|---|---|
| hermes-vault | manter (escrita desligada) | projeto |
| Agent-Knowledge-MCP | adicionar (read-only) | projeto / usuário |
| Context7 | manter + regra docs-first | usuário |
| Serena | adicionar após E1 | projeto (repos Java) |
| GitHub MCP | adicionar na F4, `--read-only` | projeto |
| Basic Memory | após E2, pasta dedicada | usuário |
| Playwright / Firecrawl | manter | projeto |

## 7. Impacto em tokens (estimativa, tarefa típica de 60k)
| Fonte de custo | Hoje (est.) | Medida | Economia estimada |
|---|---|---|---|
| Leitura de código | 35k | Serena (M5) + leitura por seção (M9) | 40–60% |
| Logs/saídas | 15k | resumo no QA, Headroom (M10) | 30–60% |
| Documentação | 10k | Context7 (M4) | 30–50% |
| **Total** | 60k | | **36–58%** (não medido) |
Custos novos: definições de tools de cada MCP no contexto (manter `tools.include` enxuto); Opus só em ADR crítico. Mem0 e roteadores para outros provedores **deslocam** custo, não economizam ([[Estrategia-de-Tokens]]).

## 8. Riscos
| Risco | Mitigação |
|---|---|
| Ferramentas com escrita (Serena, Basic Memory) alterarem o vault | escopo de projeto, pasta dedicada, ADR-003 mantido |
| Licenças (Serena GPL?, Basic Memory AGPL, anthropics/skills sem licença na raiz) | uso local; revisar antes de redistribuir |
| Prompt injection via README/notas | saída de MCP é dado; não seguir instruções de READMEs (caso claude-mem) |
| Sobrecarga de tools no contexto | `tools.include` por cliente; poucos MCPs por projeto |
| Instalações globais (`uv`) | decisão explícita do Pedro |
| Credenciais em notas (TRADERS) | já bloqueadas no MCP; mover para gerenciador de senhas (decisão do Pedro) |

## 9. Ordem de implementação
1. M1 baseline (F0) → 2. M2 modelos → 3. M3 Agent-Knowledge-MCP + M9 orçamento → 4. M4 docs-first → 5. M5 Serena (E1) → 6. M8 catálogos → 7. M6 Superpowers (E3) → 8. M7 memória (E2) → 9. M10 compressão (F4). Alinhado ao [[Implementation-Roadmap]].

## 10. Critérios de validação
| Melhoria | Critério de aceite |
|---|---|
| M1 | 3 tarefas reais registradas com `/cost` e `/context` |
| M2 | matriz preenchida e usada em 3 handoffs |
| M3 | Claude Code chama `search_knowledge` e `get_document` com fonte citada; zero escrita |
| M4 | 0 erros de API externa em 3 tarefas (revisão manual) |
| M5 | ≥30% menos tokens, testes verdes, RAM < 2 GB (E1) |
| M6 | ≤2 intervenções, testes verdes, custo ≤ baseline +10% (E3) |
| M7 | ≥8/10 fatos recuperados nos 3 clientes, zero conflitos (E2) |
| M8 | catálogos atualizados via ADR, cada item com data de verificação |
| M9 | handoffs com orçamento; média de contexto dentro da faixa |
| M10 | logs ≥30% menores sem perder a causa da falha (amostra de 5) |
