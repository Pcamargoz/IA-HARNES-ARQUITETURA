---
title: "Qwen2.5 3B (Ollama local)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "qwen2.5:3b"
provider: "Alibaba (pesos abertos) via Ollama"
access_path: ["ollama", "opencode (ollama/qwen2.5:3b)"]
adapter: ollama
layer: local
tier: local
availability: installed
context_window: "32k nominal (não reverificado); prática menor em CPU"
cost_class: "zero (local)"
strengths: ["dados não saem do Mac", "sem cota", "instalado (1,9 GB)"]
weaknesses: ["fraco em raciocínio e código", "CPU Intel i5 sem GPU: lento; velocidade não medida"]
data_policy:
  trains_on_inputs: false
  retention: "local (~/.ollama)"
  opt_out_confirmed: "n/a"
cofre_allowed: "true"
local: true
verified_at: 2026-10-29
sources: ["CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)", "https://docs.ollama.com/macos"]
---
# Qwen2.5 3B (Ollama local)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **local**, tier `local`, disponibilidade `installed`.

## Quando usar
Classificação, resumo curto e qualquer conteúdo sensitive; Tier 0/local.

## Quando não usar
Código ou arquitetura.

## Números (datados)
Não aparece no AA nem no LMArena. Preço de API (referência, [[Model-Pricing]]): —. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: local (~/.ollama). Cofre: `true` — ver regra D2 no [[Model-Catalog]].

## Fontes
- CLI no Mac do Pedro, 29/10/2026 (--list-models / opencode models / ollama list / qwen --help)
- https://docs.ollama.com/macos
