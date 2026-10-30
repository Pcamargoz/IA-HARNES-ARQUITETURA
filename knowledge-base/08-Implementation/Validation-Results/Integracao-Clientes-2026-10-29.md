---
title: "Integração de clientes — 2026-10-29"
type: validation
status: partial
category: orchestration
verified_at: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, mcp, integration, maestri, validation]
---
# Integração de clientes — 2026-10-29

## Atualização após aprovação — integração ao Harness-Architecture

O Pedro aprovou o plano apresentado e a implementação foi feita em commits por etapa na branch `integration/agent-knowledge`, com base em `e58744dca6d88bbf043110950c08f75ce82fa043`. As seções históricas abaixo descrevem etapas anteriores e não são o estado atual.

### Documentado

- Harness: ADR-012, entrada curta do orquestrador (55 linhas com frontmatter), ponte automática CLAUDE.md, recuperação progressiva da KB, fonte canônica do registro, delegação limitada, verificador independente, budgets, estados terminais e convenção de retomada.
- Modelos: aliases condicionais sonnet/opus e tier0; sem preços, benchmarks, cota disponível ou implementação de adapter presumidos.
- M1: Metrics/baseline.md registra o contrato de coleta. Três tarefas comparáveis ainda não foram medidas; nenhuma economia comprovada.
- M4: regra docs-first por versão, sem instalação automática de Context7.
- M5/M6/M7/M10: adoções continuam condicionadas a E1/E3/E2 e ao baseline; nenhum componente foi instalado.
- M8: candidatos e referências atualizados com origem na KB e sem afirmar manutenção upstream revalidada.
- ADR-011/012 da KB aceitos na aprovação do plano. Título YAML de Maestri.md corrigido no próprio arquivo.

### Implementado

- Registros `agent-knowledge` existentes no Claude Code e Desktop preservados. A configuração compartilhada restringe Cofre a AI-Agent-Ecosystem e aponta harness para Harness-Architecture.
- `.claude/settings.json` do Harness: hooks PreToolUse, PostToolUse, PostToolUseFailure e SubagentStop, limitados a 5 segundos.
- `automation/claude_hook.py`: guardas locais, kill switch de novas delegações, escrita canônica com escopo aprovado e metadados fora dos vaults. Não é sandbox, analisador completo de shell ou proteção para todos os clientes.
- `automation/record_runtime.py`: recebe AgentResult já produzido por uma execução aprovada, conserva métricas/proveniência e descarta conteúdo. Não executa agentes e não fabrica recibos.
- `Agent-Knowledge-MCP/scripts/validate-harness.mjs` + `npm run validate:harness`: validador das specs canônicas e documentos de integração, sem duplicar specs no Harness.
- `Agent-Knowledge-MCP/scripts/validate-claude-native.py`: teste real reproduzível, quatro tools, timeout de 150 segundos e --max-budget-usd 1. Exige autorização de conta/cota e verifica eventos de tool, não só texto.

### Testado nesta implementação

| Verificação | Resultado real |
|---|---|
| `python3 -B -m unittest discover -s automation -p 'test_*.py' -v` | 9 testes, OK; nenhum agente executado |
| `npm run validate:harness` | passed; 13 specs: implemented=1, planned=7, conceptual=5; 5 notas; 0 erros |
| `env AKM_REAL_ROOT_INCLUDE='{"cofre":["AI-Agent-Ecosystem"]}' AKM_REAL_FULL_SCAN=0 npm run test:real` | exit 0; tests=2, pass=1, fail=0, skipped=1 |
| Índice real após correção YAML | 227 documentos: cofre=160, harness=67; 1734 seções; avisos de parse=0 |
| Tools reais pelo SDK | todas as 22 chamadas da suíte restrita sem erro, incluindo as quatro pedidas |
| `git diff --check <base> HEAD` | exit 0 |
| Preservação de trabalho do Pedro | SHA-256 idêntico para os cinco arquivos preexistentes listados abaixo |
| Configuração dos clientes | entradas agent-knowledge continuam idênticas, com AKM_CONFIG aprovado |

