# IA-HARNES-ARQUITETURA

Repositório que junta o trabalho do ecossistema de agentes de IA do Pedro Camargo.

## Pastas

- **`knowledge-base/`**: base de conhecimento em Obsidian (cópia de `Cofre do Pedro/AI-Agent-Ecosystem/`). Tem o Dashboard com os prompts de configuração inicial e de montagem do time de agentes, além da pesquisa de orquestração, do runtime universal multi-CLI, do catálogo de modelos, das ADRs e do CHANGELOG.
- **`Agent-Knowledge-MCP/`**: servidor MCP em TypeScript (stdio, somente leitura) que indexa a base de conhecimento e o Harness. Para rodar: `npm install`, `npm run build`, e depois copie `.env.example` para `.env` e ajuste os caminhos.
- **`Harness-Architecture/`**: o Harness de referência, com governança, processos, agentes, segurança, métricas, automação, o MCP `hermes-vault` em `.mcp/` e o `video-engine`. É uma cópia dos arquivos da branch `integration/agent-knowledge`, sem o histórico git original.

## O que fica de fora

`.env`, `node_modules/`, `dist/`, saídas geradas (`runtime-output/`, `validation-output/`, `video-engine/out/`), perfis de navegador, logs, chaves e o estado local do Obsidian e do Maestri.
