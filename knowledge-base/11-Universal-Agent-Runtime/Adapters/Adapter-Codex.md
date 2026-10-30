---
title: "Adapter Codex"
type: adapter-spec
runtime_component: adapter-codex
adapter: codex
kind: cli
impl_status: spec-only
tool_command: codex
capabilities: [headless, structured_output, streaming, session_resume, cancel, timeout, mcp, sandbox, permission_modes, token_usage, file_edit]
source: https://developers.openai.com/codex/noninteractive
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Codex

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://developers.openai.com/codex/noninteractive, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado codex-cli 0.166.0; login ok (ChatGPT).

## Comando (read-only)
`codex exec --json --sandbox read-only --skip-git-repo-check --ephemeral -C <dir> "<prompt>"`

## Saída
JSONL de eventos; a última mensagem do agente é a resposta; uso de tokens no evento de fim de turno. Parser `parseCodexJsonl`.

## Observações
Não reporta custo em USD.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
