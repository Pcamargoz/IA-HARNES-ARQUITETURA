#!/bin/sh
# Exemplo — NÃO executado automaticamente. Registra o Agent-Knowledge-MCP no Claude Code (escopo de usuário).
NODE=/Users/macbook/.nvm/versions/node/v22.23.2/bin/node
SERVER=/Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js
claude mcp add agent-knowledge --scope user \
  -e 'AKM_VAULT_ROOTS=cofre=/Users/macbook/Downloads/Cofre do Pedro;harness=/Users/macbook/Downloads/Harness-Architecture' \
  -e 'AKM_ROOT_INCLUDE={"cofre":["AI-Agent-Ecosystem","Skills para main agents"]}' \
  -- "$NODE" "$SERVER"
