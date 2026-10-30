---
title: "Governança da orquestração"
type: policy
policy_area: governance
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, governance]
---
# Governança da orquestração

## Princípios
- O Harness-Architecture é a fonte das regras; esta KB **propõe**. Mudança no Harness só por ADR no próprio Harness e aprovação do Pedro (Harness ADR-001, `Governance/decisions.md`).
- Nenhum papel aprova a própria ação irreversível (Harness `Agents/roles.md`).
- Agentes não ampliam ferramentas, gastos ou permissões próprios (R10).
- MCP só de servidores confiáveis; o [[Agent-Knowledge-MCP]] é somente leitura.

## Mudança controlada
| Tipo | Aprovação | Registro |
|---|---|---|
| Nova nota/proposta na KB | Pedro (pedido explícito) | CHANGELOG |
| Novo agente `conceptual` | não precisa | Agent-Registry |
| Promover agente a `planned`/`implemented` | Pedro + evidência | ADR ou CHANGELOG |
| Mudança no Harness (EVO-xx) | Pedro, por proposta | ADR no Harness + commit isolado |
| Ação irreversível | Pedro, por ação | telemetria `hitl` |

## Licenças (pesquisa importada)
Ideias não têm copyright; trechos só com licença permissiva e atribuição (ver "Atribuição exigida" em [[Harness-Recommendations]]). Sem licença/ambígua (bradAGI, vivy-yi, `doc-coauthoring`): só fatos e links.

## Segurança
Sem segredos nas notas e na telemetria; kill switch proposto (EVO-10); varredura de segredos registrada na validação.

## Decisões desta área
[[ADR-007-Orquestracao-Documentada-Antes-do-Harness]] · [[ADR-008-Registro-de-Agentes-com-Status]] · [[ADR-009-Telemetria-JSONL-Local]] · [[ADR-010-Simulacao-Deterministica]]
