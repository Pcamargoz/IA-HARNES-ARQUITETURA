---
title: "Catálogo de Padrões de Orquestração Multiagente"
type: research-synthesis
status: researched
category: orchestration
updated: 2026-10-29
origem: "pesquisa de orquestração feita na box do Grok Bot (29/10/2026), importada sem alterar o conteúdo; só frontmatter e links ajustados"
tipo: sintese
verificado_em: 2026-10-29
fontes: 14 repositórios (ver repos/)
tags: [orquestracao, padroes, anti-padroes, harness]
---

# Catálogo de Padrões de Orquestração

> Importado em 29/10/2026 para [[MOC-Orchestration-Research]]. Conteúdo original preservado; ajustes: frontmatter `type/status/category` e links com nome em conflito.

> Relacionados: [[Architecture-Comparison]] · [[Harness-Recommendations]]
> As citações são curtas e atribuídas, e as licenças estão em cada ficha. Os padrões foram **comparados**, não copiados.

## 1. Padrões de coordenação

| Padrão | Como funciona | Quem implementa (fonte) | Quando usar | Risco principal |
|---|---|---|---|---|
| **Supervisor/worker** | Um orquestrador decompõe a tarefa, delega e agrega os resultados | [[oh-my-claudecode]] (`<delegation_rules>`), [[wshobson-agents-orquestracao\|wshobson-agents]] (`team-lead`), [[crewai]] (processo `hierarchical` + `manager_llm`), [[autogen]] (`AgentTool`) | Padrão para o Main Orchestrator | Gargalo de contexto e ponto único de falha; profundidade acima de 2 ou 3 níveis degrada ([[awesome-llms-labs-orchestration]]) |
| **Planner/executor** | Plano versionado separado da execução | OMC `team-plan → team-prd → team-exec`; wshobson `conductor` (`spec.md`, `plan.md` por track) | Features com mais de um arquivo | Plano velho divergindo do código; exige revalidação |
| **Researcher/implementer/reviewer(+verifier)** | Papéis com ferramentas distintas e revisor sem permissão de escrita | OMC `agents/verifier.md` (`disallowedTools: Write, Edit`); VoltAgent ("Tool Assignment by Role Type"); ruflo (`researcher/coder/reviewer/tester`) | Qualquer mudança com risco | Custo de 3 contextos; é preciso dimensionar o verificador pelo tamanho da mudança (OMC: <5 arquivos leve, >20 arquivos completo) |
| **Handoff** | Um agente passa controle e artefato a outro | OMC `.omc/handoffs/`; LangGraph (`langgraph-swarm`, hoje em manutenção); Conductor (tracks) | Troca de fase ou de especialidade | Perda de contexto e desalinhamento (MAST, citado por [[awesome-llms-labs-orchestration]]) |
| **Grafo de estado** | Nós e arestas condicionais, com estado persistido em checkpoint | [[langgraph]] (runtime, checkpointers sqlite/postgres) | Fluxos longos, retomáveis e auditáveis | Complexidade e runtime Python à parte |
| **Event-driven/actor** | Agentes reagem a mensagens e eventos | [[autogen]] Core API (descontinuado); hooks do Claude Code (`SubagentStop`, `TaskCompleted`, citados por [[yigtwxx-awesome-claude-multi-agent]]) | Gatilhos (CI, arquivo, agenda) | Fluxo implícito e difícil de depurar |
| **Human-in-the-loop** | Pausa durável e aprovação tipada | LangGraph `interrupt()` + `Command(resume=…)` + `response_schema`; wshobson `review-agent-governance` (hook PreToolUse com Cedar, exit 2) | Ações irreversíveis (deploy, push, deleção, gasto) | Efeito colateral repetido na retomada; exige idempotência (doc LangGraph) |
| **Swarm/mesh** | Vários agentes pares, com consenso ou fila compartilhada | [[ruflo]] (queen/hive-mind, mesh, raft) | Raramente; pesquisa ampla em paralelo | Explosão de agentes e drift; o ruflo recomenda `hierarchical` com `maxAgents` 6 a 8 |
| **Evaluator-optimizer** | Um gerador e um avaliador iteram até atingir o critério | [[anthropics-skills]] `skill-creator/agents/{grader,comparator,analyzer}.md`; wshobson `plugin-eval` | Melhorar prompts e skills | Juiz LLM não validado contra rótulos humanos (wshobson admite) |
| **Debate** | Agentes argumentam e um juiz decide | Citado por [[awesome-llms-labs-orchestration]] | Decisões de arquitetura | Retorno decrescente depois de 2 ou 3 rodadas |

## 2. Formatos de spec de agente

