---
title: "CHANGELOG — AI-Agent-Ecosystem"
type: changelog
status: active
updated: 2026-10-30
tags: [ai-agent-ecosystem, changelog]
---
# CHANGELOG — AI-Agent-Ecosystem

## 2026-10-30 — Prompt para iniciar time de agentes

- Nova [[Prompt-Iniciar-Time-de-Agentes]] (`type: prompt`) em `00-Dashboard/`. Contém:
  - o prompt do orquestrador: 12 tools MCP obrigatórias, planos, bloqueio do Cofre até o opt-out, menor time, revisão por outro fornecedor, cadeia de cota, aprovação antes de gastar cota, telemetria sem inventar;
  - o template de prompt por agente (campos de [[Agent-Spec-Template]] e [[Handoff-Template]]), com 2 exemplos (Coding Java/Spring com Sonnet, QA com Codex);
  - os resumos de modelos por força e da matriz tarefa→modelo (vale o [[Model-Catalog]]);
  - o time padrão por papel e o fluxo mermaid com os pontos de aprovação.
- Não existe nota "Agent Factory" na KB; a nota usa os templates do registry.
- [[Prompt-Inicial-Configuracao]]:
  - nova seção ORDEM DE LEITURA E CAMINHOS;
  - `get_model_routing_policy` com task;
  - versão do MCP conferida (v0.3.0, 22 tools);
  - o fim aponta para o novo prompt.
- Referências pontuais em [[Indice-AI-Agent-Ecosystem]] e [[Main-Orchestrator-Prompt]] (intro; o bloco de 75 linhas não mudou). [[ADR-005-Frontmatter-Padronizado]] ganhou o tipo `prompt`.

## 2026-10-29 — Catálogo de modelos (qual modelo para cada tarefa)

- Novo [[Model-Catalog]] em `11-Universal-Agent-Runtime/Model-Catalog/`: diagrama mermaid do roteamento centrado nos acessos do Mac (Claude Code Pro, Codex/ChatGPT, cursor-agent, OpenCode, Qwen Code, Ollama), cotas por acesso e o que fazer quando cada uma esgota, matriz de 11 tarefas (primário/fallback/barato-local/classe de dados), regras de decisão em YAML (D1–D3 dados, Q1–Q2 cota, R1, C1, B1, L1, S1) e rankings datados (AA, LMArena; SWE-bench não verificado; Aider desatualizado).
- 18 fichas `model-card` em `Models/`: 13 do núcleo, 3 locais (só `qwen2.5:3b` instalado) e 1 de reserva opcional não configurada (Groq).
- Regra de dados: modelo que treina com as entradas não recebe conteúdo do Cofre. Claude Pro, ChatGPT/Codex e Cursor ficam como "treina" até o Pedro confirmar os toggles de opt-out.
- Atualização (~23h13 BRT): plano do ChatGPT = ChatGPT Plus (confirmado pelo Pedro em 29/10/2026); removido do "não verificado". Treino: Pedro não sabe se o treino está desligado (29/10/2026) — Cofre bloqueado até confirmação. Fichas Claude, Codex e Cursor mantêm `opt_out_confirmed: false` e ganharam `opt_out_status`.
- Fotografia de 29/10/2026 (~23h BRT), com revisão mensal; a tool avisa `VENCIDO` depois de 30 dias.
- [[Agent-Knowledge-MCP]]: `get_model_routing_policy` ganhou `task`, `view` (catalog/matrix/rules/all), `local` e `layer`, sem tool nova e somente leitura. Novo `src/tools/model-catalog-helpers.ts`, teste `tests/11-model-catalog.test.ts` e fixtures. `npm test`: 49 testes, 47 passam, 0 falham, 2 pulados.
- Referências pontuais em [[Model-Router]], [[MOC-Universal-Agent-Runtime]], [[Model-Routing-Policy]], [[Main-Orchestrator-Prompt]] (uma linha em `<roteamento>`), [[Indice-AI-Agent-Ecosystem]], [[ADR-005-Frontmatter-Padronizado]] (tipos novos) e [[Tools-Reference]].

## 2026-10-29 — Revisão de 10 repos de skills

- Pedro aprovou aplicar o necessário. Métricas da API do GitHub de 29/10, 22h25–22h40 BRT. Repos lidos como dados não confiáveis: nada clonado, instalado ou executado.
- Fichas novas: [[Addy-Agent-Skills]] (85, top10, seletivo com ~7 skills), [[Graphify]] (81, experimental, `--code-only`, sem Cloud, alerta `graphifyy` no PyPI), [[Ponytail]] (80, experimental, sem hooks) e [[Caveman]] (78, experimental só a skill; CLI/proxy/Auto/Cloud descartados por telemetria e lock-in).
- Atualizadas no lugar: [[Superpowers]] (métricas, Qwen Code, telemetria opt-out, custo do hook) e [[Anthropic-Skills]] (métricas, 19 skills; nota 82 mantida, recálculo daria 77).
- [[Repository-Catalog]]: Matt Pocock Skills (79) e UI UX Pro Max (68) no radar; Karpathy Skills (61) e Taste Skill (60) avaliados e descartados, com motivo. Também atualizados [[Skill-Catalog]], [[MOC-Agent-Skills]] e [[Estrategia-de-Tokens]] (nova seção de skills de economia).
- [[ADR-005-Frontmatter-Padronizado]]: status `experimental` adicionado para ferramentas.

