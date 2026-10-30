---
title: "Adapter Gemini CLI"
type: adapter-spec
runtime_component: adapter-gemini-cli
adapter: gemini-cli
kind: cli
impl_status: spec-only
tool_command: gemini
capabilities: [headless, structured_output, streaming, session_resume, cancel, timeout, mcp, permission_modes, token_usage, file_edit, web]
source: https://geminicli.com/docs/cli/headless
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Gemini CLI

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://geminicli.com/docs/cli/headless, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
**Não instalado** no Mac.

## Comando (read-only)
`gemini -p "<prompt>" --output-format json`

## Saída
JSON com `response` e `stats`. Parser `parseGeminiJson`.

## Observações
Doc avisa migração de contas gratuitas/Google One para o Antigravity CLI (18/06/2026). Instalar exige aprovação.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
