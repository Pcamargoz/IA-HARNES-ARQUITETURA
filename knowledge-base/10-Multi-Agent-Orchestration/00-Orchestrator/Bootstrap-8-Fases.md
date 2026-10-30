---
title: "Bootstrap do orquestrador em 8 fases"
type: procedure
policy_area: bootstrap
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, bootstrap]
---
# Bootstrap do orquestrador em 8 fases

As 8 fases e os seus objetivos seguem literalmente a definição do Pedro. As colunas "Como", "Tool MCP / fonte" e "Saída" são o desenho desta KB, apoiado no Harness (`Templates.md` §7 "Agent bootstrap prompt", `main-agent.md` "Operating cycle") e em R1–R10 de [[Harness-Recommendations]].

| # | Fase | Objetivo (definição do Pedro) | Como | Tool MCP / fonte | Saída |
|---|---|---|---|---|---|
| 1 | **Discovery** | identificar ferramentas, ambiente, MCPs, agentes existentes e documentação | inventário só do que existe de fato; nada é presumido | `knowledge_status`, `find_mcp_servers`, `list_registered_agents` (só metadados) | inventário: ambiente, MCPs, agentes por status, docs indexados |
| 2 | **Context Loading** | recuperar somente as partes relevantes do Harness e das políticas operacionais | índice → área → 2 a 4 notas; seções, não arquivos inteiros (L0/L1) | `get_orchestrator_policy`, `get_execution_policy`, `get_architecture`, `search_knowledge` | contexto mínimo com fontes |
| 3 | **Architecture Validation** | verificar compatibilidade, permissões, dependências e estado da infraestrutura | confere o desenho contra o Harness e as ADRs; lista divergências | `get_architecture_decisions`, `find_relevant_skills` (`expected_not_found`), Harness `Security/permissions.md` | lista de compatível / divergente / bloqueado |
| 4 | **Agent Planning** | definir quais agentes são necessários e quais podem ser reutilizados | casa a tarefa com o [[Agent-Registry]]; reutiliza `implemented`; o resto vira proposta | `list_registered_agents` com `query`, `find_workflow_template` | plano: reutilizar / ativar / criar |
| 5 | **Agent Provisioning** | preparar as especificações e criar os agentes quando houver suporte técnico e autorização | spec pelo [[Agent-Spec-Template]]; criação real só com aprovação do Pedro (EVO em [[Harness-Evolution-Proposals]]) | `get_agent_specification` | specs prontas; agentes criados só se aprovados |
| 6 | **Workflow Configuration** | definir comunicação, delegação, validação e recuperação de falhas | escolhe o workflow e aplica os protocolos | [[Workflow-Catalog]], [[Delegation-Contract]], [[Handoff-Protocol]], [[Verification-Protocol]], [[HITL-e-Escalonamento]] | workflow configurado com handoffs e limites |
| 7 | **Observability** | inicializar a coleta de métricas disponíveis | abre o arquivo JSONL fora do cofre; só métricas que dá para medir hoje | `get_metric_definitions`, [[Telemetry-Schema]] | coletor ativo (JSONL) |
| 8 | **Validation** | executar um workflow pequeno de ponta a ponta e verificar seus resultados | roda a validação E2E de 9 passos (abaixo) | `npm run simulate` ([[ADR-010-Simulacao-Deterministica]]) | relatório em [[Validacao-Orquestracao-2026-10-29]] |

Níveis de contexto L0–L3 vêm do AGENTS.md do Harness; orçamentos por tipo de tarefa (< 4k a 60k tokens) vêm de `Optimization/token-strategy.md` ([[Context-and-Memory]]).

## Critérios de saída de cada fase
1. Inventário gravado; o que não existe aparece como ausente, não como disponível.
2. Política e trechos do Harness carregados com fonte, ou "não encontrado" → parar.
3. Nenhum bloqueio aberto, ou bloqueios listados para o Pedro.
4. Cada papel necessário tem agente reutilizável ou proposta.
5. Toda spec completa; nenhum agente criado sem autorização registrada.
6. Workflow com dono por arquivo, limites e caminho de falha (retry → escalonamento).
7. Primeiro evento gravado no JSONL.
8. Os 9 passos concluídos e verificados.

## Validação E2E em 9 passos (definição do Pedro)
1. Recebimento de uma tarefa pelo Main Orchestrator.
2. Identificação da especialização necessária.
3. Seleção de um agente existente ou proposta de criação.
4. Recuperação de conhecimento via MCP.
5. Delegação controlada.
6. Execução da tarefa.
7. Validação do resultado.
8. Registro das métricas disponíveis.
9. Encerramento e documentação.

Implementada sem LLM em `scripts/simulate-orchestration.mjs` do [[Agent-Knowledge-MCP]] (passo 6 simulado). Resultado: [[Validacao-Orquestracao-2026-10-29]].
