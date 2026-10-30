---
title: "Adapter Ollama Local"
type: adapter-spec
runtime_component: adapter-ollama-local
adapter: ollama-local
kind: cli
impl_status: spec-only
tool_command: ollama
capabilities: [headless, cancel, timeout, parallel_safe]
source: ollama --help (local)
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Ollama Local

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (ollama --help (local), vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado 0.40.12; servidor ativo; modelo `qwen2.5:3b`.

## Comando (read-only)
`ollama run qwen2.5:3b "<prompt>"`

## Saída
Texto puro.

## Observações
Modelo, não agente: sem ferramentas; recebe arquivos como contexto controlado. Custo monetário zero.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
