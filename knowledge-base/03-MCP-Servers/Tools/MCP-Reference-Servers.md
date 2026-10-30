---
title: "MCP Reference Servers (modelcontextprotocol/servers)"
type: tool
category: mcp-server
status: radar
description: "Coleção de servidores MCP de referência mantida pelo projeto MCP (ex.: filesystem, git, fetch, memory, time). Serve mais como exemplo de implementação do que como produto."
score: 77
verified_at: 2026-10-29
integration: "MCP stdio via npx/uvx por servidor"
license: "NOASSERTION na API do GitHub (licenças por servidor — **verificar**)"
repo: https://github.com/modelcontextprotocol/servers
docs: "README do repositório e https://modelcontextprotocol.io"
stars: 91682
last_push: "2026-10-29"
last_release: "v2.2.0 (2026-10-28)"
open_issues: 32
adoption: "referência"
tags: [ai-agent-ecosystem, tool, mcp-server, reference]
updated: 2026-10-29
---
# MCP Reference Servers (modelcontextprotocol/servers)

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | MCP Reference Servers (modelcontextprotocol/servers) |
| Categoria | `mcp-server` |
| Status na pesquisa | `radar` (nota 77/100) |
| Adoção no ambiente | referência |
| Repositório oficial | https://github.com/modelcontextprotocol/servers |
| Documentação oficial | README do repositório e https://modelcontextprotocol.io |
| Estrelas / issues abertas | 91682 / 32 |
| Último push / release | 2026-10-29 / v2.2.0 (2026-10-28) |
| Licença | NOASSERTION na API do GitHub (licenças por servidor — **verificar**) |
| Verificado em | 2026-10-29 |

## Descrição
Coleção de servidores MCP de referência mantida pelo projeto MCP (ex.: filesystem, git, fetch, memory, time). Serve mais como **exemplo de implementação** do que como produto.

## Problema que resolve
Precisar de capacidades básicas (git, fetch, filesystem) com implementação canônica e simples.

## Casos de uso
- Servidor `git` read-only para histórico
- Referência de código para o [[Agent-Knowledge-MCP]]

## Funcionalidades principais
- Implementações mínimas e didáticas
- Lista de servidores da comunidade (README)

## Requisitos
- Node (npx) ou Python (uvx) conforme o servidor

## Compatibilidade
- Qualquer cliente MCP

## Limitações
- Servidores de referência não são endurecidos para produção (segundo o próprio projeto)
- Lista exata de servidores mantidos **não reconferida** nesta rodada

## Segurança
- filesystem/git dão acesso amplo: restringir diretórios
- Preferir os já usados (hermes-vault, o MCP do Harness) para o vault

## Licença
NOASSERTION na API do GitHub (licenças por servidor — **verificar**). Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Usar como referência; adotar só `git` se houver necessidade

## Integração com o Harness
Já aparece como *candidate* no catálogo do Harness. Sem mudança proposta além de documentar o `git` como opção read-only.

## Exemplo de configuração
Nenhum exemplo publicado aqui: **não verificado**. Consultar o README oficial no momento da adoção.

## Status
- Pesquisa: `radar` · nota 77 · verificado em 2026-10-29
- Ambiente do Pedro: referência
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[MCP-Catalog]] · [[MCP-Java-SDK]] · [[Repository-Catalog]]
