---
title: "Preços de modelos (API)"
type: research
runtime_component: pricing
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, pricing]
---
# Preços de modelos (API)

Preço por **1 milhão de tokens** (USD), tabela padrão, contexto curto. Lido nas páginas oficiais em **29/10/2026**; preços mudam, confira antes de decidir. Assinaturas (Claude Pro, ChatGPT) não cobram por token: o custo é a cota.

## Anthropic — https://docs.claude.com/en/docs/about-claude/pricing
| Modelo | Entrada | Saída | Leitura de cache |
|---|---|---|---|
| Claude Fable 5.1 | 10 | 50 | 0,25 |
| Claude Opus 5.5 | 4 | 20 | 0,20 |
| Claude Opus 5 | 5 | 25 | 0,50 |
| Claude Sonnet 5.5 | 2 | 10 | 0,10 |
| Claude Sonnet 5 | 2 | 10 | 0,20 |
| Claude Haiku 5.5 (prompt ≤ 100 mil tokens) | 0,10 | 0,50 | 0,01 |
| Claude Haiku 4.5 | 1 | 5 | 0,10 |
Batch: −50%. Modelos 4.7+ usam tokenizador que gera ~30% mais tokens para o mesmo texto (segundo a página).

## OpenAI — https://developers.openai.com/api/docs/pricing
| Modelo | Entrada | Saída | Entrada em cache |
|---|---|---|---|
| gpt-6-astra | 10 | 50 | 1,00 |
| gpt-6.1-sol | 2 | 10 | 0,10 |
| gpt-6.1-terra | 1 | 5 | 0,05 |
| gpt-6-luna | 0,10 | 0,50 | 0,01 |
| gpt-5.3-codex | 1,75 | 14 | 0,175 |
| gpt-5-mini | 0,25 | 2 | 0,025 |
Contexto curto = até 272 mil tokens de entrada. Batch/Flex: −50%.

## Local
Ollama `qwen2.5:3b`: custo monetário zero; custo de CPU/tempo no Intel i5 do Pedro (não medido).

## Como usar
Custo por tentativa = tokens_in × preço_entrada + tokens_out × preço_saída (÷ 10⁶). Decida por **custo por sucesso** ([[Model-Router]]), não pelo preço por token. Valores calculados a partir desta tabela são **estimativas** (`cost_source: estimated`).
