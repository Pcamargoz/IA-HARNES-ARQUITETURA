---
title: "Validação do Agent-Knowledge-MCP — 2026-10-29"
type: validation
status: done
verified_at: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, validation, tests]
---
# Validação do Agent-Knowledge-MCP — 2026-10-29

Execução no MacBook do Pedro (Intel), 29/10/2026 por volta de 20h37–20h40 (BRT), Node v22.23.2 (nvm), npm 10.9.8. Projeto em `~/Downloads/Agent-Knowledge-MCP`. Nenhum arquivo dos vaults foi escrito; testes de escrita/remoção usam cópias em diretório temporário do sistema.

## Ambiente
| Item | Valor |
|---|---|
| Dependências (`npm ls --depth=0`) | @modelcontextprotocol/sdk 1.32.2 · zod 4.6.7 · yaml 2.9.1 · typescript 5.9.3 · @types/node 22.20.5 |
| `npm install` | local à pasta; `found 0 vulnerabilities` |
| Observação | a 1ª instalação usava zod 3.25.76 e o `npm audit` apontou GHSA-mrhx-c7xc-m3w5 (alta; zod < 4.6.6). Atualizado para zod 4.6.7 (o SDK aceita ^3.25 ou ^4), tipos ajustados, testes refeitos. |

## Suíte com fixtures — `npm test`
Resultado real: **tests 29 · pass 27 · fail 0 · skipped 2** (os 2 pulados são os de vault real, rodados à parte). Duração ≈ 2,8 s.

| Área pedida | Teste | Resultado |
|---|---|---|
| Inicialização | `01-init` (5 testes): parse de raízes com vírgula; sem raiz → erro; indexa fixtures ignorando ocultos/negados/fora do include; raiz inexistente → sai com código 2; `initialize` via stdio | ✔ |
| Cliente real | `02-client`: cliente MCP do SDK oficial via stdio lista 10 tools, todas `readOnlyHint`, chama cada uma; recursos `akm://kb/index` e `akm://kb/status` | ✔ |
| Leitura e busca | `03-search-docs` (8 testes): palavra-chave, acentos, filtros, limites, zero resultados, outline/seção/linhas/truncamento, caminho sem raiz, links | ✔ |
| Atualização do índice | `04-index-update`: criar, alterar e remover nota em cópia temporária; TTL | ✔ |
| Permissões / symlink | `05-security`: 12 recusas + redação + `AKM_DENY_PATTERNS` | ✔ |
| Recuperação de erro | `06-recovery`: args inválidos, arquivo apagado, roadmap ausente, YAML quebrado | ✔ |
| Consulta ao Harness / tools de domínio | `07-domain-tools` (6 testes) | ✔ |

Saídas reais (trechos):
```
✔ busca por palavra-chave: 'serena java' traz Serena primeiro com fonte, seção e linha
1. Serena — cofre:AI-Agent-Ecosystem/03-MCP-Servers/Serena.md › Serena (L12) score=12 type=tool status=top10
ℹ após criar: 1. Nova Nota — cofre:AI-Agent-Ecosystem/Nova-Nota.md › Seção (L6) score=1 type=note
ℹ recusado cofre:AI-Agent-Ecosystem/../../outside/externo.md -> Erro (get_document): Caminho com '..' não é permitido.
ℹ recusado cofre:<tmp>/outside/externo.md -> Erro (get_document): Use caminho relativo à raiz, não absoluto.
ℹ recusado cofre:.obsidian/nota-oculta.md -> Erro (get_document): Caminho bloqueado pela política de segurança (oculto, node_modules ou possível credencial).
ℹ recusado cofre:Fora/fora.md -> Erro (get_document): Caminho fora das pastas autorizadas desta raiz.
ℹ recusado cofre:AI-Agent-Ecosystem/chave de api trello.md -> Erro (get_document): Caminho bloqueado pela política de segurança (oculto, node_modules ou possível credencial).
ℹ recusado cofre:AI-Agent-Ecosystem/link-externo.md -> Erro (get_document): Links simbólicos não são servidos.
ℹ recusado cofre:AI-Agent-Ecosystem/pasta-link/externo.md -> Erro (get_document): Caminho resolve para fora da raiz autorizada.
ℹ recusado desconhecida:x.md -> Erro (get_document): Raiz desconhecida: "desconhecida". Raízes: cofre, harness
ℹ Configuração: api_key = [REDACTED] e Bearer [REDACTED]
ℹ args inválidos -> MCP error -32602: Input validation error: Invalid arguments for tool search_knowledge: Invalid input: expected string, received number at query
ℹ arquivo apagado -> Erro (get_document): Documento não encontrado: cofre:AI-Agent-Ecosystem/03-MCP-Servers/Context7.md
```

