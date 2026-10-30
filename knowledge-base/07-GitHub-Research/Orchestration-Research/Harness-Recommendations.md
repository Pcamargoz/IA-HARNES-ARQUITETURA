---
title: "Recomendações para o Harness: Main Orchestrator"
type: research-recommendation
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
tipo: recomendacoes
verificado_em: 2026-10-29
alvo: ~/Downloads/Harness-Architecture (cofre de referência; não editado por esta tarefa)
stack: [Java/Spring Boot, Docker, Claude Code, Claude Desktop, Obsidian, Mac Intel]
tags: [harness, main-orchestrator, governanca, tokens, memoria, mcp]
---

# Recomendações para o Harness

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Base: [[Pattern-Catalog]] · [[Architecture-Comparison]]
> Princípio: **não copiar repositórios**. Montar uma arquitetura modular própria, reaproveitando *ideias* (que não têm copyright) e, só quando necessário, *trechos* de licença permissiva com atribuição.
> Legenda: **ADOTAR** = usar como está, em forma própria · **ADAPTAR** = usar com mudanças · **EVITAR** = não usar.

## Visão da arquitetura-alvo (modular)
```
Main Orchestrator (prompt curto, ≤150 linhas)
 ├─ Agent Registry (agents/*.md, fonte única + validador)
 ├─ Skills (SKILL.md, divulgação progressiva via MCP de conhecimento, somente leitura)
 ├─ Delegation Contract (spawn ≤6, profundidade ≤2, posse de arquivos)
 ├─ Pipeline: plan → spec → exec → verify → fix (loop limitado) → done|failed|cancelled
 ├─ State/Memory: Obsidian (longo prazo) + .harness/state, handoffs (curto prazo)
 ├─ Policy/HITL: hooks PreToolUse + lista de ações irreversíveis
 └─ Telemetria: tokens/custo/turnos por tarefa (OTel GenAI ou trace local)
```

## Recomendações (priorizadas)

### R1. Prompt do orquestrador como mapa curto (≤150 linhas) · ADOTAR
- **O quê:** `AGENTS.md` como fonte, `CLAUDE.md` como symlink e blocos fixos (princípios, delegação, catálogo de papéis só com nome e gatilho, roteamento, verificação, guardas, cancelamento, ponteiros). Ver a estrutura na seção 3 do [[Pattern-Catalog]].
- **Fonte:** [[wshobson-agents-orquestracao|wshobson-agents]] (`AGENTS.md`, `ARCHITECTURE.md`, MIT) e [[oh-my-claudecode]] (blocos XML do `CLAUDE.md`, MIT).
- **Impacto esperado:** menos tokens fixos por sessão e menos instruções conflitantes. Não medi, mas pode ser medido com R9.
- **Risco:** detalhes importantes ficarem "fora do mapa". **Rollback:** reverter o commit do `AGENTS.md`, que fica versionado.
- **Atribuição:** só ideia; nenhum trecho copiado. Se algum trecho for copiado, incluir o aviso MIT do autor.

### R2. Agent Registry com spec única e validador · ADAPTAR
- **O quê:** `agents/<nome>.md` com frontmatter:
  ```yaml
  name: spring-boot-implementer
  description: "Use when: implementar feature Spring Boot com testes. Não use para: revisão."
  tools: [Read, Grep, Glob, Edit, Write, Bash]   # allowlist
  disallowedTools: []                            # verificador: [Write, Edit]
  model: tier-standard        # alias de tier, nunca ID datado
  level: 2                    # 1=leitura, 2=escreve, 3=verifica
  owner: pedro
  version: 1.0.0
  budget: {max_turns: 30, max_retries: 2, timeout_min: 20}
  ```
  Um script valida os campos obrigatórios, nomes únicos, tools válidas, ausência de model ID fixo e o tamanho do corpo (≤8 KB).
