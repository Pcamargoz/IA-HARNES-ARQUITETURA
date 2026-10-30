---
title: "Adapter OpenCode"
type: adapter-spec
runtime_component: adapter-opencode
adapter: opencode
kind: cli
impl_status: spec-only
tool_command: opencode
capabilities: [headless, structured_output, session_resume, cancel, timeout, mcp, permission_modes, file_edit]
source: https://opencode.ai/docs/cli
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter OpenCode

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://opencode.ai/docs/cli, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado 2.2.2; **nenhum provedor autenticado** (`opencode auth list`).

## Comando (read-only)
`opencode run --format json "<prompt>"`

## Saída
Formato de eventos não verificado; sem parser.

## Observações
Permissões dependem de config (não verificado).

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