A suíte de fixtures executada antes desta implementação retornou 48 testes: 46 aprovados, 0 falhas, 2 pulados. Os novos testes de hooks são adicionais. O teste real pulado é a varredura integral do Cofre, deliberadamente desativada pelo escopo; não há resultado 2/2 nesta revalidação.

### Teste pelo Claude Code nativo

Tentativa inicial no sandbox: `Not logged in`. Repetição fora do sandbox, usando o login existente da CLI sem abrir credenciais: API respondeu **HTTP 429**, `api_error=usage_limit_reached`, com:

```text
You've hit your 5-hour limit · resets 12:50am (America/Sao_Paulo)
four_tools_verified: False
```

Resultado: nenhuma das quatro tools foi chamada; usage reportou zero tokens de entrada/saída e total_cost_usd=0 nesta tentativa rejeitada. Isso não é medida de custo de uma tarefa concluída. Não houve troca de conta, modelo de fallback ou repetição após o limite.

Evidência no projeto MCP: `validation-output/claude-native-integration.jsonl`. O script retornou exit 1 porque exige quatro tool-use/tool-result válidos.

### Efetivamente integrado e pendências

| Camada | Estado |
|---|---|
| Documentação e entrada automática do Harness | aplicada e validada por leitura/validador |
| MCP SDK stdio e leitura dos vaults | testados; 22 tools |
| Registro e health check do Claude Code | existente e saudável na verificação inicial |
| Configuração do Desktop | existente e conferida; chat não testado |
| Chamadas nativas Claude Code | bloqueadas pela cota, já autorizadas; retomar após disponibilidade |
| Chat do Desktop | autorização concedida; execução na interface pendente, sem controle nativo do app disponível nesta sessão |
| Hooks | configurados e 9 contratos testados; invocação real pelo cliente ainda não comprovada |
| Runtime/adapter CLI e verificador independente | não executados/provisionados por esta integração |
| Experimento com dois agentes | não executado; continua trabalho separado |
| Baseline e economia | 0 tarefas comparáveis; não medidos |

Para concluir os clientes: repetir o script nativo após liberar cota e, no chat do Desktop, solicitar knowledge_status({}), get_orchestrator_policy({"section":"Quando executar direto e quando delegar"}), get_runtime_architecture({"component":"overview","section":"Camadas"}) e list_agent_adapters({}). Guardar resultados por cliente; não substituir por respostas do SDK. Iniciar nova sessão Claude Code no Harness para carregar CLAUDE.md/hooks e confirmar eventos reais antes de declarar instrumentação operacional.

### Preservação e rollback

Arquivos preservados byte-for-byte: Metrics/execution-log.md; video-engine/scripts/montar-batidas.mjs; video-engine/scripts/render-batidas.mjs; video-engine/src/BatidaCorte.tsx; video-engine/scripts/grade-bateria.py. Nenhum foi incluído nos commits da integração.

Nenhuma mudança em `.mcp/` ou `.mcp.json` do Harness. Nenhum registro cliente duplicado, arquivo .env lido, nota TRADERS acessada, Hermes Agent configurado/iniciado ou simulação/experimento executado.

Rollback do Harness: reverter commits individuais da branch de integração, preservando os arquivos locais preexistentes; nunca reset --hard. Desligar somente os hooks adicionados ao projeto e reiniciar a sessão. O projeto Agent-Knowledge-MCP não é repositório Git neste diretório: para desfazer suas adições, remover apenas os dois scripts de validação adicionados e a chave scripts.validate:harness, e revisar o diff documental no próprio lugar; não há backup/cópia de vault.

## Histórico anterior à aprovação


> **Atualização 29/10/2026:** Hermes Agent fora do escopo do ecossistema do Pedro; as propostas do Hermes foram retiradas. Alvo: Harness (`~/Downloads/Harness-Architecture`) e os clientes Claude Code/Desktop.

## Estado observado

Validação local concluída; integrações persistentes de clientes pendentes de aprovação. Execução no Maestri, sessão Codex. Horários do processo em UTC em 30/10/2026 correspondem à noite de 29/10/2026 em America/Sao_Paulo.

