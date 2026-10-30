---
title: "Política de execução"
type: policy
policy_area: execution
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, execution]
---
# Política de execução

Lida por `get_execution_policy` (seções: limites, autonomia, irreversiveis, orcamentos, parada).

## Limites
| Tarefa | Máx. tentativas | Parar quando | Fonte |
|---|---|---|---|
| Fix simples | 2 | teste passa | Harness `Process/loops.md` |
| Feature | 3 por etapa | critério atingido | idem; R4 (`max_fix_attempts=3`) |
| Revisão | 2 rodadas | sem blockers/majors | idem |
| Pesquisa | 3 buscas por pergunta | fontes convergem | idem |
| Automação | 3 | execução estável | idem |
| Delegação | ≤ 6 filhos, profundidade ≤ 2 | — | R3 |

## Autonomia
| Nível | Pode | Precisa de aprovação |
|---|---|---|
| A0 Sugerir | só propor | tudo |
| A1 Leitura local (padrão) | ler, analisar, planejar | qualquer escrita/ação |
| A2 Escrita local | escrever em `Inbox/` | áreas canônicas, ações externas |
| A3 Execução supervisionada | executar no repo, rodar testes | publicar, apagar, produção |
| A4 Autonomia limitada | executar e entregar no critério | irreversíveis |
Fonte: Harness `Security/autonomy.md`. Promoção exige registro e período de revisão.

## Irreversiveis
Exigem aprovação explícita (união de Harness `Security/permissions.md` e R10):
enviar mensagens/e-mails; publicar; apagar arquivos/dados; pagar/contratar; `git push`, force-push, reescrita de histórico; deploy; `docker system prune`; mudar permissões de produção; rotacionar/expor credenciais; escrever em área canônica do cofre; envio externo.

## Orcamentos
- Por agente: `budget` do agent-spec (max_turns, max_retries, timeout_min).
- Contexto por tipo de tarefa: pergunta rápida < 4k, fix pequeno 4–10k, feature 10–30k, arquitetura 30–60k tokens (Harness `Optimization/token-strategy.md`; referências, não limites). Níveis L0–L3 em [[Context-and-Memory]].
- Custo em moeda: `--max-budget-usd` só se existir na versão instalada do CLI (**não verificado**).

## Parada
Pare e reporte quando: (1) critério atingido; (2) limite atingido; (3) duas falhas com a mesma causa; (4) ação precisa de aprovação; (5) custo > valor; (6) informação depende do Pedro (Harness `Process/loops.md`).