## 2026-10-29 — Auditoria de arquitetura

- Adicionado [[Auditoria-Arquitetura-2026-10-29]]: notas por dimensão, lacunas, roadmap e a seção "Provedores gratuitos e economia de tokens". Auditoria somente leitura; nenhuma outra nota foi alterada.

## 2026-10-29 — Orquestração nativa supervisionada ativada

- Pedro solicitou iniciar a orquestração aqui. Workflow real HARNESS-BOOT-001 executado pelo maestro Codex com Lince (reviewer) e Prumo (qa-validator), no Maestri, sem simulação ou npm run experiment.
- Quatro tools agent-knowledge validadas pelo cliente nativo Codex; configuração MCP adicionada somente ao projeto Harness-Architecture.
- Roles reviewer/qa-validator promovidas com evidência e transporte maestri-native-codex; registro agora 3 implemented / 5 planned / 5 conceptual. Adapters CLI AgentPort mantidos spec-only.
- Revisão independente encontrou falhas reais nos guardas; corrigidas em commits separados, com regressões testadas. Nenhum arquivo preexistente de trabalho do Pedro foi incorporado.
- Telemetria operacional guarda metadados e proveniência fora dos vaults; tokens/custos permanecem não medidos.

## 2026-10-29 — Integração aprovada ao Harness-Architecture

- Plano aprovado pelo Pedro; contratos EVO-01..14 e M1/M3/M4/M8/M9 incorporados em etapas na branch integration/agent-knowledge. M5/M6/M7/M10 mantêm adoção condicionada aos experimentos/baseline.
- Fonte canônica do registro mantida na KB; validador local adicionado ao Agent-Knowledge-MCP, sem duplicar specs ou alterar hermes-vault.
- Hooks locais, kill switch e telemetria somente de metadados fora dos vaults; testes de contrato não executam agentes.
- ADR-011/012 da KB aceitos. Corrigido YAML do título de Maestri.md.
- Registros agent-knowledge nos clientes preservados. Tentativa nativa no Claude Code retornou HTTP 429 usage_limit_reached antes das quatro chamadas; Desktop chat continua pendente. SDK não é apresentado como prova de chamada nativa.
- Arquivos locais preexistentes do Pedro preservados; Metrics/baseline.md adicionado sem editar seu execution-log.md.
- Nenhum .env ou nota TRADERS lido; Hermes Agent e o outro projeto Harness fora do escopo; nenhum experimento de delegação executado.

## 2026-10-29 — Universal Agent Runtime (AKM 0.3.0) e Hermes fora do escopo
### Escopo
- Por decisão do Pedro, o **Hermes Agent está fora do escopo**: não é cliente nem alvo de integração. O alvo é o Harness em `~/Downloads/Harness-Architecture`. `hermes-vault` continua sendo o MCP do próprio Harness.
- Instruções de configuração do Hermes foram removidas da KB e do Agent-Knowledge-MCP. Afetou Integracao-Clientes, Harness-Improvement-Proposal (M3 e as montagens do compose), Tools-Reference, os ADRs, os relatórios de validação e as notas das áreas 01–10. No AKM foram README, docs/CLIENT-INTEGRATION, `.env.example` e configs de exemplo. `examples/hermes-config.yaml` foi apagado. [[Hermes-Agent]] continua como ficha de pesquisa, marcada como "fora do escopo do ecossistema do Pedro". Os registros históricos ficaram, com anotação.
- Docker e `~/.hermes` não foram tocados; o runtime não detecta Docker.
### Adicionado
- Área `11-Universal-Agent-Runtime` com [[MOC-Universal-Agent-Runtime]]:
  - contrato, manifest, detecção, registro, [[Model-Router]], políticas, tokens, [[Execution-Metrics]] (`rt_*`) e [[Maestri]];
  - 10 adapters, [[Delegation-Experiment]], [[Portability-Roadmap]], [[Harness-Integration-Runtime]] (EVO-11..14) e ADR-011/012 (`proposed`).
- Agent-Knowledge-MCP 0.3.0:
  - `npm run detect-env`, contrato TS, adapters shell-echo/noop e argv/parsers das CLIs (`spec-only`);
  - 4 tools: `get_runtime_architecture`, `list_agent_adapters`, `get_model_routing_policy`, `get_environment_capabilities` (22 no total);
  - `npm run experiment` (plano/selftest; execução real só com `--approve`).
- [[Validacao-Runtime-2026-10-29]]: `npm test` 46 ok / 2 pulados, `test:real` 2/2. Experimento real não executado (aguarda aprovação).
### Observado
- A detecção mostra `agent-knowledge` registrado no Claude Code e no Claude Desktop. O registro não foi feito nesta etapa.

