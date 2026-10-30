# Instalação

## Requisitos
- Node.js ≥ 20 (testado com 22.23.2 via nvm no Mac e 20 no ambiente de desenvolvimento).
- Nenhuma instalação global. Nenhuma credencial.

## Passos
```bash
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"   # se usar nvm
cd ~/Downloads/Agent-Knowledge-MCP
npm install
npm run build
npm test
```
Entrada do servidor: `dist/src/index.js`.

## Configuração
Variáveis de ambiente (passadas pelo cliente MCP) ou arquivo JSON em `AKM_CONFIG` (ver `config/config.example.json`). Precedência: padrões < JSON < variáveis.

| Variável | Padrão | Descrição |
|---|---|---|
| `AKM_VAULT_ROOTS` | — (obrigatória sem AKM_CONFIG) | `nome=caminho;nome=caminho` (caminhos absolutos) |
| `AKM_ROOT_INCLUDE` | raiz inteira | JSON `{"raiz":["subpasta","arquivo.md"]}` |
| `AKM_KB_ROOT` | primeira raiz | raiz que contém a KB |
| `AKM_KB_SUBDIR` | `AI-Agent-Ecosystem` | pasta da KB |
| `AKM_HARNESS_ROOT` | `harness` | raiz do Harness |
| `AKM_DEFAULT_RESULTS` / `AKM_MAX_RESULTS` | 5 / 20 | resultados de busca |
| `AKM_SNIPPET_CHARS` | 220 | tamanho do trecho |
| `AKM_MAX_DOC_CHARS` | 6000 | corte de documento |
| `AKM_MAX_FILE_BYTES` | 1000000 | arquivos maiores são ignorados |
| `AKM_RUNTIME_MANIFEST` | `runtime-output/environment-manifest.json` (na pasta do pacote) | manifest de ambiente lido por `get_environment_capabilities` e `list_agent_adapters`; gere com `npm run detect-env` |
| `AKM_INDEX_TTL_MS` | 2000 | intervalo mínimo entre verificações do índice |
| `AKM_DENY_PATTERNS` | — | regex extras separadas por `;` |
| `AKM_LOG_LEVEL` | `info` | `error`, `warn`, `info`, `debug` (stderr) |

## Testes nos vaults reais (só leitura)
```bash
npm run test:real
# caminhos padrão: ~/Downloads/Cofre do Pedro e ~/Downloads/Harness-Architecture
# sobrescreva com AKM_REAL_COFRE / AKM_REAL_HARNESS
```

## Diagnóstico
- Tool `knowledge_status` (com `reindex: true` para forçar reindexação).
- Erro de configuração: o processo sai com código 2 e a mensagem no stderr.