| Camada | Estado |
|---|---|
| Documentado | MCP 0.2.0; prompt 0.2.0; bootstrap de 8 fases; 13 especificações de agentes |
| Implementado | Servidor TypeScript stdio; 18 tools anunciadas pelo processo; registro declara 1 implemented, 7 planned, 5 conceptual |
| Testado agora | npm install, build, suíte com fixtures, teste real restrito e cliente SDK oficial via stdio |
| Configurado agora | Arquivo local de raízes autorizadas nesta pasta, validado com AKM_CONFIG |
| Integrado temporariamente | Cliente SDK executado pela sessão Codex/Maestri; conexão encerrada ao fim de cada processo |
| Claude Code | CLI 2.1.312 detectado; sem registro aplicado, sem confirmação por /mcp, cinco chamadas no cliente pendentes |
| Claude Desktop | Sem configuração aplicada; reinício e cinco chamadas no cliente pendentes |
| Hermes | fora do escopo do ecossistema do Pedro (decisão do Pedro, 29/10/2026); container e rede removidos depois desta validação; nada aplicado |
| Maestri | CLI responde; Codex é maestro; nenhum agente, nota ou portal conectado no inventário inicial; sem recrutamento realizado |

**As 18 tools do SDK não comprovam integração com Claude Code, Desktop nem registro nativo no Codex.** Catálogo `find_mcp_servers` é documentação da KB, não inventário de servidores conectados.

## Escopo e arquivos

Leitura direta inicial somente do índice, inventário e MOC de orquestração. Documentação/código do MCP consultados para validação. Prompt, bootstrap, contrato do Harness, políticas e registro recuperados via chamadas MCP.

Configuração criada: `Integracao-Clientes-2026-10-29.akm.json`. Contém raízes absolutas no arquivo de configuração, sem alteração do código-fonte e sem credenciais.

- `cofre=/Users/macbook/Downloads/Cofre do Pedro`, include exclusivo `AI-Agent-Ecosystem`.
- `harness=/Users/macbook/Downloads/Harness-Architecture`, somente leitura pelo MCP.
- `AKM_KB_ROOT=cofre`, `AKM_KB_SUBDIR=AI-Agent-Ecosystem`, `AKM_HARNESS_ROOT=harness` definidos no JSON equivalente.
- Limites: 5/20 resultados, 220 caracteres de snippet, 6000 de documento.
- O exemplo original inclui skills antigas e nota do Hermes fora da KB; essas entradas foram removidas da proposta para respeitar as três pastas autorizadas. Assim, skills fora delas não ficam disponíveis nesta validação.
- Harness e notas antigas preservados; sem backup ou cópia dos cofres; nenhum .env aberto.
- Na primeira etapa, as configurações dos clientes não foram abertas por estarem fora das três pastas. Após autorização pontual do Pedro (“pode fazer”), os quatro arquivos foram lidos para gerar [[Integracao-Clientes-2026-10-29-diffs]]. Nenhum .env foi aberto e nenhuma configuração de cliente foi alterada.

## Testes e saídas

| Comando | Resultado observado |
|---|---|
| `npm install` local com PATH do Node 22.23.2 | exit 0; “up to date in 1s” |
| `npm run build` | exit 0; tsc -p tsconfig.json |
| `npm test` | exit 0; 37 testes, 35 aprovados, 0 falhas, 2 pulados |
| `npm run test:real` restrito | exit 0; 2 testes, 1 aprovado, 0 falhas, 1 pulado |
| SDK oficial com AKM_CONFIG recém-criado | exit 0; 18 tools; cinco chamadas abaixo com isError=false |
| `claude --version` | 2.1.312 (Claude Code) |
| `docker ps` (histórico; Hermes hoje fora do escopo) | hermes — nousresearch/hermes-agent:latest — Up 22 hours |
| `docker exec hermes node --version` | exit 255; exec /opt/data/.local/bin/node: exec format error |