- **Fonte:** wshobson (frontmatter + `make validate`), OMC (`level`, `disallowedTools`), CrewAI (`max_iter`, `max_retry_limit` na spec, MIT), VoltAgent (matriz de ferramentas por papel, MIT).
- **Impacto:** agentes previsíveis e auditáveis, com mínimo privilégio.
- **Risco:** campos `owner`, `version` e `budget` não são nativos do Claude Code, que os ignora. Quem os aplica é o orquestrador ou um hook. **Rollback:** os campos extras são inertes; basta removê-los.
- **Evitar:** `model: claude-sonnet-4-20250514` ([[0xfurai-subagents]]) e `tools` ausente, que herda tudo.

### R3. Contrato de delegação · ADOTAR
- **Regras:**
  - Até **6** filhos concorrentes.
  - Profundidade de no máximo **2**: o filho não cria netos sem permissão.
  - `allow_delegation=false` por padrão.
  - Cada filho recebe objetivo, critérios de aceite, arquivos que possui, orçamento e formato de retorno.
  - **Um escritor por arquivo**, com worktree por escritor em trabalho paralelo.
  - Arquivos compartilhados (pom.xml, application.yml, lockfiles) ficam só com o orquestrador.
- **Fonte:** OMC (`AGENTS.md`, até 6 filhos), wshobson (`file-ownership.md`), ruflo (*"Never allow two writers in one worktree"*, MIT), CrewAI (padrão `allow_delegation=False`), Awesome-llms-labs (profundidade).
- **Impacto:** elimina conflitos de edição e explosão de agentes.
- **Risco:** menos paralelismo em tarefas acopladas. **Rollback:** subir o teto via config.

### R4. Pipeline com loop limitado e estados terminais · ADOTAR
- **O quê:** `plan → spec → exec → verify → fix` com `max_fix_attempts=3`. Ao exceder, o estado vira `failed`, com um relatório. Os estados terminais são `complete`, `failed` e `cancelled`, e a retomada parte do último estágio incompleto.
- **Fonte:** OMC `<team_pipeline>`; wshobson `conductor` para os artefatos `spec.md` e `plan.md` por track. Encaixa no fluxo spec-driven do Harness-Architecture.
- **Impacto:** fim dos loops infinitos e recuperação após compactação ou queda.
- **Risco:** um limite baixo demais aborta tarefas legítimas. **Rollback:** ajustar o limite por tipo de tarefa.

### R5. Verificador independente, sem auto-aprovação · ADOTAR
- **O quê:** um agente `verifier` com `disallowedTools: [Write, Edit]`, em contexto separado do implementador. Cada critério recebe VERIFIED, PARTIAL ou MISSING com evidência fresca (saída de `mvn test` ou `docker compose up`). TODOs, `@Disabled` e stubs contam como bloqueio. O dimensionamento é leve para menos de 5 arquivos e completo para mais de 20 arquivos ou mudanças de segurança.
- **Fonte:** OMC `agents/verifier.md` e `<failure_mode_guards>` (MIT); kodo e zeroshot (via [[andyrewlee-awesome-agent-orchestrators]], não auditados).
- **Impacto:** menos "concluído" falso.
- **Risco:** mais custo por tarefa, mitigado pelo dimensionamento. **Rollback:** desligar por flag em tarefas triviais.

### R6. Roteamento de modelo por tier, com o determinístico primeiro · ADAPTAR
- **O quê:**
  - Tier 0: sem LLM (formatter, OpenRewrite, scripts `mvn`, grep).
  - Tier 1: Haiku (busca, resumo, triagem).
  - Tier 2: Sonnet (implementação e testes).
  - Tier 3: Opus (arquitetura, segurança, revisão crítica).
  - Aliases de tier no registro (R2) e mapeamento num único arquivo de config.