## Vaults reais, somente leitura — `npm run test:real`
Resultado real: **tests 2 · pass 2 · fail 0**. Raízes: `cofre` = `~/Downloads/Cofre do Pedro`, `harness` = `~/Downloads/Harness-Architecture`.

Configuração padrão na época (KB + skills + nota do Hermes; a nota saiu do include em 29/10/2026):
```
raízes: cofre(AI-Agent-Ecosystem | Skills para main agents | Projetos/Hermes Agent no Docker.md); harness(*)
documentos: 149 (cofre=88, harness=61) | seções: 1390
última reindexação: ... (244 ms; reparseados 149, removidos 0; varreduras 1)
ignorados: negados=11 symlinks=0 grandes=0 | avisos de parse: 0
```

| Chamada (cliente MCP real) | Tempo | Tamanho | Primeiro resultado |
|---|---|---|---|
| `search_knowledge "serena java lsp"` | 19 ms | 1964 chars | Serena (score 21), depois E1 e ADR-006 |
| `search_knowledge "progressive context loading"` (root=harness) | 5 ms | 1629 chars | `harness:Memory Agents/context.md › Progressive loading` |
| `get_document` índice, `outline_only` | 4 ms | 484 chars | sumário com linhas |
| `list_agent_skills "spring"` | 3 ms | 1049 chars | 6 skills do Cofre |
| `find_mcp_servers status=top10` | 2 ms | 1280 chars | Serena 88, Context7 86, GitHub MCP 86… |
| `recommend_integration "memória persistente compartilhada entre Claude e Hermes"` | 3 ms | 1296 chars | Basic Memory (relevância 10.2) |
| `get_architecture harness-source` | 5 ms | 651 chars | sumário de `HARNESS/HARNESS MAIN/architecture.md` |
| `get_architecture harness-proposal` | 4 ms | 780 chars | sumário da proposta |
| `get_research_history` | 4 ms | 649 chars | rodada 2026-10-29 |
| `get_token_optimization budget` | 2 ms | 471 chars | sumário do orçamento |
| `get_implementation_roadmap F1` | 2 ms | 572 chars | seção F1 |
| `search_knowledge "chave api trello"` | 10 ms | 2050 chars | nenhuma nota de chave nos resultados ✔ |

Varredura do Cofre **inteiro** (sem allowlist; só ids e contagens):
```
documentos: 602 (cofre=541, harness=61) | seções: 5903 || ignorados: negados=42 symlinks=0 grandes=0 | avisos de parse: 4
"chave api trello": 20 hits, 0 proibidos
"chave api ia embarcada": 20 hits, 0 proibidos
"obsidian workspace plugins": 20 hits, 0 proibidos
```
Os 4 avisos de parse são frontmatter YAML inválido em notas existentes do Cofre (indexadas mesmo assim; não alteradas).

## Economia de tokens observada
Respostas padrão ficaram entre 471 e 2050 caracteres (≈120–520 tokens, estimando 4 caracteres/token). Ler a proposta inteira custaria ≈6600 caracteres; o sumário custou 780.

## Provado × não testado
| Integração | Situação |
|---|---|
| Cliente MCP do SDK oficial via stdio (Node 22, Mac) | **provado** (testes acima) |
| Leitura dos vaults reais com allowlist e bloqueios | **provado** |
| Claude Code (`claude mcp add`) | não testado — exemplo em `examples/claude-code-add.sh` |
| Claude Desktop | não testado — `examples/claude_desktop_config.json` |
| Hermes | fora do escopo do ecossistema do Pedro (29/10/2026); `examples/hermes-config.yaml` apagado |
| Busca semântica | não implementada (só avaliada) |

## Execução prévia no ambiente de desenvolvimento
Antes da cópia para o Mac: Node 20.19.2, mesmos 29 testes, 27 passaram, 2 pulados.