A primeira tentativa de docker exec foi bloqueada pelo sandbox; a repetição autorizada chegou ao container e revelou o erro de execução acima. A causa exata do binário incompatível ainda não foi diagnosticada.

Comando dos testes reais, usando variáveis em memória, sem .env:

```sh
env PATH=/Users/macbook/.nvm/versions/node/v22.23.2/bin:/usr/bin:/bin:/usr/sbin:/sbin \
  AKM_REAL_COFRE='/Users/macbook/Downloads/Cofre do Pedro' \
  AKM_REAL_HARNESS=/Users/macbook/Downloads/Harness-Architecture \
  AKM_REAL_ROOT_INCLUDE='{"cofre":["AI-Agent-Ecosystem"]}' \
  AKM_REAL_FULL_SCAN=0 npm run test:real
```

O script de testes reais aceita `AKM_REAL_*`, separadas das variáveis `AKM_*` de produção. O segundo teste ignora a allowlist e indexa o Cofre inteiro. Foi pulado deliberadamente para cumprir o escopo do Pedro; **não há evidência de 2/2 nesta execução**. O teste principal chama as 18 tools e passou mesmo com a allowlist restrita. As consultas de skills antigas retornaram zero; isso não prova ausência dessas skills fora do escopo.

Resumo literal da suíte:
```text
tests 37
pass 35
fail 0
cancelled 0
skipped 2
```

Resumo literal dos testes reais:
```text
tests 2
pass 1
fail 0
cancelled 0
skipped 1
```

## Cinco chamadas observadas — cliente SDK oficial

Cliente `maestri-approved-roots-validation`, servidor `agent-knowledge-mcp 0.2.0`, transporte stdio. São registros desta execução, não do Claude Code/Desktop/Hermes. Contagens anteriores à criação desta nota.

Tools anunciadas (18): `search_knowledge`, `get_document`, `list_agent_skills`, `find_mcp_servers`, `get_architecture`, `recommend_integration`, `get_research_history`, `get_token_optimization`, `get_implementation_roadmap`, `knowledge_status`, `get_orchestrator_policy`, `list_registered_agents`, `get_agent_specification`, `find_relevant_skills`, `find_workflow_template`, `get_execution_policy`, `get_metric_definitions`, `get_architecture_decisions`.

### `knowledge_status`

Argumentos: `{}`; `isError=false`.

```text
raízes: cofre(AI-Agent-Ecosystem); harness(*)
kb: cofre:AI-Agent-Ecosystem | harness: harness
documentos: 188 (cofre=127, harness=61) | seções: 1520
última reindexação: 2026-10-30T00:24:52.407Z (290 ms; reparseados 188, removidos 0; varreduras 1)
ignorados: negados=11 symlinks=0 grandes=0 | avisos de parse: 0
limites: resultados 5/20, snippet 220, doc 6000 chars, ttl 2000 ms
modo: somente leitura
```

### `search_knowledge`

Argumentos: `{"query":"progressive context loading","limit":3}`; `isError=false`.

```text
3 resultado(s) para "progressive context loading" (188 documentos considerados):
1. Context Management — harness:Memory Agents/context.md › Progressive loading (L23) score=15 type=architecture status=active
   | Level | Content | Approx. budget | |---|---|---| | L0 | [[HOME]] + [[AGENTS]] | ~2k tokens | | L1 | area entry | ~1–2k | | L2 | 2–4 specific notes | ~2–6k | | L3 | open search | on demand | | L4 | full folder | avoid …
2. Validação do Agent-Knowledge-MCP — 2026-10-29 — cofre:AI-Agent-Ecosystem/08-Implementation/Validation-Results/Validacao-Agent-Knowledge-MCP-2026-10-29.md › Vaults reais, somente leitura — `npm run test:real` (L51) score=12 type=validation status=done
   …64 chars | Serena (score 21), depois E1 e ADR-006 | | `search_knowledge "progressive context loading"` (root=harness) | 5 ms | 1629 chars | `harness:Memory Agents/context.md › Progressive loading` | | `get_document` índi…
3. AGENTS — Global Operating Contract — harness:AGENTS.md › 2. Context loading (mandatory) (L29) score=3.1 type=policy status=active
   …ific sections. - Do not load whole files "just in case". - If the needed context does not exist, say so — never invent it.
```

