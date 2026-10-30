---
title: "Context7"
type: tool
category: mcp-server
status: top10
description: "Servidor MCP da Upstash que entrega documentação atualizada e por versão de bibliotecas, em trechos focados, para o agente não depender de conhecimento desatualizado do modelo."
score: 86
verified_at: 2026-10-29
integration: "MCP HTTP remoto (https://mcp.context7.com/mcp) ou CLI `npx ctx7 setup`"
license: "MIT"
repo: https://github.com/upstash/context7
docs: "https://context7.com (servidor remoto: https://mcp.context7.com/mcp)"
stars: 63918
last_push: "2026-10-29"
last_release: "@upstash/context7-sdk@0.6.0 (2026-10-23)"
open_issues: 53
adoption: "em uso (user scope no Claude Code segundo o catálogo do Harness)"
tags: [ai-agent-ecosystem, tool, mcp-server, docs, token-optimization, remote]
updated: 2026-10-29
---
# Context7

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `top10` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Context7 |
| Categoria | `mcp-server` |
| Status na pesquisa | `top10` (nota 86/100) |
| Adoção no ambiente | em uso (user scope no Claude Code segundo o catálogo do Harness) |
| Repositório oficial | https://github.com/upstash/context7 |
| Documentação oficial | https://context7.com (servidor remoto: https://mcp.context7.com/mcp) |
| Estrelas / issues abertas | 63918 / 53 |
| Último push / release | 2026-10-29 / @upstash/context7-sdk@0.6.0 (2026-10-23) |
| Licença | MIT |
| Verificado em | 2026-10-29 |

## Descrição
Servidor MCP da Upstash que entrega documentação **atualizada e por versão** de bibliotecas, em trechos focados, para o agente não depender de conhecimento desatualizado do modelo.

## Problema que resolve
Alucinação de APIs (ex.: Spring Boot 4.x / Spring Cloud 2025.1, React 19) e gasto de tokens colando documentação inteira no contexto.

## Casos de uso
- Consultar a API correta de Spring Boot 4.1.1 / Spring Cloud 2025.1.3 antes de codar
- Docs de React 19 / Vite / Playwright no front
- Política *docs-first* da skill [[Skills para main agents/context7-docs-first/SKILL|context7-docs-first]]

## Funcionalidades principais
- Resolve o nome da biblioteca para um ID e busca trechos de docs por tópico
- Servidor remoto HTTP (não roda nada localmente)
- SDK TypeScript e CLI de setup

## Requisitos
- Rede/Internet
- Chave de API opcional para limites maiores (variável de ambiente — **nunca** em nota)

## Compatibilidade
- Claude Code (`--transport http`)
- Claude Desktop
- Hermes — fora do escopo do ecossistema do Pedro (o registro antigo de conexão não vale mais)
- Harness-Architecture: listado como ativo (user scope) em `Optimization/mcp-catalog.md`

## Limitações
- Depende de serviço externo (disponibilidade e limites de uso)
- Cobertura de bibliotecas de nicho varia
- Economia de 30–50% em tokens de documentação é **estimativa**

## Segurança
- Consultas saem da máquina: não enviar código proprietário nas perguntas
- Chave via env/secret store do cliente, nunca em arquivo versionado

## Licença
MIT. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Manter como padrão de documentação (já em uso)
- Medir no E1 junto com a Serena para separar o efeito de cada um

## Integração com o Harness
Já faz parte do Harness (catálogo de MCPs, escopo de usuário). Na proposta, vira regra explícita do fluxo *Specify/Plan*: “consultar Context7 antes de escrever código contra API externa”.

## Exemplo de configuração
⚠️ **Não verificado neste ambiente** — extraído da documentação/README na pesquisa de 29/10/2026; nada foi instalado ou executado no Mac.

```bash
# Claude Code (do README/docs; chave opcional via variável de ambiente)
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "Authorization: Bearer $CONTEXT7_API_KEY"
```

## Status
- Pesquisa: `top10` · nota 86 · verificado em 2026-10-29
- Ambiente do Pedro: em uso (user scope no Claude Code segundo o catálogo do Harness)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[Serena]] · [[E1-Serena-Context7-ControlFree]] · [[MCP-Catalog]] · [[Repository-Catalog]]
