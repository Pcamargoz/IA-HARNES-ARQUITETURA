---
title: "langchain-ai/langgraph"
type: repo-profile
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
reuso: "ficha é síntese própria; citações curtas e atribuídas; reutilize o repositório de origem apenas conforme a licença indicada em licenca"
tipo: ficha-repositorio
categoria: [runtime-de-orquestracao, grafo-de-estado, durable-execution, HITL]
repo: https://github.com/langchain-ai/langgraph
licenca: MIT
estrelas: 44119
ultimo_push: 2026-10-29
ultima_release: 1.2.18 (2026-10-26)
arquivado: false
nota: 80
verificado_em: 2026-10-29
tags: [orquestracao, state-graph, checkpoint, interrupt, python]
---

# LangGraph

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Ver [[Pattern-Catalog]] · [[Architecture-Comparison]] · [[Harness-Recommendations]]

## Metadados verificados
- ⭐ 44.119 · push 29/10/2026 · não arquivado
- Releases: `1.2.18` (26/10/2026), `sdk==0.4.10`, `cli==0.4.40`
- Licença **MIT**: código e padrões reutilizáveis com aviso de copyright.

## O que li
- `AGENTS.md` (raiz, via conector GitHub) e a documentação oficial de **Interrupts** (https://docs.langchain.com/oss/python/langgraph/interrupts).

## Padrões encontrados
1. **LangGraph como runtime, não SDK de agente** (`AGENTS.md`, "Direction: LangGraph is a runtime"): *"graph execution, checkpointing, streaming, and interrupt/resume"*. A construção de agentes fica uma camada acima, no harness **Deep Agents** (repo separado).
2. **Pacotes de agente em manutenção:** *"Agent-level packages (`prebuilt`, `langgraph-supervisor`, `langgraph-swarm`, `langgraph-cua`) are maintenance-only"*. ⚠️ **Não basear um projeto novo em `langgraph-supervisor` ou `langgraph-swarm`.**
3. **HITL durável:** `interrupt()` pausa e persiste o estado via checkpointer, e a execução retoma com `Command(resume=...)` usando o mesmo `thread_id`. Desde `langgraph>=1.2.12` existe um `response_schema` tipado (Pydantic) para a resposta humana.
4. **Regras de idempotência:** *"Side effects called before `interrupt` must be idempotent"*. Como o nó reexecuta do início ao retomar, efeitos colaterais vão depois do interrupt ou em nó separado.
5. **Anti-loop:** a doc proíbe `while True` + `interrupt()` dentro de um nó. A validação deve usar aresta condicional.
6. **Política de API:** *"One way to do each thing"*, com a remoção deliberada de APIs passando por deprecação. É uma boa política de governança para o próprio Harness.
7. **Checkpointers** `checkpoint-sqlite` e `checkpoint-postgres`, para memória de curto prazo por thread.

## Pontos fortes
- O modelo mais rigoroso de **estado + retomada + aprovação humana** entre os analisados. Serve de referência conceitual para o `FAILURE-RECOVERY.md` e o `HUMAN-APPROVAL.md`.
- Manutenção corporativa ativa e política de API conservadora.

## Pontos fracos
- Python/JS. Não há SDK Java no repositório (o LangGraph4j é um projeto de terceiros, não verificado aqui).
- Não é nativo de Claude Code: adotar o runtime significa operar um serviço Python à parte.
- As peças de agente pronto foram rebaixadas para manutenção, e a recomendação passou ao Deep Agents, que não analisei.

## Aderência
Média. **Adotar os conceitos** (estado explícito, checkpoint, interrupt com schema, idempotência) e **não o runtime**, a menos que o Pedro queira um orquestrador headless em Docker.

## Nota
| Critério | Peso | Sub | Pts |
|---|---|---|---|
| Utilidade | 25 | 70 | 17,5 |
| Qualidade técnica | 20 | 95 | 19,0 |
| Manutenção | 15 | 95 | 14,25 |
| Integração | 15 | 60 | 9,0 |
| Economia | 15 | 75 | 11,25 |
| Segurança/doc | 10 | 90 | 9,0 |
| **Total** | | | **≈ 80** |

## Lacunas
- Não verifiquei o valor padrão de `recursion_limit` na versão 1.2.x.
- Não li o repositório `langchain-ai/deepagents`.
