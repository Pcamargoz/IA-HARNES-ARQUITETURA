---
title: "Agent-Knowledge-MCP — visão geral"
type: architecture
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, agent-knowledge-mcp]
---
# Agent-Knowledge-MCP — visão geral

Servidor MCP **somente leitura** que entrega a agentes (Claude Code, Claude Desktop, sessões do Harness) o conhecimento desta KB, das skills do Cofre e do Harness-Architecture, em pedaços pequenos.

- **Código:** `~/Downloads/Agent-Knowledge-MCP` (TypeScript, SDK oficial 1.32.2, stdio, Node ≥ 20).
- **Versão:** 0.3.0 (0.1.0 em 29/10; 0.2.0 com as tools de orquestração; 0.3.0 com o runtime universal de agentes, no mesmo dia).
- **Decisões:** [[ADR-002-MCP-em-TypeScript]], [[ADR-003-Somente-Leitura-Multi-Raiz]], [[ADR-004-Busca-Lexical-Primeiro]], [[ADR-005-Frontmatter-Padronizado]].

## Arquitetura
```
cliente MCP ──stdio──> index.ts ─> createServer (registro de tools em laço)
                                   ├─ tools/*.ts   (1 arquivo por tool; ToolDefinition)
                                   ├─ resources    (akm://kb/index, akm://kb/status)
                                   └─ ToolContext { config, guard, index, log }
                                         ├─ PathGuard (allowlist, symlink, ocultos, deny)
                                         ├─ KnowledgeIndex (memória, refresh incremental por mtime+size, TTL)
                                         └─ search/query (lexical ponderada + filtros de frontmatter)
saída de toda tool ─> redact() ─> limite rígido de tamanho
```

## Raízes padrão
| Raiz | Caminho | Incluído |
|---|---|---|
| `cofre` | Cofre do Pedro | `AI-Agent-Ecosystem/`, `Skills para main agents/` (a nota do Hermes saiu do include em 29/10/2026: Hermes fora do escopo do ecossistema do Pedro) |
| `harness` | Harness-Architecture | tudo, exceto ocultos/negados |

## Tools
Ver [[Tools-Reference]]. Resumo: `search_knowledge`, `get_document`, `list_agent_skills`, `find_mcp_servers`, `get_architecture`, `recommend_integration`, `get_research_history`, `get_token_optimization`, `get_implementation_roadmap`, `knowledge_status` (diagnóstico). Orquestração (0.2.0): `get_orchestrator_policy`, `list_registered_agents`, `get_agent_specification`, `find_relevant_skills`, `find_workflow_template`, `get_execution_policy`, `get_metric_definitions`, `get_architecture_decisions` — fonte: [[MOC-Multi-Agent-Orchestration]]. Runtime (0.3.0): `get_runtime_architecture`, `list_agent_adapters`, `get_model_routing_policy`, `get_environment_capabilities` — fonte: [[MOC-Universal-Agent-Runtime]]. Total: 22 tools.

## Relação com o hermes-vault
`hermes-vault` é o nome do MCP **do próprio Harness** (`Harness-Architecture/.mcp/`), não uma integração com o Hermes Agent. Complementar: o hermes-vault (13 tools, 1 vault, escrita opcional) continua servindo o Harness. O Agent-Knowledge-MCP é multi-vault, nunca escreve e tem tools de domínio da KB. Comparação: [[Technology-Comparisons]].

## Como estender
1. Criar `src/tools/<nome>.ts` com `defineTool({ name, title, description, inputSchema, handler })`.
2. Adicionar ao array `TOOLS` em `src/tools/index.ts`.
3. Se depender de nota fixa, registrar o caminho em `src/tools/kb-layout.ts`.
4. Filtrar por frontmatter com `filterDocs(index, { type, status, category, tag, pathPrefix })`.
5. Teste em `tests/` usando o cliente real (`connect()`).
As 8 tools de orquestração seguem esse caminho e localizam notas por `type`/`policy_area` em `10-Multi-Agent-Orchestration/` (helpers em `src/tools/orchestration-helpers.ts`). Simulação: `npm run simulate`.

## Integração
Alvo: o Harness em `~/Downloads/Harness-Architecture`; Hermes Agent fora do escopo. [[Integracao-Clientes]] · Validação: [[Validacao-Agent-Knowledge-MCP-2026-10-29]] · [[Validacao-Orquestracao-2026-10-29]] · [[Validacao-Runtime-2026-10-29]] · Busca semântica: [[Busca-Semantica-Avaliacao]]
