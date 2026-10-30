---
title: "Validação da orquestração — simulação determinística (29/10/2026)"
type: validation
status: done
category: orchestration
updated: 2026-10-29
tags: [ai-agent-ecosystem, validation, orchestration, agent-knowledge-mcp, telemetry]
---
# Validação da orquestração — simulação determinística (29/10/2026)

Teste real e pequeno do desenho de [[MOC-Multi-Agent-Orchestration]] com o [[Agent-Knowledge-MCP]] 0.2.0, rodado no Mac do Pedro, **sem LLM e sem APIs pagas** ([[ADR-010-Simulacao-Deterministica]]). É a fase 8 (Validation) do [[Bootstrap-8-Fases]]. Nada foi executado no Harness-Architecture e nenhum agente real foi acionado.

Os 9 passos seguem a lista de validação E2E definida pelo Pedro.

## Como rodar
```bash
cd ~/Downloads/Agent-Knowledge-MCP
# 29/10/2026: a nota do Hermes saiu do include (Hermes fora do escopo do ecossistema do Pedro)
AKM_VAULT_ROOTS="cofre=$HOME/Downloads/Cofre do Pedro;harness=$HOME/Downloads/Harness-Architecture" \
AKM_ROOT_INCLUDE='{"cofre":["AI-Agent-Ecosystem","Skills para main agents"]}' \
npm run simulate            # build + scripts/simulate-orchestration.mjs; opcional: -- --task "…" --out <pasta fora dos vaults>
```
- Cliente: SDK oficial do MCP via stdio, contra `dist/src/index.js`.
- Saída: `~/Downloads/Agent-Knowledge-MCP/validation-output/`, fora do cofre e no `.gitignore`. O script recusa `--out` dentro de um vault.
- Arquivos por execução: `<run>.jsonl` (telemetria, schema `akm.orchestration.v1` de [[Telemetry-Schema]]), `<run>-handoff.md` e `<run>-report.json`.

## Execução real
- **Quando:** 29/10/2026 às 21h13 (BRT), run `sim-20261030T001333` (o id usa UTC).
- **Tarefa fixa:** “Corrigir bug de validação de data no endpoint REST de reservas (Spring Boot) e adicionar teste de regressão”.
- **Resultado:** exit 0. 9/9 checagens ok. 8 chamadas de tool, 0 erros. 20 eventos JSONL. 67 ms no total. 17.564 caracteres de saída das tools, cerca de 4.395 tokens estimados por `ceil(chars/4)`. `llm_calls=0` e `cost_usd=0`.
- **Determinismo:** as execuções anteriores do mesmo dia fizeram as mesmas escolhas de workflow, agente e skills. Só mudam horários, durações e nomes de arquivo.

