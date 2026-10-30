---
title: "Auditoria de Arquitetura — Ecossistema de Agentes (29/10/2026)"
type: validation
status: done
category: governance
updated: 2026-10-29
verified_at: 2026-10-29
tags: [ai-agent-ecosystem, audit, architecture, security, tokens, free-providers]
---
# Auditoria de Arquitetura — Ecossistema de Agentes (29/10/2026)

Página com a mesma auditoria: https://cursor.com/canvas/store-5c283254-05f4-4be6-b014-17c73bf1c3af/56961fd8-d4a3-40ca-bf2c-020f619e7743

> Auditoria **somente leitura**, feita entre 22:00 e 22:20 (horário de Brasília, UTC−3). A única escrita foi esta nota, mais um link no [[Indice-AI-Agent-Ecosystem]] e uma entrada no [[CHANGELOG]]. Nada foi instalado, nenhum push, nenhum agente executado. Não li `.env`, `TRADERS FAKALUM`, Hermes Agent, `~/hermes-docker`, `~/.hermes` nem o Harness-Arquitetura-Flow.
> As notas por dimensão são **julgamento do auditor** contra os referenciais citados (rubrica: 0 = ausente, 50 = parcial sem medição, 75 = presente e testado, 100 = presente, medido e automatizado). Não são métricas.

## Resumo executivo
A base é sólida em **segurança de leitura** (PathGuard, stdio, redação, anotações read-only, hook do Harness que falha fechado) e em **honestidade de status** (adapters marcados `spec-only`, baseline = 0 amostras). As maiores lacunas são de **engenharia de software clássica**: o Agent-Knowledge-MCP e o Cofre **não estão em controle de versão**, não há CI, a documentação não segue arc42/C4 nem define atributos de qualidade mensuráveis, e não existe baseline real para afirmar economia de tokens. Na parte de **provedores gratuitos**, a KB está desatualizada: o free tier do Qwen OAuth acabou em 15/04/2026, o Gemini CLI gratuito virou Antigravity CLI em 18/06/2026 e o GitHub Models foi aposentado em 30/07/2026. Falta também um campo de **política de dados** (treino/retenção) no contrato dos adapters.

Fato novo relevante: o Harness-Architecture **já tem integração** na branch local `integration/agent-knowledge` (17 commits de 29/10 entre 22:04 e 22:08, só local, sem push, não mesclada em `main`). Essa branch também carrega o commit `e58744d` do video-engine (53 arquivos, 7.830 inserções), que não tem relação com a integração, e há alterações não commitadas do video-engine na árvore. O CHANGELOG diz que o Pedro aprovou o plano e que ADR-011/012 foram aceitos; **confirmar com o Pedro** que essa aprovação aconteceu.

## Evidência coletada (comandos reais)
| Item | Resultado |
|---|---|
| Testes do MCP (`node --test dist/tests/*.test.js`, sem rebuild; dist em dia com src) | 48 testes: 46 passam, 0 falham, 2 pulados (vaults reais) |
| Cobertura (`--experimental-test-coverage`) | linhas 94,63% · ramos 77,94% · funções 85,68% |
| Pontos fracos de cobertura | ramos: `recommend_integration` 41,67% · `detect.js` 49,43% · `list_registered_agents` 54,29%; linhas: `get_environment_capabilities` 69% |
| `npm audit` (node_modules já existia) | 0 vulnerabilidades (prod e total); Harness `.mcp/`: 0 |
| `npm outdated` | `typescript` 5.9.3 (última 7.0.2) · `@types/node` 22.20.5 (última 26.6.6) |
| Tamanho das definições das 22 tools | 18.743 caracteres ≈ 4.686 tokens (estimativa chars/4, não medida pelo cliente) |
| Git | `Agent-Knowledge-MCP`: não é repositório · `Cofre do Pedro`: não é repositório · Harness: branch `integration/agent-knowledge` só local |
| KB | 160 notas, ~58,5 mil palavras, 100% com frontmatter, 0 órfãs; 11 valores distintos de `status` |
| Links suspeitos | `[[HOME]]` e `[[AGENTS]]` em Integracao-Clientes-2026-10-29 (linha 118) apontam para arquivos do Harness, fora do Cofre; `[[ ]]` em Fluxo-de-Atualizacao é exemplo; os 15 com `\|` são escape válido em tabela |
| Hook do Harness (`python3 -m unittest automation/test_claude_hook.py`) | 9 testes OK |
| Telemetria do hook | pasta `runtime-output/harness-telemetry` ainda não existe (nenhum evento gravado) |
| Baseline (`Metrics/baseline.md` do Harness) | "Initial sample count … zero" |
| Mac | Intel Core i5-1038NG7 (8 threads), 16 GiB RAM, macOS 26.7.1; Ollama 0.40.12 com `qwen2.5:3b` (1,9 GB), nenhum modelo carregado agora; `qwen` 0.24.3; `opencode` 2.2.2; `gemini`/`agy` ausentes |

