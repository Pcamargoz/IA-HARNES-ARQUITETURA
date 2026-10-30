---
title: "Adapter Shell Echo"
type: adapter-spec
runtime_component: adapter-shell-echo
adapter: shell-echo
kind: local-process
impl_status: implemented
tool_command: node
capabilities: [headless, structured_output, cancel, timeout, parallel_safe]
source: tests/10-runtime.test.ts
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Shell Echo

**Status:** `implemented` e testado. Processo node real, sem LLM e sem rede: recebe o prompt por stdin e devolve `{echo, chars, pid}`. Marcadores de teste: `#delay=<ms>`, `#fail` (exit 3).

Serve para validar o contrato (spawn, timeout, cancelamento, captura, métricas, paralelismo) sem gastar cota. **Não é agente**; resultados dele nunca contam como delegação real.
