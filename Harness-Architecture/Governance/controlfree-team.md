---
title: ControlFree Development Team
type: governance
status: ready-awaiting-user-go
updated: 2026-10-29
tags: [harness, controlfree, orchestration]
---

# ControlFree Development Team

## Gate and scope

Pedro authorized team configuration and contextualization only. No feature implementation, compilation, tests, application startup, database changes, migration promotion, dependency installation, git branch change, commit or push in ControlFree_Api before his next explicit OK. No agent edits feature code during onboarding. Existing user work is preserved.

Target: /Users/macbook/Downloads/ControlFree_Api.
Business specs (read-only): /Users/macbook/Downloads/Cofre do Pedro/Projetos/Control Free/Specs - Analises ControlFree WhatsApp.
Harness: /Users/macbook/Downloads/Harness-Architecture.

Never read .env, credential files or TRADERS FAKALUM notes. Hermes Agent, hermes-docker, ~/.hermes, the Flow harness and other projects remain excluded. Existing MCP registrations are preserved. Agent-knowledge exposes KB/Harness; ControlFree specs are read directly from the explicit authorized directory, without broadening its shared allowlist.

## Native team

| Terminal | Client | Responsibility |
|---|---|---|
| Codex (current maestro) | current Codex | task intake, dependencies, ownership, token/context budget, hot-file coordination and consolidation |
| Cedro | Claude Code | CC critical path: commercial model, gain/project flow and contracts; no autonomous expansion to other waves |
| Nexo | Codex | AUX: WhatsApp, entry/forms, duplicates and hours; only the bounded slice assigned after approval |
| Lince | Codex | independent final code review, no writes, maximum two rounds |
| Prumo | Codex | acceptance scripts, isolation/migration checks and final validation; no writes during onboarding |

Claude Code availability is separate from configuration: its last API attempt reported usage_limit_reached. No other account or model is substituted silently. If still blocked, report it before assigning the CC critical path.

## Minimal onboarding context

1. Harness HOME.md, AGENTS.md, HARNESS/HARNESS MAIN/orchestrator-prompt.md.
2. API claude/CLAUDE.md (canonical project engineering instructions).
3. Specs 00-briefing-harness.md and 09-plano-implementacao.md, especially sections 5 (waves), 6 (owners), 7 (coordination), 8 (validation) and 10 (exclusions).
4. Read only the role-relevant sections of 05-controlfree-spec-final.md (CC), 06-whatsapp-spec-final.md (AUX WhatsApp), 07-formularios-duplicados-spec.md (AUX entries/duplicates), 08-contrato-assinatura-spec.md (CC contracts) once an actual delivery is assigned.

## Current observed state

Repository branch: onda-3. Pedro says the team stopped at wave 3. Local uncommitted changes: alerta/model/GatilhoSistema.java and db/pendente/V40__notificacao_de_sistema.sql. Untracked V37__ganho_projeto_expand.sql and V38__ganho_projeto_migrate.sql exist in db/migration. V37/V38 belong to E11/wave 4 in the plan. This is an alignment item, not proof that wave 3 is accepted or wave 4 is authorized.

Wave 3: CC E10 (C1/C2 only if assigned); AUX W5, F3, F4 and D1 only after stable E10. Gate G3 concerns PF/PJ lead, required fields, BANT and card creation.
Wave 4, not released here: CC E11; AUX F2, W6, W7, D2. Do not start it before Pedro accepts the handoff and observed work state.

## Ownership and initiative

One writer per file. CC owns the commercial slice and V31–V40/V60–V62; AUX owns V41–V59 within the documented reservations. The coordinator serializes edits to pom.xml, application configuration, shared/security, Recurso/Limite, migration registration, ArquiteturaTest and docs/openapi.json. Do not edit applied migrations; db/pendente promotion stays numeric and explicit. No parallel Maven processes sharing target/.

Once approved, act autonomously on reversible engineering decisions inside the assigned spec and owned files. Do not repeatedly ask for already-granted scope. Product decisions, broader waves, new dependencies, destructive database actions, deploy and publishing remain separate approvals. Children never delegate or communicate in loops; coordinator resolves dependencies. Prepare small evidence-based fixes, not unsolicited refactors.

## Context and token administration

Keep initial project context to this brief, the engineering entry and relevant plan sections. Do not read all 47 deliveries or entire source trees. Handoff target: up to 2000 words; worker context reference 10–30k tokens, review 4–10k, as soft ceilings, not enforced CLI limits. Request a short coordinator checkpoint before exceeding the scope/context reference. Return paths, changed APIs, risks and concise diagnostics; keep full logs out of model context. Report tokens/cost only when the client supplies usage; otherwise unavailable. Preserve existing client model/account selection. Two active implementation lanes at most; reviewers work at the delivery gate, not continuously.

## Delivery and validation

Follow the plan: spec and one alignment before implementation; no repeated test cycles during feature execution. Each wave ends with the authorized compile/start gates and a prepared validation script; the consolidated validation is planned after wave 6. No database recreation or provider pairing is included in onboarding. Independent code review only at delivery, maximum two rounds. Every claim carries evidence; unverified items stay partial.

After onboarding: each agent acknowledges role, paths, ownership, constraints and open issues, then waits. The maestro summarizes and asks Pedro for OK before resuming development.

## Onboarding outcome

Nexo, Lince and Prumo independently acknowledged the shared brief, API engineering guide and plan sections 5–8; each explicitly waits for Pedro OK. Cedro received the same prompt, but Claude Pro returned its five-hour usage limit before reading; the terminal is configured, not available for execution. No account/model switch or claim of successful Claude onboarding is made. Automatic quota continuation was cancelled; the terminal confirms cancellation and remains idle in plan mode.

The four preexisting changed/untracked API source/migration files were checked by SHA-256 and remain unchanged. Only project entry/MCP configuration and local Maestri role state were added. No ControlFree commit, compile, tests, feature edits, application/database startup or wave promotion occurred.

Approval question: may the team first reconcile the existing onda-3 work with gate G3 and the already present E11/V37/V38 files, then return a bounded implementation handoff? This does not automatically release wave 4. If Claude remains quota-blocked, Pedro decides whether to wait or assign a specific slice to Codex; there is no silent substitution.
