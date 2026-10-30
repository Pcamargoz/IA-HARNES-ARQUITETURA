---
title: "Model Catalog"
type: model-catalog
status: proposed
snapshot_date: 2026-10-29
review_every_days: 30
---
# Model Catalog

## Cotas
| acesso | limite | ao_esgotar |
|---|---|---|
| claude-code | janela de 5 h | codex |
| ollama | sem cota | — |

## Matriz
| tarefa | id | apelidos | complexidade | primario | fallback | barato_local | dados_max | observacao |
|---|---|---|---|---|---|---|---|---|
| Código Java/Spring | codigo-java-spring | java, spring, backend | moderada | `modelo-a` | `modelo-b` | `modelo-local` | internal | teste |
| Dados sensíveis | dados-sensiveis | segredo, credencial | qualquer | `modelo-local` | nenhum | `modelo-local` | sensitive | só local |

## Regras
```yaml
evaluation_order: [data_class, availability, complexity]
hard_rules:
  - id: D1
    rule: "sensitive só local"
quota_fallback: [claude-code, codex, ollama]
```
