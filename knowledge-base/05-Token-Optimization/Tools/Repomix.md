---
title: "Repomix"
type: tool
category: token-optimization
status: radar
description: "Empacota um repositório em um único arquivo amigável a LLMs, com contagem de tokens e opção de compressão estrutural."
score: 73
verified_at: 2026-10-29
integration: "CLI via npx; modo servidor MCP (segundo README)"
license: "MIT"
repo: https://github.com/yamadashy/repomix
docs: "README do repositório"
stars: 29074
last_push: "2026-10-28"
last_release: "v1.18.1 (2026-09-21)"
open_issues: 152
adoption: "radar"
tags: [ai-agent-ecosystem, tool, token-optimization, context-packing, mcp-server]
updated: 2026-10-29
---
# Repomix

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Repomix |
| Categoria | `token-optimization` |
| Status na pesquisa | `radar` (nota 73/100) |
| Adoção no ambiente | radar |
| Repositório oficial | https://github.com/yamadashy/repomix |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 29074 / 152 |
| Último push / release | 2026-10-28 / v1.18.1 (2026-09-21) |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Empacota um repositório em um único arquivo amigável a LLMs, com contagem de tokens e opção de compressão estrutural.

## Problema que resolve
Dar visão ampla de um repo a um modelo de chat (ex.: Opus no Claude Desktop) para revisão de arquitetura.

## Casos de uso
- Revisão de arquitetura pontual de um módulo
- Gerar contexto para ADR

## Funcionalidades principais
- Contagem de tokens
- Compressão (segundo README)
- Filtros include/ignore
- Modo MCP

## Requisitos
- Node/npx

## Compatibilidade
- Qualquer cliente (arquivo) ou MCP

## Limitações
- Saída grande se mal filtrada — oposto de economia

## Segurança
- Revisar o pacote antes de colar em serviço externo; o README cita checagem de segredos (verificar)

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Usar só com filtros por pasta; preferir Serena para trabalho iterativo

## Integração com o Harness
Ferramenta pontual para a fase *Understand* em tarefas de arquitetura.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
npx repomix --include "src/main/java/**" --output contexto.xml
```

## Status
- Pesquisa: `radar` · nota 73 · verificado em 2026-10-29
- Ambiente do Pedro: radar
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Serena]] · [[Headroom]] · [[Repository-Catalog]]