- **Fonte:** ruflo (ADR-026, 3 tiers com codemod a "$0"), wshobson e OMC (tiers), CrewAI (`function_calling_llm` mais barato).
- **Impacto:** custo menor em tarefas mecânicas. Os números do ruflo (-30 a -50%) **não foram verificados**; medir com R9.
- **Risco:** um tier baixo erra em tarefas sutis. **Rollback:** subir o tier padrão do papel.
- **Nota:** o alias `fable` (wshobson, OMC) pode não existir no plano do Pedro. **Não verificado.**

### R7. Orçamento de tokens e contexto · ADOTAR
- **O quê:**
  - Metadados de skill com até cerca de 100 palavras sempre carregados; corpo de até 500 linhas ou 8 KB carregado só ao usar; referências sob demanda.
  - Orçamento por tarefa: `max_turns`, `timeout`, e `--max-budget-usd` quando disponível no CLI. **Confirmar a flag** na versão instalada do Claude Code.
  - Filhos recebem um resumo, não o histórico inteiro.
  - Para revisão e segurança, falhar em vez de resumir (`respect_context_window=false`).
- **Fonte:** anthropics/skills (`skill-creator`, Apache-2.0), wshobson (limites), CrewAI (docs), ruflo (`--max-budget-usd`).
- **Impacto:** custo previsível. **Risco:** contexto insuficiente. **Rollback:** aumentar o orçamento por papel.

### R8. Memória em duas camadas · ADAPTAR
- **O quê:**
  - **Longo prazo:** o cofre Obsidian, servido pelo MCP de conhecimento em modo **somente leitura**. Adicionar ferramentas de "listar metadados" e "ler nota" para divulgação progressiva, na linha do basic-memory citado pelo [[yigtwxx-awesome-claude-multi-agent]].
  - **Curto prazo:** `.harness/` no repositório de trabalho, com `state.json` (estágio, tentativas), `plans/`, `handoffs/<tarefa>.md` e `notepad.md`. A escrita no cofre fica só com o orquestrador, com aprovação humana.
  - Após compactação ou retomada, revalidar com `git status` antes de agir.
- **Fonte:** OMC `.omc/` (MIT), LangGraph (conceito de checkpoint por `thread_id`, MIT), wshobson `conductor` (`track-metadata.json`).
- **Impacto:** continuidade entre sessões e entre Claude Code e Claude Desktop.
- **Risco:** estado obsoleto, mitigado pela revalidação; e escrita concorrente no cofre, mitigada por um único escritor. **Rollback:** apagar `.harness/` do repositório de trabalho; o cofre fica intocado.

### R9. Métricas e observabilidade · ADAPTAR
- **O quê:** registrar por tarefa e por agente: tokens de entrada e saída, custo, turnos, duração, tentativas de correção, veredito do verificador e intervenções humanas. Começar com um JSONL local (hook `SubagentStop`/`PostToolUse`) e migrar para as convenções **OpenTelemetry GenAI** com Langfuse ou Phoenix (self-host em Docker).
- **Fonte:** OMC (`trace_summary`), CrewAI (`usage_metrics`), wshobson (recibos), Yigtwxx (OTel GenAI, Langfuse, Phoenix), aGiTrack (custo por commit).
- **Impacto:** decisões de roteamento e orçamento baseadas em dados.
- **Risco:** overhead e vazamento de conteúdo sensível nos traces, mitigado por não registrar prompts completos por padrão. **Rollback:** desligar o hook.

### R10. Governança, HITL e segurança · ADOTAR
- **O quê:**
  - Lista explícita de ações irreversíveis: `git push`, deploy, `docker system prune`, deleção, gasto, escrita no cofre, envio externo.
  - Um hook `PreToolUse` bloqueia essas ações sem aprovação, com exit 2 (como no wshobson). Para um orquestrador headless, usar o conceito de `interrupt()` com schema de resposta e idempotência dos efeitos anteriores (LangGraph).
  - Agentes não ampliam as próprias ferramentas, gastos ou permissões (ruflo).
  - Kill switch por variável de ambiente (OMC `DISABLE_OMC`).
  - MCP só de servidores confiáveis (AutoGen).
