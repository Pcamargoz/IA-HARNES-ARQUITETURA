# Agent-Knowledge-MCP

Servidor MCP **somente leitura** (TypeScript, SDK oficial `@modelcontextprotocol/sdk` 1.32.2, transporte stdio) que entrega a agentes de IA o conhecimento da base `AI-Agent-Ecosystem` do Cofre do Pedro, das skills do Cofre e do vault `Harness-Architecture` — em pedaços pequenos, com a fonte citada.

- Nunca escreve, move ou apaga arquivos.
- Várias raízes (vaults) com lista de pastas autorizadas.
- Bloqueia symlinks, `..`, pastas ocultas, não-Markdown e arquivos com nome de credencial; mascara tokens nas saídas.
- Busca lexical com filtros de frontmatter (`type`, `status`, `category`, `tag`).

## Início rápido
```bash
cd ~/Downloads/Agent-Knowledge-MCP
npm install          # dependências locais (node_modules)
npm test             # compila e roda os testes com fixtures
AKM_VAULT_ROOTS='cofre=/Users/macbook/Downloads/Cofre do Pedro;harness=/Users/macbook/Downloads/Harness-Architecture' \
AKM_ROOT_INCLUDE='{"cofre":["AI-Agent-Ecosystem","Skills para main agents"]}' \
node dist/src/index.js   # fala MCP por stdio (use a partir de um cliente)
```

## Tools
| Tool | Para quê |
|---|---|
| `search_knowledge` | buscar na KB/skills/Harness com filtros |
| `get_document` | ler documento por seção, linhas ou só o sumário |
| `list_agent_skills` | listar skills (SKILL.md) e pacotes de skills |
| `find_mcp_servers` | encontrar MCPs avaliados |
| `get_architecture` | arquitetura do ecossistema, do Harness (atual, proposta, fonte) ou deste MCP |
| `recommend_integration` | recomendar ferramentas para uma necessidade |
| `get_research_history` | histórico de pesquisas |
| `get_token_optimization` | orientação de economia de tokens |
| `get_implementation_roadmap` | fases de implementação |
| `knowledge_status` | diagnóstico do índice e da configuração |

**Orquestração (v0.2.0)** — lidas de `AI-Agent-Ecosystem/10-Multi-Agent-Orchestration` (por frontmatter) e de `Governance/decisions.md` do Harness:

| Tool | Para quê |
|---|---|
| `get_orchestrator_policy` | políticas do Main Orchestrator por `policy_area` e seção |
| `list_registered_agents` | registro de agentes (implemented / planned / conceptual), filtros e ordenação por tarefa |
| `get_agent_specification` | spec de um agente: ferramentas, skills, orçamento, autonomia, evidência |
| `find_relevant_skills` | skills (SKILL.md + pacotes da KB) para uma tarefa; skills citadas e não encontradas |
| `find_workflow_template` | template de workflow por tipo de tarefa e gatilhos |
| `get_execution_policy` | limites, autonomia, irreversíveis, orçamentos, parada (+ aplicação a um agente) |
| `get_metric_definitions` | catálogo de métricas estruturado + schema de telemetria |
| `get_architecture_decisions` | ADRs da KB (`kb:ADR-NNN`) e do Harness (`harness:ADR-NNN`) |

**Universal Agent Runtime (v0.3.0)** — lidas de `AI-Agent-Ecosystem/11-Universal-Agent-Runtime` e do manifest de ambiente gerado por `npm run detect-env`:

| Tool | Para quê |
|---|---|
| `get_runtime_architecture` | componentes do runtime (Port, manifest, router, políticas, métricas…) por `component` e `section` |
| `list_agent_adapters` | adapters (código + KB) cruzados com o ambiente detectado: instalado, versão, login; filtros por capacidade |
| `get_model_routing_policy` | fatores, tiers por complexidade, escalonamento e `compare` (custo esperado por sucesso, com retries e retrabalho); catálogo de modelos: `task` (matriz tarefa → primário/fallback/barato-local + fichas + regras de dados/cota) e `view` catalog/matrix/rules/all, lidos de notas `model-catalog`/`model-card` |
| `get_environment_capabilities` | CLIs, login (comandos oficiais), nomes de MCP, Maestri, paralelismo e as 7 capacidades com evidência |

O núcleo do runtime fica em `src/runtime/` (sem dependência do servidor): contrato `AgentPort` (`port.ts`), JSON Schemas (`schemas.ts`), detecção (`detect.ts`) e adapters. Implementados e testados: `shell-echo` (processo real, sem LLM) e `noop` (test-double, devolve `not_executed`). Os adapters de CLI (Claude Code, Codex, OpenCode, Gemini CLI, Qwen Code, cursor-agent, Ollama) são **spec-only**: argv e parser escritos a partir da doc oficial, nunca executados aqui porque consomem a conta do Pedro.

Escopo: o alvo é o Harness em `~/Downloads/Harness-Architecture`. Hermes Agent e Docker estão fora do escopo (não são detectados nem configurados).

Todas aceitam `format: "json"` quando o consumidor é um script (exceto `get_orchestrator_policy` e `get_execution_policy`, que devolvem texto).

Recursos: `akm://kb/index`, `akm://kb/status`.

## Scripts
| Script | O que faz |
|---|---|
| `npm run build` | compila para `dist/` |
| `npm test` | testes com fixtures (cliente MCP real via stdio) |
| `npm run test:real` | testes de leitura nos vaults reais (só leitura) |
| `npm run smoke` | cliente de demonstração |
| `npm run detect-env` | detecta o ambiente (CLIs, versões, login por comando oficial, nomes de MCP, Maestri, paralelismo) e grava `runtime-output/environment-manifest.json` sem segredos |
| `npm run experiment` | experimento de delegação entre 2 agentes: por padrão só **planeja** (nada executa); `-- --approve --agents a,b` roda de verdade, com aprovação |
| `npm run simulate` | simulação determinística da validação E2E em 9 passos (sem LLM); grava handoff e telemetria JSONL em `validation-output/` (fora do cofre, ignorado pelo Git) |

## Documentação
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura, decisões, como estender
- [docs/INSTALLATION.md](docs/INSTALLATION.md) — instalação e configuração
- [docs/CLIENT-INTEGRATION.md](docs/CLIENT-INTEGRATION.md) — Claude Code e Claude Desktop (alvo: Harness; Hermes fora do escopo)
- `examples/` — configurações de exemplo (não aplicadas)
