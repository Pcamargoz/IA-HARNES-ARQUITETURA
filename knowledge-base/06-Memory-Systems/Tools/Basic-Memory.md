---
title: "Basic Memory"
type: tool
category: memory
status: top10
description: "Memória persistente local em Markdown exposta por MCP: agentes leem e escrevem notas e relações num diretório que o Obsidian também abre."
score: 83
verified_at: 2026-10-29
integration: "MCP stdio via uvx sobre pastas Markdown (compatível com Obsidian)"
license: "AGPL-3.0"
repo: https://github.com/basicmachines-co/basic-memory
docs: "README do repositório"
stars: 4403
last_push: "2026-10-29"
last_release: "v0.24.1 (2026-10-23)"
open_issues: 73
adoption: "avaliar (E2)"
tags: [ai-agent-ecosystem, tool, memory, mcp-server, obsidian, markdown]
updated: 2026-10-29
---
# Basic Memory

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Basic Memory |
| Categoria | `memory` |
| Status na pesquisa | `top10` (nota 83/100) |
| Adoção no ambiente | avaliar (E2) |
| Repositório oficial | https://github.com/basicmachines-co/basic-memory |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 4403 / 73 |
| Último push / release | 2026-10-29 / v0.24.1 (2026-10-23) |
| Licença | AGPL-3.0 |
| Verificado em | 2026-10-29 |

## Descrição
Memória persistente local em Markdown exposta por MCP: agentes leem e **escrevem** notas e relações num diretório que o Obsidian também abre.

## Problema que resolve
Fatos e decisões se perdem entre sessões e entre clientes (Claude Code, Desktop).

## Casos de uso
- Memória compartilhada de decisões entre 3 clientes (E2)
- Registro de fatos com fonte e data

## Funcionalidades principais
- Projetos de memória (`basic-memory project add`)
- Leitura e escrita de notas com relações
- Sincronização com arquivos locais

## Requisitos
- Python ≥ 3.12 via `uv` (Mac tem 3.9; sem uv)

## Compatibilidade
- Claude Code/Desktop (stdio)
- Hermes — fora do escopo do ecossistema do Pedro

## Limitações
- **Escreve** no diretório: conflita com a regra do Harness (escrita só em `Inbox/`) se apontado para o vault principal
- Sobreposição com hermes-vault (MCP do Harness) e Agent-Knowledge-MCP (leitura)

## Segurança
- Licença AGPL-3.0: ok para uso local; atenção se redistribuído como serviço
- Apontar para pasta dedicada, nunca para o Cofre inteiro

## Licença
AGPL-3.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Rodar o E2 ([[E2-Basic-Memory-Obsidian]]) com um projeto **separado**
- Só adotar se ≥8/10 fatos forem recuperados nos 3 clientes sem conflito

## Integração com o Harness
Implementaria a camada de memória de `Memory Agents/memory.md` (schema fact/scope/source/date/expires) com ferramenta real.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
uv tool install basic-memory --prerelease=allow
basic-memory project add harness ~/Obsidian/Harness   # caminho do README; usar pasta dedicada
claude mcp add basic-memory -- uvx --prerelease=allow basic-memory mcp
```

## Status
- Pesquisa: `top10` · nota 83 · verificado em 2026-10-29
- Ambiente do Pedro: avaliar (E2)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Memoria-de-Agentes]] · [[Claude-Mem]] · [[Mem0]] · [[E2-Basic-Memory-Obsidian]] · [[Repository-Catalog]]