- **Fonte:** wshobson `review-agent-governance` (MIT), LangGraph docs, ruflo, OMC, AutoGen README.
- **Impacto:** segurança operacional. **Risco:** atrito com prompts de aprovação. **Rollback:** relaxar a lista por projeto.
- **Atenção:** os recibos do wshobson não formam cadeia (*"a deleted line goes undetected"*). Se a auditoria importar, usar hash encadeado.

## EVITAR (com motivo)
| Item | Motivo | Fonte |
|---|---|---|
| "Communication Protocol" JSON para `context-manager` | Não existe barramento de mensagens; gasta tokens com cerimônia | [[voltagent-subagents]] (130 agentes) |
| Swarm disparado automaticamente com 3 ou mais arquivos | Explosão de agentes e de custo | [[ruflo]] |
| `CLAUDE.md` gigante (1.560 linhas) | Inchaço de contexto | ruflo |
| Model IDs fixos e datados | Envelhecem e quebram | [[0xfurai-subagents]] |
| Números de desempenho sem método | Não verificáveis | ruflo |
| AutoGen, `langgraph-supervisor` e `langgraph-swarm` em projetos novos | Descontinuado ou em manutenção | [[autogen]], [[langgraph]] |
| Instalar coleções inteiras (100 a 200 agentes) | Metadados inflados e gatilhos ambíguos | wshobson, VoltAgent |
| Copiar skills docx, pdf, pptx ou xlsx e o doc-coauthoring | Proprietárias ou sem licença | [[anthropics-skills]] |
| Copiar o texto de listas sem licença | Copyright reservado | [[bradagi-awesome-cli-coding-agents]] |

## Integração com o ecossistema do Pedro
- **Claude Code:** registro em `.claude/agents/` (gerado), skills em `.claude/skills/` e hooks para R5, R9 e R10.
- **Claude Desktop:** só skills e MCP (sem subagentes nem hooks). O orquestrador degrada para "um agente com skills".
- **Hermes Agent:** fora do escopo do ecossistema do Pedro (29/10/2026); nenhum adaptador proposto.
- **Java/Spring Boot:** papéis `spring-boot-implementer`, `java-architect` e `test-engineer`, com especialistas derivados do VoltAgent ou wshobson `java-pro` reescritos (MIT, com atribuição se houver trecho copiado). Ponte futura: swarm-ai (Spring AI) ou a2a4j, **não verificados**.
- **Docker:** o tier 0 de verificação roda `docker compose` e testes. A observabilidade opcional é Langfuse ou Phoenix em container.
- **Mac Intel:** evitar ferramentas com binários nativos só para ARM. A compatibilidade do ruflo **não foi verificada**.

## Atribuição exigida, se houver reuso de trechos
- **MIT** (wshobson, OMC, VoltAgent, ruflo, CrewAI, LangGraph, 0xfurai, Awesome-llms-labs, código do AutoGen): manter o aviso de copyright e o texto da licença junto ao trecho.
- **Apache-2.0** (skills anthropics, exceto as proprietárias): incluir a licença, marcar os arquivos modificados e preservar o NOTICE, se houver.
- **CC-BY-4.0** (docs do AutoGen): crédito, link da licença e indicação de mudanças.
- **CC0** (Yigtwxx, andyrewlee): livre, mas recomenda-se citar a fonte.
- **Nenhuma licença ou licença ambígua** (bradAGI, vivy-yi, anthropics `doc-coauthoring`): usar só fatos e links.

## Próximos experimentos sugeridos (baixo risco)
1. Reescrever o prompt do orquestrador seguindo R1 e medir os tokens fixos antes e depois (R9).
2. Criar 4 agentes no registro (planner, spring-boot-implementer, verifier, researcher) com o validador da R2 e rodar uma feature Spring Boot pelo pipeline da R4.
3. Adicionar ao MCP de conhecimento uma ferramenta de listagem só de metadados (R8) e comparar o consumo de contexto.