### `get_architecture`

Argumentos: `{"scope":"harness-source"}`; `isError=false`.

```text
# Harness Architecture
fonte: harness:HARNESS/HARNESS MAIN/architecture.md | 96 linhas
frontmatter: title: Harness Architecture | type: architecture | status: active | updated: 2026-10-20 | tags: hermes, architecture, harness

Seções (linha · nível · título · ≈caracteres):
L12 # Harness Architecture (≈3123)
L14 ## Concept (≈389)
L24 ## The four original phases (≈345)
L33 ## Layers (≈766)
L35 ### 1. Interface (≈113)
L38 ### 2. Cognition (≈178)
L44 ### 3. Execution (≈144)
L47 ### 4. Control (≈94)
L50 ### 5. Evolution (≈149)
L53 ## Information flow (≈432)
L65 ## Design principles (≈441)
L79 ## Failure modes (≈477)
L90 ## What Hermes is not (≈137)
```

### `get_orchestrator_policy`

Argumentos: `{}`; `isError=false`.

```text
Políticas da área "orchestrator" (2 nota(s)). Leia uma seção com section="<título>".

## Prompt do Main Orchestrator — cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/00-Orchestrator/Main-Orchestrator-Prompt.md
status=proposed type=policy versão=0.2.0
- Prompt (L17)
- Cobertura dos 14 pontos do Pedro (L95)
- Origem de cada bloco (L115)
- Lacunas (L128)

## Política do orquestrador — cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/00-Orchestrator/Orchestrator-Policy.md
status=proposed type=policy versão=-
- Quando executar direto e quando delegar (L14)
- Seleção de agente (L23)
- Seleção de workflow (L29)
- Roteamento de modelo (L32)
- Verificação (L35)
- Guardas contra falhas (L38)
- Cancelamento e estados terminais (L44)
- HITL (L47)
```

### `list_registered_agents`

Argumentos: `{}`; `isError=false`.

```text
13 agente(s) [implemented=1 planned=7 conceptual=5]:
- main-agent | status=implemented role=orchestrator tier=balanced autonomia=A1 — Ponto único de entrada: entende, decide, orquestra, valida e entrega. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/main-agent.md)
- backend-java-specialist | status=planned role=specialist tier=balanced autonomia=A3 — Especialista de domínio back-end (Java/Spring, APIs Node, auth, bancos). (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/backend-java-specialist.md)
- builder | status=planned role=worker tier=balanced autonomia=A3 — Implementa código, infraestrutura ou automação dentro de uma spec aprovada. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/builder.md)
- code-architecture-analyst | status=planned role=specialist tier=frontier autonomia=A1 — Analisa estrutura de código e padrões de projeto (engenharia reversa). (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/code-architecture-analyst.md)
- content-agent | status=planned role=worker tier=balanced autonomia=A2 — Produz e revisa conteúdo para público e canal definidos; não publica. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/content-agent.md)
- qa-validator | status=planned role=verifier tier=small autonomia=A1 — Valida antes do merge com a validação mínima do Harness. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/qa-validator.md)
- researcher | status=planned role=researcher tier=small autonomia=A1 — Reúne, verifica e sintetiza informação com fontes e rótulos de confiança. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/researcher.md)
- reviewer | status=planned role=reviewer tier=balanced autonomia=A1 — Revisão independente no fim da entrega: achados por severidade e veredito. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/reviewer.md)
- java-architect | status=conceptual role=specialist tier=frontier autonomia=A0 — Decisões de arquitetura Java/Spring (módulos, contratos, ADRs). (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/java-architect.md)
- planner | status=conceptual role=planner tier=balanced autonomia=A1 — Decompõe a tarefa em plano e spec com critérios de aceite antes da execução. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/planner.md)
- spring-boot-implementer | status=conceptual role=worker tier=balanced autonomia=A3 — Implementa feature Spring Boot com testes, dentro do handoff. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/spring-boot-implementer.md)
- test-engineer | status=conceptual role=worker tier=small autonomia=A3 — Escreve e mantém testes (unitários, integração, Testcontainers). (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/test-engineer.md)
- verifier | status=conceptual role=verifier tier=balanced autonomia=A1 — Verificador independente sem escrita: VERIFIED/PARTIAL/MISSING por critério com evidência fresca. (cofre:AI-Agent-Ecosystem/10-Multi-Agent-Orchestration/01-Agent-Registry/Agents/verifier.md)
Detalhes: get_agent_specification name=<nome>. Use só agentes implemented; planned/conceptual exigem aprovação.
```

