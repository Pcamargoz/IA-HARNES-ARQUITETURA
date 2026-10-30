---
title: "Roadmap da orquestração"
type: roadmap
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, roadmap]
---
# Roadmap da orquestração

Cada fase depende de aprovação do Pedro. Status em 29/10/2026.

| Fase | Entrega | Critério de saída | Status |
|---|---|---|---|
| O0 | Pesquisa importada + desenho nesta pasta + 8 tools de leitura + simulação | testes verdes e simulação com telemetria | **feito** (ver [[Validacao-Orquestracao-2026-10-29]]) |
| O1 | Baseline real: 3 tarefas com execution-log preenchido (tokens, tempo, loops) | 3 linhas comparáveis | pendente (F0 do [[Implementation-Roadmap]]) |
| O2 | EVO-01 prompt curto + EVO-03 contrato de delegação no Harness | tokens fixos medidos antes/depois | aguarda aprovação |
| O3 | EVO-02 registro com validador; 4 agentes (planner, spring-boot-implementer, verifier, researcher) como subagentes reais do Claude Code | 1 feature Spring Boot pelo pipeline R4 com ≤ 2 intervenções | aguarda aprovação |
| O4 | EVO-09 telemetria JSONL via hook; EVO-10 HITL/kill switch | 100% das tarefas com evento `task_completed` | aguarda aprovação |
| O5 | Adaptadores do registro para Claude Desktop (só skills) e outras CLIs detectadas (via [[MOC-Universal-Agent-Runtime|Universal Agent Runtime]]); Hermes fora do escopo do ecossistema do Pedro | mesmo agente descrito em vários clientes | ideia |