| Formato | Campos | Fonte | Observação |
|---|---|---|---|
| Subagente Claude Code (Markdown + YAML) | `name`, `description`, `tools`, `model` (+ `color`) | wshobson, VoltAgent, 0xfurai | `description` é o gatilho de autosseleção |
| Variante OMC | + `level`, `disallowedTools` | OMC `agents/verifier.md` | Uma denylist permite um revisor somente leitura |
| SKILL.md | `name`, `description` (+ `license`) e corpo com menos de 500 linhas | [[anthropics-skills]] → agentskills.io | Metadados com cerca de 100 palavras sempre no contexto |
| CrewAI JSONC/YAML | `role`, `goal`, `backstory`, `llm`, `tools`, `settings{max_iter, max_rpm, allow_delegation…}` | [[crewai]] | Os limites de execução ficam na própria spec |
| ❌ Model ID fixo | `model: claude-sonnet-4-20250514` | [[0xfurai-subagents]] | Envelhece mal; preferir um alias de tier |

## 3. Estrutura de prompt de orquestrador (síntese)
Ordem observada nos melhores exemplos (OMC `CLAUDE.md`, wshobson `AGENTS.md`, ruflo `CLAUDE.md`, topo):
1. **Princípios operacionais** em poucas linhas: "faça o que foi pedido, nada mais" (ruflo) e "delegue trabalho especializado" (OMC).
2. **Regras de delegação**: quando delegar, quando não delegar e o limite de concorrência.
3. **Catálogo de papéis** apenas com nome e gatilho; o prompt do papel é carregado do registro na hora do spawn (OMC `<child_agent_protocol>`).
4. **Roteamento de modelo** por tier.
5. **Protocolo de verificação**: um verificador separado e critérios com evidência.
6. **Guardas de falha**: sem conclusão falsa, sem auto-aprovação, revalidar depois de compactação.
7. **Cancelamento e estados terminais**, além dos kill switches.
8. **Ponteiros** para detalhes (docs e skills) em vez de conteúdo inline: o mapa de cerca de 150 linhas do wshobson.

## 4. Anti-padrões e mitigação

| Anti-padrão | Sinal | Mitigação observada | Fonte |
|---|---|---|---|
| **Delegação circular** | A delega a B, que delega de volta a A | Quebrar ciclos antes da execução; `allow_delegation=False` por padrão; profundidade máxima de 2 | VoltAgent `multi-agent-coordinator.md`; CrewAI docs; Awesome-llms-labs |
| **Explosão de subagentes** | Swarm para tarefas pequenas | Teto de 6 filhos concorrentes (OMC); `maxAgents` 6 a 8 (ruflo); 2 a 5 teammates (wshobson). ❌ Contraexemplo: o ruflo dispara swarm automaticamente com 3 ou mais arquivos | OMC `AGENTS.md`; ruflo `CLAUDE.md` |
| **Loops infinitos** | Corrigir → verificar → corrigir sem fim | Loop limitado por um número máximo de tentativas, com transição para `failed` (OMC); `max_iter` 20 e `max_retry_limit` 2 (CrewAI); `max_tool_iterations=10` (AutoGen); nada de `while True` com interrupt (LangGraph) | OMC, CrewAI, AutoGen, LangGraph |
| **Contexto compartilhado excessivo** | CLAUDE.md gigante, histórico inteiro passado aos filhos | Mapa de cerca de 150 linhas e skill de até cerca de 8 KB (wshobson); divulgação em 3 níveis (anthropics); filho com janela própria (OMC). ❌ Contraexemplo: o `CLAUDE.md` do ruflo tem 1.560 linhas | wshobson, anthropics/skills, OMC |
| **Conflito de edição** | Dois agentes editam o mesmo arquivo | Posse exclusiva por cluster de arquivos (wshobson); worktree isolada por escritor (ruflo, OMC); escritor único por arquivo (VoltAgent); claim de trabalho (Concord MCP, via [[andyrewlee-awesome-agent-orchestrators]]) | wshobson, ruflo, VoltAgent |
| **Falha silenciosa e conclusão falsa** | "Feito" com TODOs ou testes pulados | "No fake completion" e verificador com evidência fresca (OMC); `respect_context_window=False` para preferir falha a análise incompleta (CrewAI) | OMC, CrewAI |
| **Protocolo fictício** | JSON enviado a um agente ou barramento que não existe | Declarar que não há barramento de mensagens em runtime e coordenar só por arquivos ou pelo orquestrador | VoltAgent (130 agentes ainda têm o protocolo fictício) |
| **Métricas inventadas** | "100% success rate" sem método | *"Do not invent throughput … numbers"* | VoltAgent (regra); ruflo (contraexemplo) |
| **Auto-evolução sem limite** | O agente amplia as próprias ferramentas ou gastos | *"cannot self-promote or expand tools, network, secrets, spend"* | ruflo `CLAUDE.md` |
| **Runtime descontinuado** | Projeto novo sobre o AutoGen ou `langgraph-supervisor` | Checar o status antes de adotar | AutoGen README; LangGraph `AGENTS.md` |
