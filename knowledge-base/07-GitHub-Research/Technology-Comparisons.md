---
title: "Comparações de tecnologias"
type: comparison
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, comparison]
---
# Comparações de tecnologias

## Spring AI × LangChain4j × Embabel (IA em Java)
| Critério | [[Spring-AI]] | [[LangChain4j]] | [[Embabel-Agent]] |
|---|---|---|---|
| Modelo de programação | Spring (ChatClient, advisors, starters) | AI Services declarativos | agentes por objetivos |
| MCP | starters client/server sobre o SDK oficial | cliente MCP | via Spring (verificar) |
| Encaixe na stack (Boot 4.1.1) | 2.x exige Boot 4.x ✓ | starters Spring | sobre Spring |
| Nota | 83 | 76 | 74 |
| **Recomendação** | **padrão para a F5** | alternativa fora do Spring | radar |

## Memória: Basic Memory × claude-mem × Mem0
| Critério | [[Basic-Memory]] | [[Claude-Mem]] | [[Mem0]] |
|---|---|---|---|
| Armazenamento | Markdown local | local (opt-in) ou hospedado (padrão) | vector store + LLM |
| Auditável no Obsidian | sim | não diretamente | não |
| Custo | sem LLM extra | compressão por IA | LLM a cada escrita (desloca custo) |
| Licença | AGPL-3.0 | Apache-2.0 | Apache-2.0 |
| **Recomendação** | **E2** | radar | radar |

## Conhecimento do vault: hermes-vault × Agent-Knowledge-MCP × Basic Memory
| Critério | hermes-vault 0.3.1 | [[Agent-Knowledge-MCP]] 0.1.0 | Basic Memory |
|---|---|---|---|
| Vaults | 1 (Harness) | vários (Cofre KB + Harness) | projetos próprios |
| Escrita | opcional (desligada) | **nunca** | sim |
| Busca | lexical por chunks | lexical ponderada + filtros de frontmatter | (ver doc) |
| Tools de domínio | genéricas (vault_*) | KB: arquitetura, MCPs, skills, tokens, roadmap | memória |
| Papel | manter | complementar | memória de fatos |

## Contexto de código: Serena × Repomix × leitura direta
| Critério | [[Serena]] | [[Repomix]] | leitura direta |
|---|---|---|---|
| Granularidade | símbolo | repositório/pasta | arquivo |
| Uso | iterativo | pontual | padrão atual |
| Custo de contexto | baixo (est.) | alto se sem filtro | alto |

## Roteamento: subagentes × Claude Code Router × LiteLLM
Ver [[Roteamento-de-Modelos]]. Subagentes com modelo por papel primeiro; roteadores multi-provedor ficam no radar.
