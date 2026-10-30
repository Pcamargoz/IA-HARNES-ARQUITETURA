---
title: "Inventário do ambiente (auditoria somente leitura)"
type: inventory
status: active
verified_at: 2026-10-29
updated: 2026-10-29
tags: [ai-agent-ecosystem, inventory, audit]
---
# Inventário do ambiente (auditoria somente leitura)

Auditoria feita em 29/10/2026 no Mac do Pedro (Intel). **Nada foi alterado** em nenhum cofre. Notas com credenciais foram identificadas pelo nome e **não foram lidas nem copiadas**.

## Máquina
| Item | Valor observado |
|---|---|
| Node | v22.23.2 via nvm (npx e npm 10.9.8) |
| Python | 3.9.6 do sistema; **sem `uv`** |
| Hermes Agent | **fora do escopo do ecossistema do Pedro** (29/10/2026). Container e rede removidos do Docker pelo Pedro; a imagem ficou. Não é cliente nem alvo de integração |

## Cofre do Pedro (`~/Downloads/Cofre do Pedro`)
- **485 notas .md** (antes desta KB). Plugins da comunidade: table-editor, Excalidraw, Tasks; core: bases, properties, templates, sync; `alwaysUpdateLinks: true`.
- Raiz: `Bem-vindo.md`, [[CLAUDE]] (convenções), [[Índice de Projetos]], `TRADERS FAKALUM.md`, imagens.
- Pastas: `Skills para main agents/` (22 SKILL.md + [[Skills para main agents/Índice das Skills|Índice das Skills]]), `Estudos/` (Spring boot + IA, Spring boot microservices YT, Spring microservices roadmap, System Design), `Projetos/` ([[Control Free]], [[Hermes Agent no Docker]], [[Reserva de Mesas - Microservices]], TRADERS FAKALUM), `Referências de design/`, `_Templates/` (Projeto.md + Excalidraw).
- `MCPS,PLUGINS,REPOS - MAIN AGENT/` existe e está **vazia** — lugar natural para um link a esta KB (proposta, não feito).

### Convenções do CLAUDE.md
Uma nota por projeto a partir de `_Templates/Projeto.md`, ligada em Ativos no Índice de Projetos; manter Estado atual / Próximos passos / Log de sessões; Decisões com data e motivo; links `[[ ]]`; escrever em português. O contexto do Reserva de Mesas só é editado pelo agente “Consultor de contexto” (Protocolo de Contexto). No Control Free, o fluxograma é mantido pela Bussola via script.

### Frontmatter
Chaves mais comuns: `tipo` 269, `tags` 253, `criado` 245, `projeto` 243, `fontes` 139, `categoria` 130, `prioridade` 129, `verificado` 84, `status` 82, `custo` 81, `auth` 81, `embarcavel` 81, `autor` 58, `data` 50, `name` 48. Template de projeto: `tipo: projeto, status: ativo, criado, tags: [projeto]`.
→ Esta KB usa chaves em inglês (alinhadas ao Harness e ao pedido do Pedro). Divergência registrada em [[ADR-005-Frontmatter-Padronizado]]. O MCP lê as duas (`type`/`tipo`, `category`/`categoria`).

### Links
2.177 wikilinks para 402 alvos distintos; ~86 alvos parecem quebrados na heurística (muitos são embeds de imagem, texto tipo CSV ou “crie um link”). Não corrigido (fora do escopo; proposta no relatório).

### Duplicidades encontradas
- As 22 skills existem em `Skills para main agents/` **e** em `Projetos/Reserva de Mesas - Microservices/Skills para agents/`; `java-spring-backend-senior/SKILL.md` **difere** entre as cópias. Índice das Skills também duplicado.
- 5 arquivos `CLAUDE.md`; arquivos de handoff do TRADERS repetidos (00 - Como usar, checklist-aceite, telas, componentes).
- O MCP indexa só `Skills para main agents/` para evitar resultado duplicado.

