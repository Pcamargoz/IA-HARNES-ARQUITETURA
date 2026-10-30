---
title: "Template — especificação de agente"
type: template
status: active
category: orchestration
updated: 2026-10-29
tags: [template, agent]
---
# Template — especificação de agente

Baseado em R2 ([[Harness-Recommendations]]); texto próprio.

```yaml
---
title: "<Nome legível>"
type: agent-spec
status: conceptual            # implemented | planned | conceptual
name: <kebab-case-unico>
role: worker                  # orchestrator | worker | reviewer | verifier | researcher | planner | specialist
description: "<uma frase>"
use_when: "<gatilhos>"
avoid_when: "<o que não fazer>"
tier: balanced                # tier0 | small | balanced | frontier (alias; nunca ID datado)
autonomy: A1                  # A0–A4 (Harness Security/autonomy.md)
level: 2                      # 1=lê, 2=escreve, 3=verifica
tools: [Read, Grep, Glob]     # allowlist explícita
disallowed_tools: []          # verificador: [Write, Edit]
skills: []
harness_ref: "<caminho no Harness ou kb:...>"
evidence: "<por que este status>"
budget: {max_turns: 30, max_retries: 2, timeout_min: 20}
owner: pedro
version: 0.1.0
updated: AAAA-MM-DD
tags: [agent]
---
```

Corpo: Missão · Use quando · Não use para · Ferramentas · Skills · Orçamento · Entrada e saída · Evidência do status.

Validação proposta (EVO-02): campos obrigatórios, `name` único, `tools` presente, sem model ID datado, corpo ≤ 8 KB.
