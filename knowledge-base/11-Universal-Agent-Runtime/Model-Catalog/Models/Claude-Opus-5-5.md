---
title: "Claude Opus 5.5"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "claude-opus-5-5"
provider: "Anthropic"
access_path: ["claude-code", "cursor-agent (crédito)"]
adapter: claude-code
layer: core
tier: frontier
availability: available
context_window: "1M (API); no plano Pro a janela efetiva varia — conferir com /model"
cost_class: "cota-alta (Pro)"
strengths: ["arquitetura e planejamento", "debugging difícil", "refatoração transversal", "agentes de longa duração"]
weaknesses: ["consome bem mais cota do Pro que Sonnet", "latência moderada"]
data_policy:
  trains_on_inputs: "opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado)"
  retention: "30 dias sem treino; até 5 anos com treino"
  opt_out_confirmed: false
  opt_out_status: "Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação"
cofre_allowed: "apos-opt-out"
local: false
verified_at: 2026-10-29
sources: ["https://docs.claude.com/en/docs/about-claude/models/overview", "https://support.claude.com/en/articles/14552983", "https://artificialanalysis.ai/leaderboards/models", "https://lmarena.ai/leaderboard"]
---
# Claude Opus 5.5

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `frontier`, disponibilidade `available`.

## Quando usar
Plano/arquitetura (use `/model opusplan`: Opus planeja, Sonnet executa), debugging com causa desconhecida, revisão de alto risco.

## Quando não usar
Tarefas mecânicas, resumos, classificação; não gastar a janela de 5 h com isso.

## Números (datados)
Artificial Analysis Intelligence Index: 58 (max), 57 (xhigh), 52 (high). LMArena Agents 'Best Overall': 1º, 20,94%; Pareto a US$ 7,01/tarefa. Anthropic: 'comece por aqui' para trabalho complexo. Preço de API (referência, [[Model-Pricing]]): US$ 4 / 20 por 1M tokens. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado). Retenção: 30 dias sem treino; até 5 anos com treino. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://docs.claude.com/en/docs/about-claude/models/overview
- https://support.claude.com/en/articles/14552983
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
