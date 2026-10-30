---
title: "Adapter Claude Code"
type: adapter-spec
runtime_component: adapter-claude-code
adapter: claude-code
kind: cli
impl_status: spec-only
tool_command: claude
capabilities: [headless, structured_output, streaming, session_resume, cancel, timeout, mcp, subagents, permission_modes, token_usage, cost_usd, file_edit, web]
source: https://code.claude.com/docs/en/headless
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Claude Code

**Status:** `spec-only` — argv e parser escritos a partir da doc oficial (https://code.claude.com/docs/en/headless, vista em 29/10/2026); **nunca executado com tarefa real** (consome cota).

## Ambiente do Pedro (detecção de 29/10/2026)
Instalado 2.1.312; login ok (claude.ai, Pro).

## Comando (read-only)
`claude -p "<prompt>" --output-format json --permission-mode dontAsk --allowedTools Read,Grep,Glob --no-session-persistence`

## Saída
JSON único: `result`, `usage` (tokens), `total_cost_usd` (estimativa do cliente), `session_id`. Parser `parseClaudeJson`.

## Observações
Com assinatura Pro o custo real é cota. `--max-budget-usd` quando `budget.max_cost_usd` existir.

Ver [[Agent-Capability-Registry]] · [[CLI-Headless-Reference]] · [[Runtime-Policies]].
