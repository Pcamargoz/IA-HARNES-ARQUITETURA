---
title: "Métricas de execução"
type: metric-catalog
runtime_component: metrics
status: proposed
---
# Métricas de execução

| id | nome | pergunta | unidade | fórmula/fonte | meta | coleta |
|---|---|---|---|---|---|---|
| retry_rate | Retry Rate | quantas tentativas extras? | % | (tentativas − tarefas) / tentativas | < 20% | runtime |
