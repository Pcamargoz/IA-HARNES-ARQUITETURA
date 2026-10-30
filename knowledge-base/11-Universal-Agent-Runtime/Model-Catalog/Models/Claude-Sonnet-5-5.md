---
title: "Claude Sonnet 5.5"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "claude-sonnet-5-5"
provider: "Anthropic"
access_path: ["claude-code", "cursor-agent (crédito)"]
adapter: claude-code
layer: core
tier: balanced
availability: available
context_window: "1M (API); efetiva no Pro varia"
cost_class: "cota-media (Pro)"
strengths: ["código do dia a dia (Java/Spring, React)", "pesquisa e docs", "rápido"]
weaknesses: ["abaixo de Opus em problemas longos e ambíguos"]
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
# Claude Sonnet 5.5

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **core**, tier `balanced`, disponibilidade `available`.

## Quando usar
Implementação, testes, front, docs, pesquisa com web; executor padrão no Claude Code.

## Quando não usar
Decisão de arquitetura crítica sem revisão.

## Números (datados)
AA Index: 54 (max), 50 (xhigh), 41 (high, US$ 1,64/tarefa). LMArena Agents: 3º, 13,84%. Suporte Claude Code: 'Sonnet para a maior parte do código'. Preço de API (referência, [[Model-Pricing]]): US$ 2 / 10. Consultado em 29/10/2026.

## Dados
Treina com entradas: opt-out (plano pessoal: treina se 'Help improve Claude' estiver ligado). Retenção: 30 dias sem treino; até 5 anos com treino. Cofre: `apos-opt-out` — ver regra D2 no [[Model-Catalog]]. Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação.

## Fontes
- https://docs.claude.com/en/docs/about-claude/models/overview
- https://support.claude.com/en/articles/14552983
- https://artificialanalysis.ai/leaderboards/models
- https://lmarena.ai/leaderboard