### Skills (Índice das Skills)
22 skills no formato agentskills.io, lidas pelo Claude Code (Hermes fora do escopo do ecossistema do Pedro). Mapa agente→skills: Tech Lead, Back end sênior Java, Engenheiro de dados, Front end design, Consultor de contexto, Colaborador Hermes. Stack: Spring Boot 4.1.1, Spring Cloud 2025.1.3, Java 21, React 19. A skill [[Skills para main agents/hermes-agent-operacao/SKILL|hermes-agent-operacao]] registra Context7 e Figma conectados no Hermes desde 2026-09-20 e `memory_char_limit 8000`.

### Itens sensíveis (não lidos, não indexados)
- Duas notas em `Projetos/TRADERS FAKALUM/` cujos nomes indicam chaves de API.
- Arquivos `.env` citados na skill de operação do Hermes (fora do Cofre; Hermes fora do escopo).
O MCP bloqueia por padrão nomes de arquivo com `chave`, `senha`, `password`, `secret`, `segredo`, `credencia`, `api key`, além de qualquer pasta oculta.

### Ideias de origem
[[Estudos/System Design/Gestao melhorada de subgents|Gestão melhorada de subagents]] (Excalidraw): Hermes, Skills (oh my hermes, orquestração), Claude, Cursor/Grok; definir modelos para tarefas pesadas vs. corretas e aplicar melhoria de tokens com a arquitetura do Harness. [[Estudos/System Design/Design System de ia|Design System de IA]] também é desenho.

## Harness-Architecture (`~/Downloads/Harness-Architecture`)
Vault Obsidian em inglês + repositório git. 44 notas .md fora de `.mcp/` e `video-engine/` (62 no total). Último commit `e58744d` (video engine v6); anteriores: web-context MCPs + hermes-vault 0.3.1, PRs de RAG.
- Núcleo: `AGENTS.md` (contrato global, níveis de contexto L0–L3, papéis, fluxo Understand→Specify→Plan→Execute→Validate→Deliver→Record, escrita só em `Inbox/`, mudanças exigem ADR), `HOME.md`, `HARNESS/HARNESS MAIN/{architecture,main-agent,orchestration}.md`, `HARNESS/LLM MODELS/{ide-harness,models}.md`.
- Áreas: Agents, Governance (ADRs 001–011, padrões de documentação), Memory Agents, Metrics, Optimization (catálogos de MCP, plugins, repositórios, skills; token-strategy; delegation-cost), Process, Security, Knowledge (backend-java-spring, specialists, video-engine).
- MCP próprio **hermes-vault v0.3.1** (`.mcp/`, Node .mjs): 13 tools (`vault_index`, `vault_search`, `vault_retrieve`, `vault_read`, `vault_outline`, `vault_list`, `vault_links`, `vault_query`, `vault_recent`, `vault_health`, `vault_metrics`, `vault_write`, `vault_commit`), escrita desligada por padrão (`VAULT_ALLOW_WRITES=0`), busca lexical, **um vault só**.
- `.mcp.json`: hermes-vault (stdio), playwright (`@playwright/mcp@0.0.83 --isolated --headless`), firecrawl (HTTP).
- Padrões: `type` ∈ index|governance|architecture|process|catalog|metrics|security|guide|reference|policy|bootstrap; `status` ∈ draft|active|deprecated|reference; nomes kebab-case em inglês; notas de 60–250 linhas.
- Análise detalhada: [[Current-Architecture]].

## Harness-Arquitetura-Flow (`~/Downloads/Harness-Arquitetura-Flow`) — só referência
112 notas .md; orientado a Windows (scripts `.ps1`: instalar, atualizar, empacotar-equipe), `config.yaml`, `mcp-server/` em **Python** (pyproject + uv.lock), `conhecimento/`, `harness/`, `treinamentos/`. Contexto Faktory Flow. Não foi usado como base; serviu de comparação para a escolha de linguagem do MCP ([[ADR-002-MCP-em-TypeScript]]).

## Lacunas observadas
Sem MCP de contexto de código Java · busca só lexical · métricas manuais · modelos reais não preenchidos em `models.md` · nenhum acesso cruzado entre os dois vaults · Serena, Basic Memory, Spring AI, Java SDK, Headroom e LangChain4j ausentes dos catálogos do Harness.
