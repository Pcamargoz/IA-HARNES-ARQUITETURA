---
title: "Protocolo de verificação"
type: policy
policy_area: verification
status: proposed
category: orchestration
updated: 2026-10-29
tags: [orchestration, verification]
---
# Protocolo de verificação

Base: R5 + Harness `Agents/roles.md` (Reviewer, 2 rodadas), `Process/minimal-validation.md`, `Process/code-review.md`.

## Regras
- Autor ≠ verificador; verificador sem Write/Edit, em contexto separado.
- Cada critério do handoff: **VERIFIED** (evidência fresca), **PARTIAL**, **MISSING**.
- Bloqueios automáticos: TODO/placeholder, `@Disabled`, `test.skip`/`.only`, stubs, teste não executado.
- Dimensionamento: < 5 arquivos e < 100 linhas → leve; > 20 arquivos ou segurança → completo.
- Máximo 2 rodadas de revisão; depois, reportar ao Pedro.

## Evidência aceita
Saída de `./mvnw test`/`npm test`, `docker compose up` saudável, arquivo gerado com caminho, fonte citada. "Parece certo" não é evidência.