## Bootstrap na sessão Maestri

### Fase 1 — Discovery: concluída neste escopo

Inventário acima registrado. MCP local responde; 188 documentos indexados na medição, 127 da KB e 61 do Harness; 18 tools. O único agente indicado como implemented no registro é main-agent. Esse status vem da documentação do Harness, não prova um processo de agente em execução no canvas. `maestri list` mostrou somente Codex, maestro, sem conexões.

Presets disponíveis: Claude Code, Codex, Antigravity, OpenCode e Shell. Os papéis existentes listados no Maestri se referem a outros projetos; não foram reutilizados para evitar trazer instruções e caminhos fora do escopo.

### Fase 2 — Context Loading: concluída para esta missão

Recuperação via MCP:
- Prompt do Main Orchestrator 0.2.0 e Bootstrap-8-Fases, carregados por get_document a pedido explícito do Pedro.
- Orchestrator-Policy: “Quando executar direto e quando delegar” e “Guardas contra falhas”.
- Execution-Policy: “Limites”.
- Harness AGENTS.md: outline e trechos “Context loading”, “Security and autonomy”, “Quality and validation”, “Work cycle”.
- Harness HOME.md: outline e “Operating rules”.
- Harness architecture.md: outline e “Layers”.
- Context-and-Memory: “O que cada papel carrega”.
- Metadados de main-agent, researcher, reviewer e qa-validator, sem ler os corpos completos das specs.

Aplicação nesta sessão: contexto progressivo, evidência antes de sucesso, um dono por arquivo, dependências antes de paralelismo, limite de duas falhas iguais e aprovação de configurações. Isso não instala o prompt nos clientes nem aplica EVO-01. Fases 3–8 não declaradas concluídas.

## Propostas de integração — NÃO APLICADAS

Os trechos abaixo são a proposta inicial. Os diffs exatos contra os quatro arquivos reais estão em [[Integracao-Clientes-2026-10-29-diffs]], com hashes das bases e validação JSON/YAML em memória. Não existem entradas agent-knowledge/agent_knowledge nos arquivos consultados. Claude Code tem hermes-vault e controlfree-vault; Desktop não tem mcpServers; As adições preservam servidores e demais configurações. Aplicação aguarda aprovação dos diffs.

### Claude Code

Adaptação do comando de `examples/claude-code-add.sh`, usando o JSON restrito e mantendo o exemplo original intacto:

```sh
claude mcp add agent-knowledge --scope user \
  -e 'AKM_CONFIG=/Users/macbook/Downloads/Cofre do Pedro/AI-Agent-Ecosystem/08-Implementation/Validation-Results/Integracao-Clientes-2026-10-29.akm.json' \
  -- /Users/macbook/.nvm/versions/node/v22.23.2/bin/node \
  /Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js
```

### Claude Code e Claude Desktop: entrada proposta em mcpServers

O Claude Code deve receber a entrada pelo comando acima. No Desktop, mesclar somente a entrada abaixo em `~/Library/Application Support/Claude/claude_desktop_config.json`, preservando demais chaves:

