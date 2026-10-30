---
title: "Integração do runtime com o Harness"
type: proposal
runtime_component: harness
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, harness, evolucao]
---
# Integração do runtime com o Harness

> **Escopo:** o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão **fora do escopo do ecossistema do Pedro** (29/10/2026): não são clientes, alvos de configuração nem detectados.

Continua [[Harness-Evolution-Proposals]] (EVO-01 a EVO-10). **Plano aprovado pelo Pedro em 29/10/2026.** EVO-11/14 foram incorporadas como contratos e guardas; EVO-12 ganhou mapeamento condicional; EVO-13 ganhou bridge de metadados. Isso não promove adapters nem prova execução de agentes. Evidências e limites em [[Integracao-Clientes-2026-10-29]].

| ID | Proposta | Onde no Harness | Risco | Reversão | Critério de sucesso |
|---|---|---|---|---|---|
| EVO-11 | Seção "Execução de agentes" apontando para o contrato `AgentPort` e para `list_agent_adapters` | `HARNESS/HARNESS MAIN/orchestration.md` | baixo (texto) | reverter o commit | orquestrador cita o adapter usado em 3 tarefas |
| EVO-12 | Tabela alias → adapter + modelo usando [[Model-Router]] e [[Model-Pricing]] | `HARNESS/LLM MODELS/models.md` (junto com EVO-06) | médio: tier errado | voltar o mapeamento | custo por ponto estável ou caindo |
| EVO-13 | Telemetria do runtime (`akm.runtime.v1`) somada ao `Metrics/execution-log.md` | `Metrics/` | médio: dado sensível | remover a seção | eventos em 100% das delegações; zero conteúdo sensível |
| EVO-14 | Regra "delegar só para adapter com login confirmado e permissão read-only por padrão" | `Governance/` | baixo | reverter | zero delegação com permissão maior sem aprovação |

Ordem sugerida: EVO-11 → EVO-14 → (experimento aprovado) → EVO-12 → EVO-13.
