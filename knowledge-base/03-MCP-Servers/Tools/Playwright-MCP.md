---
title: "Playwright MCP"
type: tool
category: mcp-server
status: radar
description: "Servidor MCP da Microsoft para automação de navegador com Playwright, baseado em snapshots de acessibilidade em vez de screenshots."
score: 74
verified_at: 2026-10-29
integration: "MCP stdio `npx -y @playwright/mcp@0.0.83 --isolated --headless`"
license: "Apache-2.0"
repo: https://github.com/microsoft/playwright-mcp
docs: "README do repositório"
stars: 38822
last_push: "2026-10-22"
last_release: "v0.0.83 (2026-09-28)"
open_issues: 0
adoption: "em uso (Harness-Architecture `.mcp.json`)"
tags: [ai-agent-ecosystem, tool, mcp-server, browser, testing]
updated: 2026-10-29
---
# Playwright MCP

> Nota de ferramenta da [[Indice-AI-Agent-Ecosystem|KB AI-Agent-Ecosystem]]. Métricas coletadas da API do GitHub em 29/10/2026 (19h59–20h15 BRT). Status `radar` = classificação da pesquisa, **não** significa instalado.

| Campo | Valor |
|---|---|
| Nome | Playwright MCP |
| Categoria | `mcp-server` |
| Status na pesquisa | `radar` (nota 74/100) |
| Adoção no ambiente | em uso (Harness-Architecture `.mcp.json`) |
| Repositório oficial | https://github.com/microsoft/playwright-mcp |
| Documentação oficial | README do repositório |
| Estrelas / issues abertas | 38822 / 0 |
| Último push / release | 2026-10-22 / v0.0.83 (2026-09-28) |
| Licença | Apache-2.0 |
| Verificado em | 2026-10-29 |

## Descrição
Servidor MCP da Microsoft para automação de navegador com Playwright, baseado em *snapshots* de acessibilidade em vez de screenshots.

## Problema que resolve
Agentes precisam navegar, testar UI e coletar evidências sem visão computacional cara.

## Casos de uso
- Verificação de UI do front (React) e evidência de QA
- Exploração de páginas para a skill [[Skills para main agents/frontend-testing-playwright/SKILL|frontend-testing-playwright]]

## Funcionalidades principais
- Snapshots de acessibilidade
- Modo isolado e headless
- Versão fixada no Harness (0.0.83)

## Requisitos
- Node/npx
- Navegadores do Playwright

## Compatibilidade
- Claude Code (já configurado no Harness)
- Claude Desktop: não verificado (Hermes fora do escopo do ecossistema do Pedro)

## Limitações
- Snapshots de páginas grandes custam muitos tokens
- Versão 0.x

## Segurança
- `--isolated` evita reaproveitar perfil logado
- Não navegar em páginas com credenciais

## Licença
Apache-2.0. Não é parecer jurídico; revisar antes de redistribuir ou embarcar em produto.

## Recomendações
- Manter a versão fixada; atualizar por ADR

## Integração com o Harness
Já ativo (project scope) no `.mcp.json` do Harness-Architecture (ADR-010). Nenhuma mudança proposta.

## Exemplo de configuração
✅ Verificado por leitura do arquivo de configuração existente (não alterado).

```json
// trecho existente no .mcp.json do Harness-Architecture (verificado por leitura)
"playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@0.0.83", "--isolated", "--headless"] }
```

## Status
- Pesquisa: `radar` · nota 74 · verificado em 2026-10-29
- Ambiente do Pedro: em uso (Harness-Architecture `.mcp.json`)
- Próxima revisão: na próxima rodada de [[Research-History]] ou antes de qualquer adoção (via ADR).

## Relacionados
[[MCP-Catalog]] · [[Repository-Catalog]]
