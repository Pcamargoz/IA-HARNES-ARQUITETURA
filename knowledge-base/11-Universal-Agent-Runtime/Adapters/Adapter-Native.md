---
title: "Adapter Native (noop)"
type: adapter-spec
runtime_component: adapter-native
adapter: noop
kind: test-double
impl_status: implemented
tool_command: —
capabilities: [headless]
source: src/runtime/adapters/noop.ts
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime, adapter]
---
# Adapter Native (noop)

**Status:** `implemented`. Representa o "agente nativo" (o próprio orquestrador fazendo a tarefa) e serve de dublê em testes: devolve sempre `status: not_executed` com o motivo. Nunca inventa resposta.

Uso: quando o Router decide **não delegar** (tarefa trivial ou sem adapter pronto), o evento ainda é registrado, rotulado como não executado.