## Os 9 passos e o que aconteceu
| # | Passo (definição do Pedro) | Como (sem LLM) | Resultado real |
|---|---|---|---|
| 1 | Recebimento de uma tarefa pelo Main Orchestrator | texto fixo; o orquestrador carrega a regra de delegação com `get_orchestrator_policy` | `task_received` + `policy_loaded` (849 caracteres) |
| 2 | Identificação da especialização necessária | palavras-chave, na ordem fix > review > research > docs > feature, e stack; depois `find_workflow_template` para saber os papéis previstos | `fix`, complexidade `media`, especialização `java-spring + testes`; workflow `wf-bugfix` (1,25) com papéis main-agent, test-engineer, builder e reviewer |
| 3 | Seleção de um agente existente ou proposta de criação | `list_registered_agents` com `query`; pontuação = 0,5·aderência + 0,3·(papel no workflow) + bônus de status (implemented +0,2; planned 0; conceptual −0,2). Só `implemented` executa. Se nenhum implementado tiver aderência ≥ 0,3, o script propõe ativar ou criar o melhor não implementado | executor `main-agent` (0,5; aderência 0). **Proposta:** ativar `builder` [planned] (0,384). Gera um evento `hitl` pendente, que exige aprovação; nada foi criado |
| 4 | Recuperação de conhecimento via MCP | `get_execution_policy`, `get_agent_specification`, `find_relevant_skills`, `get_architecture_decisions` | spec main-agent [implemented]; skills: spring-testing-strategy, tech-lead-orquestracao, data-modeling-postgres-reservas, java-spring-backend-senior, spring-data-jpa-postgres. **Esperadas e não encontradas:** vault-context, short-spec, handoff-brief, delivery-report. ADRs: kb:ADR-009 (proposed), kb:ADR-010 (accepted) |
| 5 | Delegação controlada | handoff pelo [[Handoff-Template]] + 4 guardas: executor implementado, orçamento, campos obrigatórios, sem ação irreversível | handoff de 1.263 caracteres (max_turns=60, max_retries=2, timeout_min=60, tier=balanced); 4/4 guardas ok |
| 6 | Execução da tarefa | **simulada**: devolve um resultado fixo no formato de retorno do handoff | `done (simulado)`, nenhum arquivo alterado; item aberto: execução real exige LLM e aprovação |
| 7 | Validação do resultado | checagens estruturais feitas pelo script, separado do executor | 9/9 ok (as 4 guardas + workflow, formato do retorno, evidência, sem LLM, ADR de telemetria) |
| 8 | Registro das métricas disponíveis | `get_metric_definitions` + métricas medidas na execução | catálogo de 17 métricas. Medidas: tool_calls=8, tool_errors=0, est_tokens_out=4.395, duration_ms=67, agent_selection_score=0,5, agent_term_match=0, verification_passed=true |
| 9 | Encerramento e documentação | evento `task_completed` + relatório JSON + esta nota | status `done`, 20 eventos |

Top 5 do passo 3: main-agent 0,5 (implemented) · builder 0,384 (planned) · reviewer 0,3 (planned) · test-engineer 0,225 (conceptual) · qa-validator 0,125 (planned).

## Testes automatizados (Mac, 29/10/2026, por volta de 21h13 BRT)
- `npm install` local: o `package-lock.json` passou a 0.2.0.
- `npm test`: 37 testes. **35 passaram, 0 falharam, 2 foram pulados**: os de vault real, que exigem variável de ambiente.
- `npm run test:real`: **2/2 passaram**.
  - Índice: 212 documentos (cofre=151, harness=61).
  - As 8 tools novas responderam nos vaults reais.
  - `get_architecture_decisions` achou 21 ADRs (kb=10, harness=11).
  - Varredura do cofre: 0 notas proibidas nos resultados.

## Achados
1. **Skills core do Harness ausentes:** `Optimization/skills-catalog.md` diz que vault-context, short-spec, handoff-brief e delivery-report estão ativas, mas não há SKILL.md delas nas raízes lidas.
2. **Executor sem aderência:** o main-agent é o único implementado e tem aderência 0 a esta tarefa. Pela regra do passo 3, toda tarefa especializada gera proposta de ativação, que depende de aprovar EVO-xx em [[Harness-Evolution-Proposals]].
3. **Métrica `agent_selection_score` ambígua:** o catálogo define “termos em comum / termos da tarefa”. O script agora registra as duas medidas: `agent_term_match` = 0 e a pontuação composta 0,5. Proposta: separar as duas em [[Metric-Definitions]].
4. **Tokens estimados:** a estimativa usa `chars/4`, não contagem de tokenizer.

## Limites desta validação
- O passo 6 não executa a tarefa nem chama modelo. A validação cobre o **caminho de decisão**, a delegação e os dados devolvidos pelas tools.
- Classificação e pontuação usam regras fixas e podem errar em textos ambíguos.
- Nenhuma configuração de cliente (Claude Code, Claude Desktop; Hermes hoje fora do escopo do ecossistema do Pedro) foi alterada. O MCP não está registrado em nenhum cliente.
- O teste com LLM real continua pendente e depende de aprovação.

Relacionado: [[Validacao-Agent-Knowledge-MCP-2026-10-29]] · [[ADR-009-Telemetria-JSONL-Local]] · [[Orchestration-Roadmap]]
