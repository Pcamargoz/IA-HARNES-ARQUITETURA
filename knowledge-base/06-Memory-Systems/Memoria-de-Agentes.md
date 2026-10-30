---
title: "Memória de agentes"
type: guide
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, memory, moc]
---
# Memória de agentes

## Camadas
| Camada | O que guarda | Onde hoje | Proposta |
|---|---|---|---|
| Sessão | conversa atual | cliente | compactar ao trocar de tarefa |
| Projeto | decisões, estado, próximos passos | notas de projeto do Cofre (padrão do [[CLAUDE]]) | manter |
| Conhecimento | ferramentas, padrões, arquitetura | esta KB + Harness (lidos por MCP) | [[Agent-Knowledge-MCP]] |
| Fatos compartilhados entre clientes | preferências, decisões curtas | não existe | [[Basic-Memory]] (E2) |

## Schema de fato (do `Memory Agents/memory.md` do Harness)
`fact` · `scope` · `source` · `date` · `expires`. Só guardar o que for reutilizável, verificável e com fonte.

## Ferramentas avaliadas
| Ferramenta | Nota | Modelo | Recomendação |
|---|---|---|---|
| [[Basic-Memory]] | 83 | Markdown local + MCP (lê e escreve) | E2 em pasta dedicada |
| [[Claude-Mem]] | 76 | captura automática; padrão hospedado | radar (auditabilidade baixa) |
| [[Mem0]] | 70 | extração por LLM + vector store | radar (desloca custo) |

## Regras
- Memória explícita e auditável > memória implícita.
- Nenhuma ferramenta de memória escreve no Cofre principal (ADR-003 do Harness; regra do Consultor de contexto no Reserva de Mesas).
- Credenciais nunca viram memória.

Experimento: [[E2-Basic-Memory-Obsidian]].
