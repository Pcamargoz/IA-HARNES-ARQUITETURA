---
title: Runtime Policy
type: security
status: active
updated: 2026-10-29
tags: [harness, integration, runtime]
---

# Runtime Policy

## Eligibility (EVO-14)

A delegation is eligible only when the agent is implemented, its adapter has passed an authorized real execution, current authentication is confirmed through an official status command (or explicitly not applicable for a local tool), required capabilities are supported, and the task has permission/context/timeout budgets. CLI installed, role defined, login detected and adapter implemented are distinct facts.

The present CLI adapters are spec-only. This integration does not promote or automatically launch them. ProcessAdapter.init checks version, not authentication; the coordinator must check the latter separately. Do not open credential files. Unknown login is not confirmation.

Default permission mode is read-only. Approved workspace writes require a supported, tested adapter mode and an explicit set of owned paths; no silent privilege expansion. A lower client concurrency/depth limit overrides the six-child/two-level policy.

## Project-local guards (EVO-10)

`.claude/settings.json` invokes `automation/claude_hook.py` on PreToolUse. It denies excluded paths, asks for canonical writes outside the approved roots, and routes external/irreversible or opaque shell operations through the client's permission review. Known read-only agent-knowledge and hermes-vault calls retain the normal client permission flow. No server configuration is modified.

`HARNESS_ORCH_DISABLE=1` denies new native delegations and recognized agent launches through shell commands. Literal maestri list/check, note read and report-back to HARNESS_COORDINATOR (default Codex) remain available; compound shell code and substitutions are never treated as passive IPC. It never disables permission checks. A user-approved canonical write scope can be supplied at launch with HARNESS_APPROVED_WRITE_ROOTS (absolute paths separated by the platform path separator); agents must not enlarge it. User approvals already granted remain authoritative; carry them into the client scope rather than requesting them repeatedly.

The hook is a client guard, not a sandbox or a complete shell effect analyzer. Unknown shell execution requires review. Other clients need their own permission integration; do not claim this hook protects Codex, Desktop chat or every external process. Start a new Claude Code session after changing hooks, then verify behavior.

## Exclusions

Never read .env, credential files or TRADERS FAKALUM notes. Do not configure/start Hermes Agent or access its configuration. Harness-Arquitetura-Flow is not an integration target. Do not broaden the approved KB allowlist.

## Source and rollback

Hook schema: https://code.claude.com/docs/en/hooks (consulted 2026-10-29); local CLI: Claude Code 2.1.312. Settings use command hooks with a five-second timeout. Guard failure returns exit 2 and a content-free diagnostic.

Rollback: remove only this integration's hook entries from this project's .claude/settings.json and restart the client. Revert the corresponding commits for documentation/code. Leave global settings, agent-knowledge registrations and hermes-vault unchanged. Disable new delegation with HARNESS_ORCH_DISABLE=1 while investigating; do not disable security to continue work.

## Supervised native Maestri activation

Pedro explicitly authorized activation here on 2026-10-29 (ADR-013). The first bounded workflow provisions two role instances through the installed Maestri/Codex native client, using its existing account/model and read-only sandbox. This is a supervised native transport, not a ProcessAdapter execution or a promotion of the spec-only Codex AgentPort adapter. Normal future reuse requires role execution evidence; approval to provision this first validation was recorded before launch.

Project Codex MCP configuration is in .codex/config.toml. Run Codex from this trusted project directory to load it; already-running sessions do not gain tools automatically. Native child launches also carry the restricted MCP arguments explicitly. No global MCP entry, account or model was changed.

The guard inspects secret globs and resolves relative paths against the event cwd before exclusions. Both telemetry writers validate resolved destinations against both vaults, including symbolic-link parents. These checks complement client restrictions; they are not a claim of complete adversarial filesystem isolation.
