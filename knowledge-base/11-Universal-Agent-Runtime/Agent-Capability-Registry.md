---
title: "Registro de capacidades de agentes"
type: runtime-architecture
runtime_component: registry
status: proposed
category: runtime
updated: 2026-10-29
tags: [ai-agent-ecosystem, runtime]
---
# Registro de capacidades de agentes

`list_agent_adapters` junta três fontes:
1. manifests do código (`shell-echo`, `noop`, 7 CLIs);
2. notas `type: adapter-spec` desta área (inclui planejados, como [[Adapter-API]] e [[Adapter-Native]]);
3. o manifest de ambiente ([[Environment-Detection]]): instalado, versão e login, casando pelo binário (`tool.command`).

## Disponibilidade no Mac (29/10/2026)
| Adapter | Instalado | Login | Pronto para delegar? |
|---|---|---|---|
| [[Adapter-Claude-Code]] | 2.1.312 | ok (Pro) | sim, com aprovação (cota) |
| [[Adapter-Codex]] | 0.166.0 | ok (ChatGPT) | sim, com aprovação (cota) |
| [[Adapter-Cursor-Agent]] | 2026.10.22 | ok | sim, com aprovação (cota) |
| [[Adapter-Ollama-Local]] | 0.40.12 | n/a (local) | sim; modelo sem ferramentas |
| [[Adapter-OpenCode]] | 2.2.2 | sem provedor | não |
| [[Adapter-Qwen-Code]] | 0.24.3 | desconhecido | não (verificar login) |
| [[Adapter-Gemini-CLI]] | não | — | não |
| [[Adapter-Shell-Echo]] | node | n/a | sim (não é LLM) |

## Regras de seleção
- Filtrar por capacidade exigida (`capability`), depois por disponibilidade (`available_only`).
- Empate: menor custo esperado por sucesso ([[Model-Router]]).
- Adapter `spec-only` nunca é apresentado como testado.
