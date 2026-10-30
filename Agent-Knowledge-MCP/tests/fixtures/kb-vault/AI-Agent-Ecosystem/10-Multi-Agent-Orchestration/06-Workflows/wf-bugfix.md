---
title: "Workflow — Correção de bug (fixture)"
type: workflow-template
name: wf-bugfix
status: proposed
task_types: [fix]
triggers: [bug, corrigir, erro]
agents: [main-agent, builder]
skills: [java-spring-backend-senior]
autonomy: A2
max_fix_attempts: 3
---
# Workflow — Correção de bug (fixture)

## Etapas
1. Reproduzir
2. Corrigir
3. Teste de regressão
