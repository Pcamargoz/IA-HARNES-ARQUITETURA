---
title: "Claude Haiku 5.5"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "claude-haiku-5-5"
provider: "Anthropic"
access_path: ["claude-code"]
adapter: claude-code
layer: core
tier: small
availability: available
context_window: "1M (API)"
cost_class: "cota-baixa (Pro)"
strengths: ["classificação", "extração", "roteamento", "resumo", "mais rápido da Anthropic"]
weaknesses: ["raciocínio raso em tarefas abertas"]
data_policy:
  trains_on_inputs: "opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado)"
  retention: "30 dias sem treino; até 5 anos com treino"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-opt-out"
local: false
verified_at: 2026-10-29
sources: ["https://docs.claude.com/en/docs/about-claude/models/overview", "https://support.claude.com/en/articles/14552983", "https://artificialanalysis.ai/leaderboards/models"]
---
# Claude Haiku 5.5

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `small`, disponibilidade `available`.

## Quando usar
Triagem, compressão de contexto, perguntas curtas, trabalho mecânico.

## Quando não usar
Código não trivial ou revisão.

## Números (datados)
AA Index: 36 (max), 25 (medium). Preço de API (referência, [[Model-Pricing]]): a partir de US$ 0,10 / 0,50 (≤100k). Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado). Retenção: 30 dias sem treino; até 5 anos com treino. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://docs.claude.com/en/docs/about-claude/models/overview
- https://support.claude.com/en/articles/14552983
- https://artificialanalysis.ai/leaderboards/models
