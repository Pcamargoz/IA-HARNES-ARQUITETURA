---
title: "Catálogo de skills"
type: catalog
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, catalog, skills]
---
# Catálogo de skills

Consolida, sem copiar, as três fontes de skills. Consulta via MCP: `list_agent_skills`.

## 1. Skills do Cofre (`Skills para main agents/`)
22 skills, formato agentskills.io (`name`/`description` no frontmatter), lidas pelo Claude Code (Hermes fora do escopo do ecossistema do Pedro). Fonte: [[Skills para main agents/Índice das Skills|Índice das Skills]].

| Grupo | Skills |
|---|---|
| Back-end Java/Spring | java-spring-backend-senior, spring-cloud-microservices, spring-data-jpa-postgres, spring-security-jwt, spring-testing-strategy, spring-observability-resilience |
| Contratos e dados | api-design-openapi-contratos, data-modeling-postgres-reservas, data-pipelines-outbox-cdc, lgpd-dados-pessoais |
| Front-end | frontend-design-senior-reservex, react-vite-typescript-spa, a11y-wcag-componentes, frontend-testing-playwright |
| Agentes e operação | hermes-agent-operacao, criar-skills-e-mcps, context7-docs-first, consultor-de-contexto, tech-lead-orquestracao |
| Domínio e DevOps | dominio-reserva-de-mesas, devops-docker-compose-ci, code-review-senior |

> ⚠️ Duplicidade: as mesmas 22 existem em `Projetos/Reserva de Mesas - Microservices/Skills para agents/`, e `java-spring-backend-senior` difere entre as cópias. Proposta (não feita): eleger `Skills para main agents/` como fonte única.

## 2. Skills do Harness-Architecture (user scope, segundo `Optimization/skills-catalog.md`)
vault-context, short-spec, handoff-brief, final-code-review, delivery-report, vault-capture, vault-assistant, auto-tagging, spark, impeccable, video-use.

## 3. Pacotes externos avaliados
| Pacote | Nota | Recomendação |
|---|---|---|
| [[Superpowers]] | 85 | E3: motor do fluxo spec→plano→execução |
| [[Anthropic-Skills]] | 82 | referência de formato |
| [[wshobson-agents]] | 78 | instalar seletivamente (1–2 plugins por vez) |
| [[Addy-Agent-Skills]] | 85 | seletivo (~7 skills: api-and-interface-design, security-and-hardening, observability-and-instrumentation, performance-optimization, spec-driven-development, ci-cd-and-automation, documentation-and-adrs); camada de skills + `find_relevant_skills`; sem meta-skill/hook |
| [[Ponytail]] | 80 | experimento de economia de tokens; só SKILL.md/AGENTS.md, sem hooks |
| [[Caveman]] | 78 | só a skill `caveman`, opcional, só em chat; CLI/proxy/Auto/Cloud descartados |

Revisão de 29/10/2026 (22h25–22h40 BRT): Matt Pocock Skills e UI UX Pro Max ficaram no radar; Karpathy Skills e Taste Skill foram descartadas. Ver [[Repository-Catalog]].

## Sobreposições a resolver
| Necessidade | Cofre | Harness | Externo |
|---|---|---|---|
| Orquestração | tech-lead-orquestracao | handoff-brief, short-spec | Superpowers |
| Code review | code-review-senior | final-code-review | wshobson (reviewer), Ponytail (`ponytail-review`) |
| Contexto | consultor-de-contexto | vault-context | — |

Regra proposta: **uma** skill por necessidade em cada cliente; as demais ficam como referência.
