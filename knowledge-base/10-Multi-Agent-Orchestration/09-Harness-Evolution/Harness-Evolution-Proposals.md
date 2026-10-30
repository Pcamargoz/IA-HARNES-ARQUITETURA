---
title: "Propostas de evolução do Harness"
type: proposal
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, harness, proposal]
---
# Propostas de evolução do Harness

> **Estado atualizado em 29/10/2026:** Pedro aprovou o plano. A integração foi aplicada em commits por etapa na branch integration/agent-knowledge. Contratos/documentação não comprovam delegação real. As alterações locais preexistentes foram preservadas. Ver [[Integracao-Clientes-2026-10-29]] para evidências e limites.

## Cuidado antes de aplicar
Em 29/10/2026 o Harness tinha mudanças locais **não commitadas do Pedro** (`git status`: `Metrics/execution-log.md` e arquivos de `video-engine/` modificados, `video-engine/scripts/grade-bateria.py` novo). Não incluir essas alterações nos commits da integração. A implementação aprovada preservou seus bytes e adicionou o contrato de baseline em Metrics/baseline.md, sem editar execution-log.md.

## Propostas (base: [[Harness-Recommendations]])
| ID | Proposta | Rec. | O que muda no Harness | Risco | Plano de reversão | Critério de sucesso |
|---|---|---|---|---|---|---|
| EVO-01 | Prompt do orquestrador ≤150 linhas | R1 | `AGENTS.md` (ou novo `HARNESS/HARNESS MAIN/orchestrator-prompt.md`) com os 8 blocos de [[Main-Orchestrator-Prompt]] | médio: regra importante ficar fora do mapa | `git revert <commit>` do arquivo; o AGENTS.md atual continua no histórico | tokens fixos medidos antes/depois; 3 tarefas sem regressão |
| EVO-02 | Registro de agentes com validador | R2 | nova pasta `Agents/specs/*.md` (frontmatter de [[Agent-Spec-Template]]) + script de validação em `.mcp/test/` | baixo: campos extras são inertes | apagar a pasta nova e o script (commit isolado) | validador passa; `list_registered_agents` lê as mesmas specs |
| EVO-03 | Contrato de delegação | R3 | seção nova em `HARNESS/HARNESS MAIN/orchestration.md` (≤6 filhos, profundidade ≤2, um escritor por arquivo) | baixo: menos paralelismo | reverter o commit; limites voltam ao texto atual | nenhum conflito de edição em 3 tarefas paralelas |
| EVO-04 | Pipeline com loop limitado e estados terminais | R4 | `Process/loops.md` + `Process/workflow.md`: `max_fix_attempts=3`, estados complete/failed/cancelled | médio: abortar tarefa legítima | reverter commit ou ajustar limite por tipo | nenhum loop > 3 no execution-log |
| EVO-05 | Verificador independente | R5 | role card `Verifier` em `Agents/roles.md` (sem Write/Edit) ou evolução do Reviewer | baixo: custo extra | remover a seção; Reviewer atual permanece | falso 'concluído' = 0 em 5 tarefas |
| EVO-06 | Mapa de tiers para modelos reais | R6 | preencher `HARNESS/LLM MODELS/models.md` com alias → modelo (um único lugar) | médio: tier baixo errar | voltar o mapeamento anterior (commit) | custo por ponto estável ou caindo |
| EVO-07 | Orçamentos por agente | R7 | campo `budget` nas specs + regra no orquestrador; checar se `--max-budget-usd` existe no CLI instalado | baixo | remover campos (inertes) | nenhuma tarefa estoura timeout sem relatório |
| EVO-08 | Memória de curto prazo `.harness/` | R8 | convenção `.harness/{state.json,plans,handoffs,notepad.md}` nos repositórios de trabalho (não no cofre) + `.gitignore` | baixo: estado obsoleto | apagar `.harness/` do repositório de trabalho; cofre intocado | retomada após compactação sem retrabalho |
| EVO-09 | Telemetria JSONL | R9 | hook `SubagentStop`/`PostToolUse` no Claude Code gravando [[Telemetry-Schema]] fora do cofre | médio: vazar conteúdo | desligar o hook (remover entrada de settings) — exige aprovação para editar config | eventos em 100% das tarefas; zero conteúdo sensível |
| EVO-10 | HITL, irreversíveis e kill switch | R10 | hook `PreToolUse` com exit 2 para a lista de [[Execution-Policy]]; variável `HARNESS_ORCH_DISABLE` | médio: atrito | remover o hook; variável de ambiente desliga sem editar arquivos | zero ação irreversível sem aprovação |

## Plano de reversão geral
1. Uma branch por proposta (`evo/EVO-xx`), um commit por proposta, sem misturar com o trabalho do Pedro.
2. Antes: anotar `git rev-parse HEAD` e rodar `npm test` em `.mcp/`.
3. Reverter = `git revert <commit>` (nunca `reset --hard` nem force-push).
4. Hooks/configs de cliente (EVO-09, EVO-10) ficam fora do repositório; reverter = remover a entrada adicionada (exige aprovação, pois são configs do Pedro).
5. Depois de reverter: `npm test` em `.mcp/` e uma tarefa de fumaça.

Continuação: EVO-11 a EVO-14 (runtime de agentes) em [[Harness-Integration-Runtime]].

## Ordem sugerida
EVO-03 → EVO-04 → EVO-05 (só texto, risco baixo) → EVO-01 (medir tokens) → EVO-02 → EVO-08 → EVO-06/07 → EVO-09/10 (mexem em configs).

## Ajustes aceitos durante a integração

- EVO-02: fonte canônica mantida na KB; Agents/registry.md no Harness referencia as specs, e scripts/validate-harness.mjs no Agent-Knowledge-MCP as valida. Não foram criadas cópias nem alterado hermes-vault.
- EVO-05: contrato Verifier adicionado, sem provisionar agente nativo ou promover status.
- EVO-06/12: aliases condicionais sonnet/opus e tier0, sem benchmarks ou promoção de adapter. O teste nativo encontrou limite de cota.
- EVO-08: convenção documentada; não foi criado estado em outro repositório.
- EVO-09/10: hooks locais configurados e contratos testados; invocação em sessão real permanece não comprovada por causa da falha antes do uso de tools.
- EVO-13: bridge de metadados implementada; nenhum recibo de execução de agente foi fabricado.
- Rollback usa os commits isolados da branch de integração, sem reset, stash ou commit das alterações preexistentes.
