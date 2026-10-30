---
title: "Adapter Qwen Code"
type: adapter-spec
runtime_component: adapter-qwen-code
adapter: qwen-code
kind: cli
impl_status: spec-only
tool_command: qwen
capabilities: [headless, structured_output, streaming, session_resume, cancel, timeout, mcp, sandbox, permission_modes, token_usage, file_edit]
source: https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Qwen Code

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://qwenlm.github.io/qwen-code-docs/en/users/features/headless/, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado 0.24.3; login **desconhecido** (sem comando oficial de status).

## Comando (read-only)
`qwen -p "<prompt>" -o json --approval-mode plan --max-session-turns 5`

## Saída
Envelope JSON com `result`. Parser `parseResultEnvelope`.

## Observações
Exit 53 = limite de turnos.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
