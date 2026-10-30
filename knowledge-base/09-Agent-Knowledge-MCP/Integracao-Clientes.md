---
title: "Integração com clientes (Claude Code, Claude Desktop)"
type: guide
status: active
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, integration]
---
# Integração com clientes

> Atualização verificada em 29/10/2026: agent-knowledge já está registrado nos dois clientes com AKM_CONFIG restrito. Configurações preservadas, sem duplicação. SDK stdio e health check do Claude Code passaram. A execução nativa das quatro tools recebeu HTTP 429 usage_limit_reached antes das chamadas; o chat do Desktop permanece não testado. Exemplos abaixo são referência de instalação, não comandos a repetir.

> **Alvo:** o Harness em `~/Downloads/Harness-Architecture` (raiz `harness`), consultado pelos clientes abaixo. O **Hermes Agent está fora do escopo do ecossistema do Pedro** (decisão do Pedro, 29/10/2026): não é cliente nem alvo de configuração.

## Pré-requisitos
`npm install && npm run build` na pasta do projeto. Entrada: `dist/src/index.js`. Node do nvm: `/Users/macbook/.nvm/versions/node/v22.23.2/bin/node` (caminho absoluto evita depender do PATH do app).

## Claude Code (escopo de usuário — exemplo)
```bash
claude mcp add agent-knowledge --scope user \
  -e 'AKM_VAULT_ROOTS=cofre=/Users/macbook/Downloads/Cofre do Pedro;harness=/Users/macbook/Downloads/Harness-Architecture' \
  -- /Users/macbook/.nvm/versions/node/v22.23.2/bin/node /Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js
```
Verificar com `claude mcp list` e `/mcp`.

## Claude Desktop
Arquivo `~/Library/Application Support/Claude/claude_desktop_config.json`, chave `mcpServers` — ver `examples/claude_desktop_config.json` (mesclar à mão, sem apagar entradas existentes).

## Hermes — fora do escopo
Removido em 29/10/2026. O exemplo `examples/hermes-config.yaml` foi apagado do projeto; não há configuração do Hermes a aplicar.

## Variáveis principais
`AKM_VAULT_ROOTS` (`nome=caminho;nome=caminho` — separador `;` porque há pastas com vírgula), `AKM_ROOT_INCLUDE` (JSON), `AKM_KB_ROOT`, `AKM_HARNESS_ROOT`, `AKM_DENY_PATTERNS`, limites `AKM_*`. Lista completa: `Agent-Knowledge-MCP/docs/INSTALLATION.md` (nenhum .env deve ser aberto).