## 2026-10-29 — Validação local e preparação dos clientes
- Após autorização pontual de leitura dos quatro arquivos externos, [[Integracao-Clientes-2026-10-29-diffs]] preparado com diffs exatos de adição para Claude Code, Desktop, Hermes e Compose; parsing JSON/YAML e preservação semântica das configurações anteriores verificados em memória. Aplicação continua pendente de aprovação. Nenhum .env aberto.
- [[Integracao-Clientes-2026-10-29]]: npm install/build concluídos; npm test com 35 aprovados e 2 pulados; test:real restrito com 1 aprovado e 1 pulado (varredura integral do Cofre desativada pelo escopo autorizado).
- Configuração local `Integracao-Clientes-2026-10-29.akm.json` criada na pasta Validation-Results, com include exclusivo AI-Agent-Ecosystem no Cofre e Harness de referência; validada via SDK stdio com 18 tools e as cinco chamadas pedidas.
- Discovery e Context Loading executados na sessão Codex/Maestri via MCP. Proposta de equipe preparada, sem recrutamento ou ativação do builder.
- Clientes Claude Code/Desktop/Hermes ainda não integrados; diffs exatos preparados após autorização de leitura, aplicação pendente. Hermes: Node retornou `exec format error`; correção não aplicada. Harness e notas antigas preservados.

## 2026-10-29 — v0.2.1
### Alterado
- [[Bootstrap-8-Fases]]: as 8 fases agora seguem o texto do Pedro: Discovery, Context Loading, Architecture Validation, Agent Planning, Agent Provisioning, Workflow Configuration, Observability e Validation. Cada fase traz tools, saída e critério de saída. A nota também lista os 9 passos da validação E2E.
- [[Main-Orchestrator-Prompt]] 0.2.0: novo bloco `<ciclo>` com os 14 pontos do Pedro e tabela de cobertura. Os pontos 1, 4, 9, 10, 12 e 13 estavam ausentes ou só implícitos.
- [[Validacao-Orquestracao-2026-10-29]]: refeita com os 9 passos do Pedro e a nova execução real (`sim-20261030T001333`, 9/9 checagens).
- [[MOC-Multi-Agent-Orchestration]]: a lacuna sobre a t2u virou nota de fonte.
- [[Telemetry-Schema]]: eventos `task_executed` e `metrics_recorded`.
- Agent-Knowledge-MCP: `scripts/simulate-orchestration.mjs` com os passos renomeados e reordenados (proposta de criação vira evento `hitl`; execução simulada explícita; métrica `agent_term_match`). README ajustado e `package-lock.json` em 0.2.0.
### Removido
- A marca de "inferido" do bootstrap, da simulação e do relatório. As listas agora vêm do texto do Pedro. A entrada v0.2.0 abaixo foi mantida como registro histórico.

## 2026-10-29 — v0.2.0
### Adicionado
- `07-GitHub-Research/Orchestration-Research/` (18 notas): pesquisa de orquestração importada da box — 3 sínteses, 14 fichas de repositório e [[MOC-Orchestration-Research]] com tabela de licenças. `wshobson-agents` virou `wshobson-agents-orquestracao` para não colidir com a nota da área 02.
- `10-Multi-Agent-Orchestration/` (44 notas): prompt e política do orquestrador, bootstrap de 8 fases (inferido), registro de 13 agentes (1 implemented, 7 planned, 5 conceptual) com templates, 5 protocolos, execução e roteamento, 17 métricas e schema de telemetria, contexto e memória, 5 workflows, governança e ADR-007 a 010, roadmap O0–O5, propostas EVO-01..10 com reversão.
- [[Validacao-Orquestracao-2026-10-29]]: simulação determinística dos 9 passos.
- Documentação do [[Agent-Knowledge-MCP]] 0.2.0 (8 tools novas).
### Alterado
- Índice, Repository-Catalog, Research-History, MOC-Implementation, Implementation-Roadmap, ADR-005, MOC-Agent-Orchestration, Agent-Knowledge-MCP e Tools-Reference — só links e seções novas.
### Não alterado
- Nenhuma nota fora de AI-Agent-Ecosystem; Harness-Architecture só lido.

## 2026-10-29 — v0.1.0
### Adicionado
- Estrutura 00–09 com índice, inventário do ambiente, roadmap e fluxo de atualização.
- 23 notas de ferramentas (10 top10, 13 radar) com frontmatter padronizado ([[ADR-005-Frontmatter-Padronizado]]).
- MOCs, catálogos (MCP, skills, repositórios), comparações, metodologia, histórico de pesquisa.
- Estratégia de tokens (4 notas) e memória de agentes.
- Análise do Harness e [[Harness-Improvement-Proposal]] (10 seções).
- ADR-001 a ADR-005 (aceitos) e ADR-006 (proposto); experimentos E1–E3 (planejados).
- Documentação do [[Agent-Knowledge-MCP]] 0.1.0 e resultado de validação.
### Não alterado
- Nenhuma nota existente do Cofre do Pedro nem do Harness-Architecture.