```diff
  "mcpServers": {
+   "agent-knowledge": {
+     "command": "/Users/macbook/.nvm/versions/node/v22.23.2/bin/node",
+     "args": ["/Users/macbook/Downloads/Agent-Knowledge-MCP/dist/src/index.js"],
+     "env": {
+       "AKM_CONFIG": "/Users/macbook/Downloads/Cofre do Pedro/AI-Agent-Ecosystem/08-Implementation/Validation-Results/Integracao-Clientes-2026-10-29.akm.json"
+     }
+   }
  }
```

Vírgulas devem seguir a estrutura real. Se a entrada já existir e divergir, apresentar substituição exata para aprovação; não sobrescrever.

### Hermes — removido

> Removido em 29/10/2026 a pedido do Pedro: Hermes Agent fora do escopo do ecossistema do Pedro (container e rede já removidos do Docker). As propostas de `mcp_servers` e de montagens no Compose foram retiradas e **não devem ser aplicadas**. O alvo é o Harness em `~/Downloads/Harness-Architecture`.

### Verificação após aprovação

1. Aplicar os diffs aprovados e preservar demais servidores.
2. Claude Code: confirmar por /mcp que agent-knowledge oferece 18 tools, depois executar as cinco chamadas.
3. Claude Desktop: reiniciar/recarregar com autorização e executar as cinco chamadas.
4. Registrar saídas de cada cliente individualmente; disponibilidade via SDK não substitui essa evidência.

## Proposta de equipe Maestri — não provisionada

Coordenação inicial realizada por Codex nesta sessão. Sem criação de novos papéis persistentes ou agentes; assim o diretório .maestri fora das três pastas permanece sem mudanças desta missão.

| Papel | Codinome proposto | Escopo inicial | Registro | Limite |
|---|---|---|---|---|
| Orquestrador | Codex (existente) | entender demanda, planejar, integrar e registrar | main-agent implemented no registro; esta sessão é o coordenador do canvas | até 60 turnos / 60 min / 2 retries conforme spec |
| Verificação | Crivo | leitura e execução autorizada de verificações; não editar arquivos | qa-validator planned | 15 turnos / 15 min / 1 retry |
| Revisão | Vigia | revisão independente de diff e evidências; não editar arquivos | reviewer planned | 20 turnos / 15 min / 1 retry |
| Pesquisa, sob demanda | Prisma | fontes e contexto mínimo da demanda | researcher planned | 25 turnos / 20 min / 2 retries |

A proposta não atribui modelos concretos aos tiers: os presets disponíveis não informam esse mapeamento. Não alterar modelos/contas sem necessidade. Recrutar somente diante de tarefa real independente e após aprovação da ativação do papel planned. Nenhum agente builder proposto para ativação nesta rodada.

Workflow proposto: demanda → critério de aceite → plano/especialização → aprovação dos papéis planejados → handoff com dono por arquivo e orçamento → execução → validação independente → entrega com evidências. Até quatro agentes simultâneos neste runtime, incluindo coordenador, ainda que o desenho da KB cite seis filhos.

## Pendências e próximos passos

1. Leitura pontual dos quatro arquivos externos: autorizada e concluída; diffs exatos preparados e validados em memória em [[Integracao-Clientes-2026-10-29-diffs]].
2. Aprovar os diffs exatos antes de qualquer edição de cliente, conforme regra explícita do Pedro.
3. ~~Node do Hermes~~ — cancelado: Hermes fora do escopo do ecossistema do Pedro.
4. Validar cada cliente com as cinco chamadas e atualizar esta nota.
5. Aprovar ativação dos papéis de revisão/validação se desejar recrutamento agora; provisionar apenas os necessários. Builder continua planejado.
6. Manter pendentes, sem resolver: divisão de agent_selection_score; quatro SKILL.md ausentes; EVO-01..10. Skills fora da KB não foram auditadas.

## Alterações desta missão

- Criado este relatório com saídas observadas, propostas de configuração e equipe.
- Criado JSON de configuração local restrita, validado via SDK.
- Atualizado CHANGELOG.md da KB.
- npm install/build/test atualizaram apenas artefatos locais do MCP conforme execução solicitada; nenhuma alteração intencional no código-fonte do MCP.
- Nenhum diff de cliente ou Compose aplicado.