## Notas por dimensão
| Dimensão | Referencial | Nota | Evidência | Não verificado |
|---|---|---|---|---|
| Documentação de arquitetura | arc42 (https://arc42.org/overview), C4 (https://c4model.com) | 55 | MOCs, índice, 0 órfãs, frontmatter 100%; mas 0 diagramas (0 `mermaid`), sem objetivos/cenários de qualidade, glossário, registro de riscos/dívida | leitura integral de todas as 160 notas |
| Decisões (ADR) | Nygard (https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), MADR (https://adr.github.io/madr/) | 62 | 12 ADRs com status; espalhados em 3 pastas; ADR-003..006 sem "Contexto"; só ADR-002 tem "Alternativas"; sem "supersedes" | — |
| Atributos de qualidade | ISO/IEC 25010:2023 (https://iso25000.com/index.php/en/iso-25000-standards/iso-25010) | 40 | segurança e manutenibilidade tratadas implicitamente; nenhum requisito mensurável (latência de busca, tamanho máx. de resposta como SLO) | — |
| Design do código do MCP | SOLID, Ports & Adapters (Cockburn, https://alistair.cockburn.us/hexagonal-architecture/), Clean Architecture | 72 | registro único de tools (aberto/fechado), `ToolDefinition`, `PathGuard`, `AgentPort`; mas o pacote "somente leitura" também contém o runtime que faz `spawn` de CLIs (tools não fazem spawn — verificado); sem linter (há `eslint-disable` sem ESLint) | análise estática formal |
| Configuração/operação | 12-Factor (https://12factor.net) | 68 | config por `AKM_*`, logs em stderr, lockfile; caminhos `~/Downloads/...` fixos no hook do Harness; o Harness grava telemetria dentro da pasta do MCP | — |
| Segurança LLM/MCP | OWASP Top 10 LLM 2025 (https://genai.owasp.org/llm-top-10/), MCP Security Best Practices (https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices) | 74 | stdio (recomendado para servidor local), read-only, bloqueio de `..`/symlink/ocultos/credenciais, redação, corte de saída (LLM10), aviso "dado, não instrução" (LLM01); hook nega `.env`/TRADERS/Hermes e pede aprovação para escrita, shell e delegação | sem modelo de ameaças; redação não cobre chave PEM nem JWT; saída não é cercada por delimitadores; `hermes-vault` tem escritas controladas (fora do escopo, só registrado) |
| Testes | pirâmide de testes (https://martinfowler.com/articles/practical-test-pyramid.html) | 70 | unit + integração com cliente MCP em memória; cobertura medida acima | sem CI, sem snapshot de contrato de `tools/list`, adapters de CLI nunca rodados com tarefa real |
| Observabilidade | OpenTelemetry GenAI semconv (https://github.com/open-telemetry/semantic-conventions-genai) | 38 | schema JSONL `akm.orchestration.v1` próprio; tokens estimados por chars/4; nenhum evento real gravado; baseline 0 | — |
| Context engineering / tokens | Anthropic "Effective context engineering" (https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), "Building effective agents" (https://www.anthropic.com/engineering/building-effective-agents) | 60 | divulgação progressiva (`search_knowledge` → `get_document` com `heading`/`outline_only`), limites de caracteres; mas 22 tools com sobreposição (várias `get_*_policy`) ≈ 4,7 mil tokens de definições — a Anthropic aponta conjuntos inchados como falha comum | consumo real de contexto no cliente |
| Governança / supply chain | SemVer (https://semver.org), Keep a Changelog (https://keepachangelog.com) | 45 | `npm audit` 0; deps majoritariamente fixas; versão 0.3.0 coerente em package.json e servidor; sem git, sem CI, sem SBOM; CHANGELOG com 6 seções na mesma data e sem "Unreleased" | licenças de deps transitivas |
| Provedores gratuitos e roteamento | fontes oficiais abaixo | 35 | tiers e fórmula de custo por sucesso bem definidos; mas informação de free tier desatualizada e sem política de dados por provedor | logins reais de qwen/opencode |

## Lacunas priorizadas
| # | Lacuna | Sev. | Impacto | Esforço | Recomendação | Risco | Rollback |
|---|---|---|---|---|---|---|---|
| G1 | MCP e Cofre fora de controle de versão | Crítica | sem histórico, sem rollback, sem CI | baixo | `git init` local nos dois, `.gitignore` já existe no MCP; push quando houver os repos privados | baixo (commitar algo sensível: revisar `.gitignore`, não incluir TRADERS) | apagar a pasta `.git` |
| G2 | Branch `integration/agent-knowledge` mistura o video-engine (`e58744d`, 53 arquivos) e há mudanças não commitadas do video-engine | Alta | PR impossível de revisar; risco de mesclar trabalho não relacionado | baixo | criar branch nova a partir de `main` e aplicar só os 17 commits da integração (cherry-pick); não tocar nas mudanças não commitadas do Pedro | médio (reescrita de branch local; outro agente pode estar trabalhando nela agora) | manter a branch antiga intacta com outro nome |
| G3 | Informação de free tier desatualizada e sem política de dados no contrato dos adapters | Alta | rotear tarefa para provedor inexistente ou que treina com conteúdo do Cofre (OWASP LLM02) | baixo | corrigir notas (Qwen, Gemini→Antigravity, GitHub Models) e adicionar `data_policy` (`trains_on_inputs`, `retention_days`, `zdr`) ao [[Capability-Manifest]]; regra: conteúdo do Cofre/Harness só vai a provedor com `trains_on_inputs=false` | baixo | reverter a nota |
| G4 | Sem baseline real e telemetria fora do padrão OTel | Alta | nenhuma economia pode ser afirmada | médio | rodar o método de baseline abaixo; mapear campos JSONL para `gen_ai.*` (sem trocar armazenamento) | baixo | descartar o mapeamento |
| G5 | 22 tools com sobreposição (~4,7 mil tokens estimados por sessão) | Média-alta | contexto gasto antes de qualquer pergunta; escolha ambígua de tool | médio | experimento: perfil `AKM_TOOL_PROFILE=core` com ~8 tools (search, get_document, status, policy(topic), agents, skills, workflows, decisions); medir chars de `tools/list` e acerto em 10 perguntas fixas | médio (quebrar clientes que usam nomes antigos) | perfil `full` como padrão |
| G6 | Documentação sem arc42/C4 e sem atributos de qualidade mensuráveis | Média | revisão difícil por terceiros; "perfeito" não verificável | médio | nota `Arquitetura-arc42.md` com seções 1–12 linkando as notas existentes, 2 diagramas C4 em mermaid (contexto e contêiner), 5 cenários de qualidade ISO 25010 com meta | baixo | apagar a nota |
| G7 | ADRs em 3 pastas e com modelo inconsistente | Média | decisões difíceis de achar e comparar | baixo | modelo MADR (Contexto, Opções consideradas, Decisão, Consequências, Status/Supersedes) e um índice único de ADRs | baixo | — |
| G8 | Afirmações desatualizadas | Média | agentes recebem fato errado via MCP | baixo | corrigir: [[Arquitetura-Multiagente]] e [[Comunicacao-entre-Agentes]] ("não conectado"), [[Adapter-Ollama-Local]] ("consome cota"), [[Adapter-Qwen-Code]] (OAuth encerrado), links do Harness em Integracao-Clientes | baixo | reverter |
| G9 | Runtime com `spawn` dentro do pacote do servidor read-only | Média | fronteira de confiança menos clara; auditoria mais difícil | médio | separar em dois pacotes (npm workspaces): `akm-server` (sem `child_process`) e `agent-runtime`; teste que falha se `child_process` aparecer no servidor | baixo | manter um pacote |
| G10 | Redação incompleta e saída sem delimitadores | Média | vazamento de chave PEM/JWT; injeção indireta | baixo | regras para `-----BEGIN … PRIVATE KEY-----` e JWT `eyJ…\.…\.…`; envolver conteúdo de nota em marcadores de "dado não confiável" | baixo | reverter regras |
| G11 | Sem linter e sem CI | Média | regressões silenciosas | baixo | `npm run check` = `tsc --noEmit` + testes + `npm audit`; GitHub Actions quando houver repo | baixo | remover workflow |
| G12 | Acoplamento por caminhos fixos | Baixa | quebra ao mover pastas | baixo | variável `HARNESS_TELEMETRY_DIR` e telemetria fora da pasta do MCP | baixo | valor padrão atual |
| G13 | Vocabulário de `status` misturado (11 valores; ranking `top10`/`radar` junto com ciclo de vida) | Baixa | filtros do MCP imprecisos | baixo | separar `status` (proposed/accepted/active/deprecated) de `rank` | baixo | — |
| G14 | Hook pede aprovação para quase todo comando de shell | Baixa | fadiga de aprovação (aprovar sem ler) | baixo | ampliar a lista exata de leituras seguras (ex.: `ls`, `git log`, `npm test` no MCP) com testes | médio | lista atual |

## O que já está bom
- PathGuard completo (raiz conhecida, sem absoluto, sem `..`, sem ocultos, só `.md`, sem symlink, realpath dentro da raiz, limite de tamanho) e testado.
- Transporte stdio, anotações `readOnlyHint`, logs só em stderr, corte de segurança na saída, tratamento de erro sem stack para o agente.
- 46/48 testes passando e cobertura de linhas 94,63%; `npm audit` 0.
- Hook do Harness falha fechado (exit 2), não ecoa entrada, grava só metadados com `O_NOFOLLOW` e 0600, e tem 9 testes.
- Status honestos: adapters `spec-only`, baseline 0, hipóteses marcadas como hipóteses, fórmula de custo por sucesso explícita.
- Frontmatter em 100% das notas e nenhuma nota órfã.

## Status por camada
| Camada | O que |
|---|---|
| Documentado | KB com 160 notas, 12 ADRs, EVO-01..14, Model Router, métricas e telemetria |
| Implementado | MCP 0.3.0 (22 tools), runtime com adapters process/shell-echo/noop e 10 specs de CLI; no Harness (branch local): hook, `record_runtime.py`, docs de integração |
| Testado | 48 testes do MCP (rodados nesta auditoria), cobertura medida, 9 testes do hook; nenhum adapter de CLI rodado com tarefa real |
| Integrado | `agent-knowledge` registrado no Claude Code e no Desktop (segundo [[Environment-Detection]] e o CHANGELOG; não reverifiquei os arquivos de config); branch do Harness não mesclada nem publicada; telemetria sem eventos |

## Provedores gratuitos e economia de tokens
Consultado em **29/10/2026**, nas fontes oficiais citadas. Limites mudam; confira antes de usar.

| Provedor | Limite gratuito atual | Requisitos | Dados / treino | Bom para | Encaixe no Router / adapter |
|---|---|---|---|---|---|
| Qwen Code (`qwen` 0.24.3 instalado) | **Não há mais free tier.** Qwen OAuth caiu de 1.000 para 100 req/dia em 13/04/2026 e foi encerrado em 15/04/2026 (https://github.com/QwenLM/qwen-code/pull/3291, https://qwenlm.github.io/qwen-code-docs/en/users/support/troubleshooting/) | `/auth` com chave ModelStudio, Coding Plan pago, OpenRouter ou provedor próprio | depende do provedor escolhido | o CLI segue útil como agente apontado para outro provedor | [[Adapter-Qwen-Code]] continua válido como **casca**; o tier depende do provedor configurado |
| Gemini CLI (não instalado) | **Sem free tier para contas pessoais desde 18/06/2026**; migrou para Antigravity CLI (`agy`) (https://github.com/google-gemini/gemini-cli, https://geminicli.com/docs/resources/quota-and-pricing/). Antigravity: completions e comandos ilimitados e cota semanal para trabalho de agente (https://antigravity.google/pricing/), número exato não publicado na página lida | conta Google | consumidor: telemetria ligada por padrão, desligável em Settings (https://antigravity.google/docs/settings/) | tarefas de código fora do Cofre | substituir [[Adapter-Gemini-CLI]] por um adapter Antigravity (não instalar sem aprovação) |
| OpenCode com modelos gratuitos (`opencode` 2.2.2) | modelos "Free" por tempo limitado, só dentro do OpenCode (https://opencode.ai/docs/zen/) | `opencode`; chamadas externas aos modelos free bloqueadas | GLM-5.3-Flash Free e DeepSeek V4.1 Flash Free: retenção zero e sem treino; Big Pickle, Flint 40B, MiMo, Nemotron: dados podem ser usados para melhorar o modelo | tier mini/balanced para código público | [[Adapter-OpenCode]] com allowlist dos dois modelos ZDR; os demais só com dados públicos |
| OpenRouter `:free` | 20 req/min e 50 req/dia; 1.000 req/dia após comprar 10 créditos (uma vez); falhas contam (https://openrouter.ai/docs/api_reference/limits) | conta + chave | alguns provedores free podem registrar e treinar; há controles de privacidade e ZDR (https://openrouter.ai/docs/guides/privacy/provider-logging) | testes e tarefas curtas; 50 req/dia podem acabar em uma tarefa de agente | [[Adapter-API]] compatível com OpenAI, `data_policy` obrigatório |
| Groq | free por modelo, ex.: `openai/gpt-oss-120b` e `gpt-oss-20b` 30 RPM, 1.000 RPD, 8 mil TPM, 200 mil TPD (https://console.groq.com/docs/rate-limits) | conta + chave | sem retenção por padrão (até 30 dias em casos de confiabilidade/abuso, ZDR disponível); não treina sem permissão (https://console.groq.com/docs/your-data) | tier mini: classificar, resumir, extrair | [[Adapter-API]]; 8 mil TPM limita contexto grande |
| Cerebras | **sem tier permanente**: crédito único de US$ 5 por 30 dias, exige cartão; 5 RPM, 1 milhão de tokens/dia por modelo (https://inference-docs.cerebras.ai/support/rate-limits) | cartão verificado | não verificado nesta auditoria | avaliação pontual | fora do Router permanente |
| Mistral (modo Free/Experiment) | limites por organização (req/s, tokens/min, tokens/mês) vistos no painel (https://docs.mistral.ai/admin/billing-usage/usage-limits); valores exatos não publicados na página lida | conta + chave | **no modo Free, entradas e saídas podem ser usadas para treino**, com opt-out (https://help.mistral.ai/en/articles/347617) | protótipo com dados públicos | [[Adapter-API]] só após opt-out |
| GitHub Models | **aposentado em 30/07/2026** (https://github.blog/changelog/2026-07-30-github-models-is-now-retired/) | — | — | — | remover de qualquer plano |
| Ollama local (`qwen2.5:3b`) | sem cota; limitado pelo hardware | Mac Intel é **só CPU** (https://docs.ollama.com/macos); i5 8 threads, 16 GiB | dados ficam no Mac | tier trivial: formatar, extrair, classificar curto | [[Adapter-Ollama-Local]]; não é agente (sem ferramentas) |

### Divergências com a KB
- [[Adapter-Qwen-Code]] diz "login desconhecido" e não registra o fim do Qwen OAuth; qualquer plano que conte com Qwen gratuito está errado.
- [[Adapter-Gemini-CLI]] e [[CLI-Headless-Reference]] já citam a migração para Antigravity: correto, mas o adapter ainda aponta para o `gemini`.
- [[Adapter-OpenCode]] diz "nenhum provedor autenticado"; os modelos free podem funcionar sem login (não verificado), e as diferenças de privacidade entre eles não estão documentadas.
- [[Adapter-Ollama-Local]] diz "(consome cota)" no status, o que não se aplica.
- [[Model-Pricing]] não lista nenhum provedor gratuito nem política de dados.
- [[Capability-Manifest]] não tem campo de política de dados.

### Economia real vs. deslocamento de custo
- **Economia real**: a tarefa passa no verificador e o `rt_cost_per_success` cai, contando cota de assinatura e retrabalho.
- **Deslocamento**: o custo vai para outro lugar e não some. Ollama gasta CPU, RAM, tempo e bateria do Mac Intel (só CPU). Free tiers gastam requisições diárias e expõem dados quando o provedor treina. Modelo fraco aumenta retries e revisão humana. A fórmula de [[Model-Router]] já mostra que um modelo barato com `p` baixo pode sair mais caro por sucesso.

### Método de baseline e medição (sem números inventados)
1. **Tarefas fixas**: 3 tipos (trivial, simples, moderada) × 5 tarefas cada, com critério objetivo de aceite e dados públicos ou sintéticos (nada do Cofre ou TRADERS).
2. **Baseline**: rodar no tier atual (Claude Code/Codex) e registrar em `Metrics/baseline.md` do Harness: `rt_success`, `rt_retry_rate`, `rt_latency_ms`, `rt_tokens_reported` (só se a CLI reportar), `rt_context_chars` e custo (USD ou "cota", com rótulo `reported`/`estimated`/`unavailable`).
3. **Candidato**: mesmas tarefas no provedor candidato (Ollama local, Groq, ou modelo ZDR do OpenCode), com o mesmo verificador.
4. **Deslocamento local**: para Ollama, medir com `/usr/bin/time -l` (tempo de CPU e memória máxima) e tempo de parede; energia fica "não medida" (exige `sudo powermetrics`).
5. **Decisão**: adotar só se `rt_cost_per_success` cair e `rt_success` não cair, com o mesmo n. Resultado "inconclusivo" com menos de 5 tarefas por tipo.
6. **Telemetria**: mapear para OTel GenAI (`gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.usage.cache_read.input_tokens`, `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.operation.name=invoke_agent`).

## Roadmap priorizado
| Ordem | Item | Tipo | Depende de aprovação |
|---|---|---|---|
| 1 | G1 `git init` local do MCP e da KB | quick win | sim |
| 2 | G8 + G3 corrigir notas desatualizadas e incluir `data_policy` no manifest | quick win | sim (edição da KB) |
| 3 | G2 separar o video-engine da branch de integração | quick win | sim |
| 4 | G10 regras PEM/JWT + testes | quick win | sim (código) |
| 5 | G11 `npm run check` local | quick win | sim (código) |
| 6 | G5 experimento de perfil de tools (medir antes/depois) | experimento pequeno | sim |
| 7 | Baseline com 15 tarefas no tier atual | experimento pequeno | sim (gasta cota) |
| 8 | Comparação com Ollama e 1 provedor ZDR | experimento pequeno | sim (contas/chaves) |
| 9 | G6 + G7 arc42/C4 e ADRs em MADR | médio | sim |
| 10 | G9 separar servidor e runtime | médio | sim |

## Aprovações necessárias
1. `git init` local do Agent-Knowledge-MCP e da pasta AI-Agent-Ecosystem (e as URLs dos 2 repos privados para o push).
2. Limpeza da branch `integration/agent-knowledge` (tirar o commit do video-engine) e confirmação de que o plano/ADR-011/012 foram mesmo aprovados.
3. Correções nas notas da KB (lacunas G3, G8) e mudanças de código no MCP (G5, G9, G10, G11).
4. Criar contas/chaves em provedores gratuitos e ativar opt-out de treino; instalar Antigravity CLI, se quiser.
5. Rodar baseline e experimentos que gastam cota.

Ver [[Validacao-Agent-Knowledge-MCP-2026-10-29]] · [[Validacao-Orquestracao-2026-10-29]] · [[Validacao-Runtime-2026-10-29]] · [[Model-Router]] · [[Execution-Metrics]].
