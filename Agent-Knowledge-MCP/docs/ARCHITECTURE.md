# Arquitetura

## Visão geral
```
cliente MCP ──stdio──> src/index.ts
                        ├─ loadConfig()        padrões < AKM_CONFIG (JSON) < variáveis AKM_*
                        ├─ createContext()     { config, guard, index, log }
                        └─ createServer()      registra TOOLS em laço + resources
src/security/paths.ts   PathGuard: raízes reais (realpath), allowlist, bloqueios
src/security/redact.ts  mascara tokens em toda saída
src/search/indexer.ts   KnowledgeIndex: índice em memória, refresh incremental (mtime+size) com TTL
src/search/markdown.ts  frontmatter (yaml), headings fora de blocos de código, seções, wikilinks, URLs
src/search/query.ts     busca lexical ponderada + matchesFilter/filterDocs
src/tools/*.ts          1 arquivo por tool (ToolDefinition)
src/tools/kb-layout.ts  caminhos das notas fixas da KB e do Harness
src/tools/orchestration-helpers.ts  seleção por frontmatter (type/policy_area), pontuação por termos, parse de tabelas
scripts/simulate-orchestration.mjs  simulação determinística (cliente MCP real, sem LLM) → validation-output/
src/resources/index.ts  akm://kb/index, akm://kb/status
```

## Por que TypeScript (e não Python)
O SDK Python oficial do MCP exige **Python ≥ 3.10**; o Mac do Pedro tem Python 3.9.6 e não tem `uv`, e a regra é não instalar nada globalmente. Node 22.23.2 (nvm) e npm 10.9.8 já existem, e o SDK TypeScript é a implementação de referência. Java/Spring AI fica para o MCP de domínio (F5), onde a stack Java faz sentido.

## Decisões
- **Somente leitura:** nenhuma tool escreve; anotações `readOnlyHint=true`, `destructiveHint=false`, `idempotentHint=true`, `openWorldHint=false`.
- **Multi-raiz:** `AKM_VAULT_ROOTS="nome=caminho;..."` (`;` porque há pastas com vírgula no Cofre). IDs de documento: `raiz:caminho/relativo.md`.
- **Allowlist por raiz:** `AKM_ROOT_INCLUDE` (JSON). No Cofre, só a KB e as skills. O alvo de integração é o Harness (`~/Downloads/Harness-Architecture`); o Hermes Agent está fora do escopo do ecossistema do Pedro (29/10/2026).
- **Bloqueios (PathGuard):** raiz desconhecida, caminho absoluto, `..`, NUL, não-`.md`, segmentos ocultos (`.obsidian`, `.git`…), `node_modules`, nomes com chave/senha/password/secret/segredo/credencial/api key, fora da allowlist, symlink (lstat), realpath fora da raiz, arquivo acima de `AKM_MAX_FILE_BYTES`, padrões extras `AKM_DENY_PATTERNS`. A indexação aplica as mesmas regras.
- **Redação:** `sk-…`, `gh[pousr]_…`, `github_pat_…`, `xox…`, `AKIA…`, `AIza…`, `Bearer …`, `api_key/token/secret/senha/password/client_secret = valor`.
- **Economia de tokens:** 5 resultados por padrão (máx. 20), trecho de 220 caracteres, documentos cortados em 6000 caracteres, sumário por padrão nas tools de arquitetura/tokens/roadmap, limite rígido por resposta.
- **Erros:** argumentos inválidos → erro MCP `-32602` (validação zod do SDK); acesso negado/documento ausente → resultado `isError: true` em pt-BR; erro inesperado é logado e devolvido como `isError` — o processo continua.
- **Logs:** apenas stderr (stdout é o canal MCP).
- **Busca:** lexical (sem acentos, stopwords pt/en). Pesos: título ×4, tags ×3, heading ×3, caminho ×2, metadados ×2, corpo (até 5 ocorrências); bônus de frase +5; multiplicado pela cobertura². Um resultado por documento (melhor seção). Semântica: avaliada, não implementada (KB: `09-Agent-Knowledge-MCP/Busca-Semantica-Avaliacao.md`).

## Como estender
1. Crie `src/tools/minha_tool.ts`:
```ts
import { z } from "zod";
import { defineTool } from "./types.js";
import { filterDocs } from "../search/query.js";

export const minhaTool = defineTool({
  name: "get_orchestrator_policy",
  title: "Política do orquestrador",
  description: "…",
  inputSchema: { topic: z.string().optional() },
  async handler(ctx, args) {
    const docs = filterDocs(ctx.index, { type: "policy", pathPrefix: "AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/" });
    return docs.map((d) => `${d.title} — ${d.id}`).join("\n");
  },
});
```
2. Adicione a `TOOLS` em `src/tools/index.ts`.
3. Notas fixas: registre o caminho em `src/tools/kb-layout.ts`.
4. Teste em `tests/` com `connect()` (cliente MCP real).

## Tools de orquestração (v0.2.0)
Implementadas em `src/tools/` sem caminhos fixos: localizam notas em `10-Multi-Agent-Orchestration/` pelo frontmatter.

| Tool | Fonte (frontmatter) | Notas |
|---|---|---|
| `get_orchestrator_policy` | `type: policy\|procedure` + `policy_area` | sem `section`: só sumário das seções |
| `list_registered_agents` | `type: agent-spec` | só metadados; `score` = fração de termos da tarefa presentes |
| `get_agent_specification` | `type: agent-spec`, `name` | JSON estruturado ou texto + corpo/seção |
| `find_relevant_skills` | `SKILL.md` + `type: tool` em 02-Agent-Skills + `skills` dos agentes | lista skills citadas sem SKILL.md nas raízes lidas |
| `find_workflow_template` | `type: workflow-template` (`task_types`, `triggers`) | `task_type` exato vale +1; sem match → workflow padrão do Harness |
| `get_execution_policy` | `policy_area: execution` | seções Limites/Autonomia/Irreversiveis/Orcamentos/Parada |
| `get_metric_definitions` | `type: metric-catalog` (tabela com coluna `id`), `type: telemetry-schema` | colunas viram chaves sem acento (`formula_fonte`) |
| `get_architecture_decisions` | `type: adr` na KB + `Governance/decisions.md` do Harness | H2 `ADR-NNN — Título` fora de cercas; ids `kb:`/`harness:` porque a numeração se repete |

Pontuação sempre determinística (sem LLM, sem embeddings). Nenhuma tool executa agentes: só descrevem o que existe.
