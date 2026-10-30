---
title: "Registro de agentes"
type: catalog
status: active
category: orchestration
updated: 2026-10-29
tags: [orchestration, agents, registry]
---
# Registro de agentes

Fonte única dos agentes (R2). Cada agente é uma nota `type: agent-spec` em `Agents/`; o MCP lê só o frontmatter para listar (`list_registered_agents`) e a nota inteira sob demanda (`get_agent_specification`).

## Critério de status (verificado em 29/10/2026, Harness somente leitura)
| Status | Critério | Qtde |
|---|---|---|
| **implemented** | existe no Harness **e** há evidência de uso real ou artefato executável; transporte declarado | 3 |
| **planned** | definido no Harness (role card ou domínio), sem execução registrada | 5 |
| **conceptual** | só existe na pesquisa ([[Harness-Recommendations]]) ou nesta KB | 5 |

Fatos verificados: o Harness **não tem** `.claude/agents/` nem pasta `agents/`; `~/.claude/agents` não existe no Mac. Os papéis do Harness são **contratos em Markdown**, executados pelo Main Agent (sessão do Claude Code) — por isso só o Main Agent conta como implementado.

## Agentes
| Agente | Nome | Status | Papel | Tier | Autonomia |
|---|---|---|---|---|---|
| [[main-agent]] | Main Agent (orquestrador) | Implementado | orchestrator | balanced | A1 |
| [[backend-java-specialist]] | Especialista Back-end Java/Spring | Planejado | specialist | balanced | A3 |
| [[builder]] | Builder | Planejado | worker | balanced | A3 |
| [[code-architecture-analyst]] | Analista de arquitetura de código | Planejado | specialist | frontier | A1 |
| [[content-agent]] | Content Agent | Planejado | worker | balanced | A2 |
| [[qa-validator]] | QA de validação antes do merge | Implementado (Maestri nativo) | verifier | small | A1 |
| [[researcher]] | Researcher | Planejado | researcher | small | A1 |
| [[reviewer]] | Reviewer | Implementado (Maestri nativo) | reviewer | balanced | A1 |
| [[java-architect]] | Java Architect | Conceitual | specialist | frontier | A0 |
| [[planner]] | Planner | Conceitual | planner | balanced | A1 |
| [[spring-boot-implementer]] | Spring Boot Implementer | Conceitual | worker | balanced | A3 |
| [[test-engineer]] | Test Engineer | Conceitual | worker | small | A3 |
| [[verifier]] | Verifier | Conceitual | verifier | balanced | A1 |

## Divergência encontrada (skills)
`Optimization/skills-catalog.md` do Harness diz que `vault-context`, `short-spec`, `handoff-brief`, `final-code-review` e `delivery-report` estão ativas em `~/.claude/skills` (verificado lá em 2026-10-20). Em 29/10/2026 **não foram encontradas** em `~/.claude/skills` deste Mac (nem em `synced/`). Pode ser outra máquina ou remoção. Os agentes acima citam essas skills como *esperadas*; `find_relevant_skills` só retorna as que existem nas raízes lidas pelo MCP.

Skills de orquestração que existem no Mac (nomes apenas): `tech-lead-orquestracao` e `consultor-de-contexto` (links para o projeto Reserva de Mesas no Cofre), `maestri*`.

## Como adicionar um agente
1. Copiar [[Agent-Spec-Template]] para `Agents/<nome>.md` (nome único, kebab-case).
2. Preencher `status` honestamente (padrão `conceptual`).
3. Rodar `list_registered_agents` e conferir; promover a `planned`/`implemented` só com evidência.

Templates: [[Agent-Spec-Template]] · [[Handoff-Template]] · [[Skill-Card-Template]].

## Ativação supervisionada — HARNESS-BOOT-001

Em 29/10/2026, após o Pedro solicitar iniciar a orquestração aqui, reviewer (Lince) e qa-validator (Prumo) executaram tarefas reais por sessões nativas Codex no Maestri, somente leitura. O maestro coordenou handoffs, revisão, correção e verificação. Essa evidência promove as duas roles neste transporte; não promove os adapters CLI AgentPort. Os fatos de ausência de arquivos nativos acima descrevem a verificação inicial, anterior à ativação.

Reutilizar os terminais conectados antes de recrutar. Limites: dois filhos neste workflow, sem delegação dos filhos, no máximo duas rodadas de revisão. Tokens/custo não medidos. Nenhum experimento npm run experiment foi executado.
