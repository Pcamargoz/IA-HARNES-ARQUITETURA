---
title: "Harness-Architecture — arquitetura atual (análise)"
type: architecture
status: active
verified_at: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, harness, analysis]
---
# Harness-Architecture — arquitetura atual (análise)

Leitura feita em 29/10/2026 (somente leitura). Caminhos relativos à raiz do Harness-Architecture.

## Arquitetura atual
- **Fases:** Foundation → Cognition → Execution → Evolution (`HARNESS/HARNESS MAIN/architecture.md`).
- **Camadas:** Interface, Cognition, Execution, Control, Evolution; fluxo de informação em 9 passos; princípios de design e modos de falha documentados.
- **Main Agent** (`main-agent.md`): responsabilidades, ciclo de 10 passos, template de handoff brief.
- **Orquestração** (`orchestration.md`): brief, topologias (direta, sequencial, paralela, especialista + coordenador), consolidação, prevenção de loops, quality gates, anti-padrões.
- **Contrato global** (`AGENTS.md`): hierarquia de instruções; níveis de contexto L0 (HOME+AGENTS, ~2k tokens), L1 (entrada da área), L2 (2–4 notas), L3 (busca); papéis Main Agent / Subagent / Specialist; fluxo Understand→Specify→Plan→Execute→Validate→Deliver→Record; escrita só em `Inbox/`; formato de entrega Status/Result/Evidence/Open items; condições de parada; mudanças exigem ADR.
- **Contexto** (`Memory Agents/context.md`): carga progressiva; orçamentos <4k (simples), 4–10k (correção pequena), 10–30k (feature), 30–60k (arquitetura); notas <250 linhas; *context rot*.
- **Memória** (`Memory Agents/memory.md`): camadas, critérios de armazenamento, schema fact/scope/source/date/expires, ciclo de vida.
- **Tokens** (`Optimization/token-strategy.md`): 8 técnicas, **sem medição**. `delegation-cost.md`: equação de custo de delegação.
- **Segurança** (`Security/permissions.md`): níveis de acesso L0–L3; `autonomy.md`.
- **Modelos** (`HARNESS/LLM MODELS/models.md`): tiers small/balanced/frontier e matriz de roteamento, **sem modelos reais**. `ide-harness.md`: separação cliente/LLM/harness.
- **Governança:** ADRs 001–011 (vault fonte única; MCP stdio local; escrita desligada; frontmatter title/type/status/updated/tags; busca lexical primeiro — revisar perto de 500 notas; nomes em inglês; MCP v0.2; status candidate + catálogo de repos; MCPs web em escopo de projeto; video engine).
- **MCP:** hermes-vault v0.3.1 — 13 tools, RAG lexical por chunks de heading (máx. 3×1500 chars), escrita e git desligados por padrão, TTL de índice 3 s, um vault só.

## Pontos fortes
1. Contrato claro e curto (L0 ~2k tokens) com níveis de contexto.
2. Segurança conservadora: read-only, escrita em `Inbox/`, ADR obrigatório.
3. MCP próprio maduro para o vault, com testes (smoke, retrieve, check-links, write-enabled).
4. Catálogos com status *candidate* evitam adoção impulsiva.

## Lacunas
| # | Lacuna | Evidência |
|---|---|---|
| 1 | Sem MCP de contexto de código (Java) | catálogo de MCPs não lista Serena ou similar |
| 2 | Métricas manuais, sem baseline | `Metrics/execution-log.md`, `scorecard.md` sem automação |
| 3 | Modelos reais não preenchidos | `models.md` |
| 4 | Sem acesso ao conhecimento do Cofre do Pedro | hermes-vault é single-vault |
| 5 | Técnicas de tokens sem ferramenta nem medição | `token-strategy.md` |
| 6 | Memória descrita, não implementada entre clientes | `memory.md` |
| 7 | Fluxo descrito, não executado por ferramenta | `Process/workflow.md` |
| 8 | Catálogos sem Serena, Basic Memory, Spring AI, MCP Java SDK, Headroom, LangChain4j | `Optimization/*-catalog.md` |

A checagem heurística de links apontou 19 alvos suspeitos, quase todos `\|` escapado em tabelas e templates (provável falso positivo; não corrigido).

Proposta: [[Harness-Improvement-Proposal]].
