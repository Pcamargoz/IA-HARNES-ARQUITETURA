---
title: Agent Knowledge Integration
type: governance
status: active
updated: 2026-10-29
tags: [harness, agent-knowledge, integration]
---

# Agent Knowledge Integration

## Scope and authority

Target: this Harness-Architecture vault. Agent-Knowledge-MCP is a local read-only stdio source; hermes-vault remains unchanged. Hermes Agent, Docker, other harness projects, credential files and TRADERS FAKALUM notes are excluded.

Approval: Pedro approved the integration plan on 2026-10-29. Decision: [[Governance/decisions#ADR-012 — Agent Knowledge integration and canonical registry]].

## Acceptance checklist

- [x] Existing client registrations inspected and retained without duplicates.
- [x] SDK connection to MCP 0.3.0: 22 read-only tools; four requested calls succeeded.
- [ ] Four native Claude Code calls verified by tool-use/tool-result events.
- [ ] Four Claude Desktop chat calls verified in its own interface.
- [x] Updated Harness documentation and validator checked; 9 hook contracts passed (native invocation pending).
- [ ] Three real task baselines collected; no savings claimed before measurement.
- [ ] Real CLI adapter delegation independently validated (separate experiment).

## Retrieval sequence

1. Load [[HOME]], [[AGENTS]] and [[HARNESS/HARNESS MAIN/orchestrator-prompt]].
2. Call knowledge_status. Verify cofre includes only AI-Agent-Ecosystem and harness refers to this vault.
3. Use get_orchestrator_policy and get_execution_policy for the relevant section; proposed KB policies do not override the user or accepted Harness contract.
4. Discover with search_knowledge; read outlines and get_document heading before full documents.
5. For delegation, use list_registered_agents then get_agent_specification; use list_agent_adapters as evidence with its manifest timestamp, not live authentication.

## Runtime gates

CLI discovery does not prove login, read-only enforcement, adapter execution or successful delegation. The current CLI adapters remain spec-only. No automatic provisioning, model experiment or third-party adoption is triggered by loading this document.

## Rollback

Revert integration commits individually. Existing MCP registrations and hermes-vault need no rollback because this integration does not change them. Disable only this project's hooks as described in [[Security/runtime-policy]]. Preserve user changes and collected evidence.

## Verified integration evidence (2026-10-29)

- Registry validator passed: 13 canonical KB specs (1 implemented, 7 planned, 5 conceptual), five integration notes, no errors.
- Hook/receipt contract suite: nine tests passed; no agent invoked.
- Restricted real-vault suite: one passed, zero failures, one full-Cofre scan deliberately skipped. MCP indexed 227 documents with zero parse warnings and served all 22 tools.
- Native Claude Code attempt reached the API but returned HTTP 429 usage_limit_reached before any requested tool call. Evidence: Agent-Knowledge-MCP/validation-output/claude-native-integration.jsonl. Do not retry until quota is available.
- Desktop chat and actual client hook invocation remain unverified; this session has no native Desktop UI control.
- SHA-256 read-back confirmed all five preexisting user files unchanged. No .mcp/ or .mcp.json changes.
- Complete current report: cofre:AI-Agent-Ecosystem/08-Implementation/Validation-Results/Integracao-Clientes-2026-10-29.md.

## Native orchestration activated (HARNESS-BOOT-001)

Pedro authorized operation here on 2026-10-29. Codex is the current Maestri maestro; Lince performs independent review and Prumo technical validation, using the existing Codex preset/account with a read-only sandbox. The Harness Operação canvas note tracks the workflow. Reuse the team before recruiting more; no background task generator or polling loop is started.

Prumo called the four required tools through the actual Codex MCP surface, not an SDK process: knowledge_status, get_orchestrator_policy, get_runtime_architecture and list_agent_adapters. All succeeded. Native retrieval in these new Codex sessions is therefore tested; the already-running maestro session still retrieves through its SDK bridge because its tool inventory cannot be hot-reloaded by a config edit.

The project .codex/config.toml is versioned, and codex mcp get agent-knowledge --json run from the Harness directory confirms the restricted registration. User-scope MCP entries and hermes-vault remain unchanged.

Lince completed two review rounds. Fixes address secret globs, relative symlink resolution, runtime telemetry parent resolution, shutdown IPC and a multiline-command bypass. Coordinator regression suite: 12 passed. Prumo separately reported two initial fixture errors caused by its read-only sandbox; the coordinator reran both successfully in the authorized environment. Independent targeted verification of the final multiline case is recorded with the workflow evidence.

Canonical role specs reviewer and qa-validator have real native execution evidence; their transport is maestri-native-codex. All seven CLI AgentPort adapters remain spec-only. There is no claim that a Markdown role, CLI installation, native session and AgentPort implementation are interchangeable.

Tokens, USD cost, comparative savings and three-task baseline remain unmeasured. Claude Code remains blocked by its previously observed quota limit; Claude hook invocation and Desktop chat are not proven by this Codex workflow.

## Ready for feature work

Pedro requested prioritizing implementation and a ready development team over additional bootstrap validation. Codex coordinates and implements; existing Lince/Prumo roles provide independent review and acceptance validation. Reuse them; provision builders for the approved code repository when supplied. Do not infer a target repository or expand the original exclusions.

HARNESS-BOOT-001 evidence: Agent-Knowledge-MCP/validation-output/harness-bootstrap-001.json. Native Codex MCP retrieval is proven. Twelve hook regressions and 46 MCP fixture tests passed at the coordinator; two MCP tests are deliberately skipped. Independent post-final-fix verification remains pending: the native validator could not execute its final probes because of temporary-file restrictions and IPC escape translation. No further validation loop was started. Claude Code quota, Claude-hook invocation, Desktop chat, AgentPort adapters and comparative token baselines remain separate open evidence.
