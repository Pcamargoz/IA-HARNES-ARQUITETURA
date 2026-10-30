---
title: "Capability Manifest"
type: runtime-architecture
runtime_component: manifest
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Capability Manifest

Cada adapter publica um manifest (`CapabilityManifest`). O [[Agent-Capability-Registry]] cruza esses manifests com o manifest de ambiente ([[Environment-Detection]]).

## Campos
| Campo | Conteúdo |
|---|---|
| `adapter`, `kind` | id e tipo: `cli`, `api`, `local-process`, `test-double` |
| `status` | `implemented` (executado em teste) ou `spec-only` (escrito a partir da doc oficial, nunca executado aqui) |
| `tool.command` | binário esperado |
| `capabilities` | `headless`, `structured_output`, `streaming`, `session_resume`, `cancel`, `timeout`, `mcp`, `subagents`, `sandbox`, `permission_modes`, `token_usage`, `cost_usd`, `file_edit`, `web`, `parallel_safe` |
| `requirements` | o que precisa existir (binário, login) |
| `permissions` | modo padrão (sempre `read-only`), permitidos, negados |
| `limits` | timeout padrão e máximo, tamanho máximo do prompt, paralelismo |
| `metrics` | se tokens/custo são `reported` ou `unavailable` |
| `verified` | fonte oficial e data da verificação |

## Status atual (código)
| Adapter | kind | status |
|---|---|---|
| shell-echo | local-process | implemented |
| noop | test-double | implemented |
| claude-code, codex, opencode, gemini-cli, qwen-code, cursor-agent, ollama-local | cli | spec-only |
