---
title: "Roadmap de implementação"
type: roadmap
status: proposed
updated: 2026-10-29
tags: [ai-agent-ecosystem, roadmap]
---
# Roadmap de implementação

Proposta. Nenhuma fase além da criação desta KB e do [[Agent-Knowledge-MCP]] foi executada. Cada fase só começa com aprovação do Pedro e, quando mudar ferramenta, com ADR.

## F0 — Baseline de custo (semana 1)
- Medir em 3 tarefas reais (ControlFree, Frans/Reserva): `/cost` e `/context` do Claude Code, número de leituras de arquivo inteiro, tempo, testes verdes.
- Registrar em `Metrics/execution-log.md` do Harness (proposta) ou numa nota de experimento aqui.
- **Critério de saída:** 3 medições comparáveis registradas.

## F1 — Serena + Context7 (semana 1)
- Executar [[E1-Serena-Context7-ControlFree]] (Serena em escopo de projeto; Context7 já em uso).
- Pré-requisito: Pedro decidir instalar `uv` (instalação global).
- **Critério:** ≥30% menos tokens com os mesmos testes verdes e RAM < 2 GB.

## F2 — Memória compartilhada (semanas 1–2)
- Executar [[E2-Basic-Memory-Obsidian]] com projeto de memória **separado** do Cofre.
- Conectar o [[Agent-Knowledge-MCP]] (leitura) aos clientes depois da aprovação das configs.
- **Critério:** ≥8/10 fatos recuperados nos 3 clientes, zero conflitos.

## F3 — Harness com subagentes (semanas 2–3)
- Executar [[E3-Superpowers-QA-Frans]]: Superpowers + subagente QA em Haiku.
- Aplicar as melhorias 1–5 da [[Harness-Improvement-Proposal]] (por ADR no Harness).
- **Critério:** ≤2 intervenções humanas, testes verdes, custo ≤ baseline +10%.

## F4 — DevOps e compressão (semanas 3–4)
- [[GitHub-MCP-Server]] via Docker, `--read-only`, toolsets mínimos.
- [[Headroom]] opcional, só se F0 mostrar logs como custo relevante.
- **Critério:** zero escrita não autorizada; economia medida em logs de `./mvnw test`.

## F5 — Domínio como MCP (mês 2)
- Servidor MCP de domínio em [[Spring-AI]] 2.x (Boot 4.x) sobre o [[MCP-Java-SDK]], somente leitura.
- **Critério:** agente responde perguntas de regra de negócio citando a fonte sem ler o código.

## Etapa de orquestração (29/10/2026)
Feito: área [[MOC-Multi-Agent-Orchestration]] (documentação) e 8 tools de leitura no [[Agent-Knowledge-MCP]] 0.2.0, validadas por simulação determinística ([[Validacao-Orquestracao-2026-10-29]]).

## Etapa do runtime universal (29/10/2026)
Feito: área [[MOC-Universal-Agent-Runtime]] e 4 tools de leitura no [[Agent-Knowledge-MCP]] 0.3.0; validação em [[Validacao-Runtime-2026-10-29]]. Execução de agentes reais aguarda aprovação ([[Delegation-Experiment]]).

## Próxima etapa planejada
Fases O0–O5 em [[Orchestration-Roadmap]]. Qualquer mudança no Harness-Architecture segue [[Harness-Evolution-Proposals]] (EVO-01..10, cada uma com reversão) e depende de aprovação do Pedro.
