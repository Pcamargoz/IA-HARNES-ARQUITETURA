---
title: "Template — handoff"
type: template
status: active
category: orchestration
updated: 2026-10-29
tags: [template, handoff]
---
# Template — handoff

Estende o handoff do Harness (`Templates.md` §2) com dono de arquivos, orçamento e formato de retorno (R3).

```markdown
# Handoff — <id-da-tarefa> → <agente>
Objetivo: <uma frase>
Contexto: <só o necessário; sem dados privados irrelevantes>
Escopo: <o que fazer>
Fora de escopo: <o que não fazer>
Critérios de aceite: <verificáveis, numerados>
Evidência esperada: <teste, arquivo, fonte>
Arquivos que possui: <lista; um escritor por arquivo>
Restrições: <prazo, stack, segurança>
Orçamento: max_turns=<n>, max_retries=<n>, timeout_min=<n>, tier=<alias>
Aprovações: <o que o Pedro já autorizou>
Workflow: <template> · etapa <n>
Retorno: status done | partial | blocked + evidência + itens em aberto
```
