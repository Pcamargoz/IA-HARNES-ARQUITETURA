---
title: "Política de roteamento de modelo"
type: policy
policy_area: routing
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, routing]
---
# Política de roteamento de modelo

| Tier (alias) | Uso | Exemplos | Fonte |
|---|---|---|---|
| tier0 | sem LLM | formatter, OpenRewrite, `./mvnw test`, grep, scripts | R6 |
| small | busca, resumo, triagem, extração | Researcher, QA leve | Harness `models.md` (Small/fast) |
| balanced | implementação, docs, revisão comum | Builder, Reviewer | Harness `models.md` (Balanced) |
| frontier | arquitetura, alto risco, revisão crítica | java-architect | Harness `models.md` (Frontier) |

- Aliases no agent-spec; mapeamento alias → modelo real em **um** arquivo de config (proposta EVO-06). Hoje o `models.md` do Harness **não** mapeia modelos reais; na KB, o mapeamento alias → modelo real está em [[Model-Catalog]] (29/10/2026).
- Escalar um tier só com causa registrada no evento de telemetria (`escalation_reason`).
- Ganho de custo citado pelo ruflo (-30 a -50%) **não verificado**.
Ver também [[Roteamento-de-Modelos]].
