---
title: "Diffs propostos de integração — 2026-10-29"
type: proposal
status: proposed
updated: 2026-10-29
tags: [mcp, integration, approval]
---
# Diffs exatos propostos — aguardando aprovação

> **Atualização 29/10/2026:** Hermes Agent fora do escopo do ecossistema do Pedro; só restam os diffs de Claude Code e Claude Desktop. Alvo: Harness (`~/Downloads/Harness-Architecture`).

Leitura dos quatro arquivos autorizada pelo Pedro em “pode fazer”, após pergunta específica de leitura. Nenhuma edição de cliente foi realizada. Diffs calculados sobre os arquivos reais, somente com adições. Arquivos completos e credenciais não foram copiados ou registrados. SHA-256 permite detectar mudanças antes de aplicar.

Validação em memória: JSON/YAML válidos; configurações anteriores semanticamente idênticas após remover somente as adições propostas. Nenhum servidor existente alterado. Não executado teste de cliente nesta etapa.

## Claude Code

Base SHA-256: `91fc5d3876b7793e7e85352f333c7a4cd0db7949e50467efad001faccb8a79dd`.

```diff
--- /Users/macbook/.claude.json
+++ /Users/macbook/.claude.json
@@ -3762,0 +3763,9 @@
+    "agent-knowledge": {
+      "command": "/Users/macbook/.nvm/versions/node/v22.23.2/bin/node",
+      "args": [
+        "/Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js"
+      ],
+      "env": {
+        "AKM_CONFIG": "/Users/macbook/Downloads/Cofre do Pedro/AI-Agent-Ecosystem/08-Implementation/Validation-Results/Integracao-Clientes-2026-10-29.akm.json"
+      }
+    },
```

## Claude Desktop

Base SHA-256: `1a6e03e19f2758ed71ec1597ac4219c7e2f6d4f828dcb801da2fb5a877ea577f`.

```diff
--- /Users/macbook/Library/Application Support/Claude/claude_desktop_config.json
+++ /Users/macbook/Library/Application Support/Claude/claude_desktop_config.json
@@ -1,0 +2,11 @@
+  "mcpServers": {
+    "agent-knowledge": {
+      "command": "/Users/macbook/.nvm/versions/node/v22.23.2/bin/node",
+      "args": [
+        "/Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js"
+      ],
+      "env": {
+        "AKM_CONFIG": "/Users/macbook/Downloads/Cofre do Pedro/AI-Agent-Ecosystem/08-Implementation/Validation-Results/Integracao-Clientes-2026-10-29.akm.json"
+      }
+    }
+  },
```

## Hermes — removido

> Removido em 29/10/2026 a pedido do Pedro: o Hermes Agent está fora do escopo do ecossistema do Pedro. Os dois diffs do Hermes (config MCP e volumes do Compose) foram retirados desta nota e **não devem ser aplicados**. O alvo da integração é o Harness em `~/Downloads/Harness-Architecture`.

## Aplicação prevista

Claude Code: executar o comando adaptado de examples/claude-code-add.sh com -e AKM_CONFIG apontando para o JSON restrito. O diff acima representa a adição pretendida em mcpServers; o CLI pode modificar metadados próprios. Sem backups manuais. Se o CLI exigir criar backup, respeitar a restrição do Pedro e interromper essa via para apresentar alternativa.

Claude Desktop: inserir somente mcpServers.agent-knowledge, preservando preferências e outras chaves. Reinício e teste no aplicativo são etapas posteriores à aprovação.


## Aprovação solicitada

Aprovar primeiro os dois diffs Claude Code e Desktop permite concluir suas integrações e executar as cinco chamadas em cada cliente. Builder e demais pendências conhecidas permanecem intocados.
