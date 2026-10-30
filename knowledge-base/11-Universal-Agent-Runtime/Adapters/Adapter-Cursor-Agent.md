---
title: "Adapter Cursor Agent"
type: adapter-spec
runtime_component: adapter-cursor-agent
adapter: cursor-agent
kind: cli
impl_status: spec-only
tool_command: cursor-agent
capabilities: [headless, structured_output, streaming, session_resume, cancel, timeout, mcp, file_edit]
source: https://cursor.com/docs/cli/headless
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Cursor Agent

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://cursor.com/docs/cli/headless, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado 2026.10.22-27dcf5f; login ok.

## Comando (read-only)
`cursor-agent -p --output-format json "<prompt>"` (sem `--force`: só propõe mudanças)

## Saída
Envelope JSON com `result`; campos de uso não documentados. Parser `parseResultEnvelope`.

## Observações
Tokens ficam `unavailable`.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
