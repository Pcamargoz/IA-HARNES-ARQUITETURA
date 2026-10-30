---
title: "Qwen3.5 4B (Ollama — candidato)"
type: model-card
status: active
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, model-card]
model_id: "qwen3.5:4b"
provider: "Alibaba via Ollama"
access_path: ["ollama (não baixado)"]
adapter: ollama
layer: local
tier: local
availability: candidate-not-installed
context_window: "256K nominal (biblioteca Ollama)"
cost_class: "zero (local)"
strengths: ["3,3–4,0 GB: cabe nos 16 GB", "multimodal (texto e imagem)"]
weaknesses: ["não baixado — baixar exige aprovação do Pedro", "velocidade em CPU não medida"]
data_policy:
  trains_on_inputs: false
  retention: "local (~/.ollama)"
  opt_out_confirmed: "n/a"
cofre_allowed: "true"
local: true
verified_at: 2026-10-29
sources: ["https://ollama.com/library/qwen3.5"]
---
# Qwen3.5 4B (Ollama — candidato)

Ficha do [[Model-Catalog]] — fotografia de 2026-10-29 (revisão mensal). Camada **local**, tier `local`, disponibilidade `candidate-not-installed`.

## Quando usar
Substituto natural do qwen2.5:3b se aprovado.

## Quando não usar
—

## Números (datados)
Sem ranking verificado para o 4B. Preço de API (referência, [[Model-Pricing]]): —. Consultado em 29/10/2026.

## Dados
Treina com entradas: False. Retenção: local (~/.ollama). Cofre: `true` — ver regra D2 no [[Model-Catalog]].

## Fontes
- https://ollama.com/library/qwen3.5
