---
title: Baseline and Runtime Telemetry
type: metrics
status: active
updated: 2026-10-29
tags: [harness, integration, runtime]
---

# Baseline and Runtime Telemetry

## Baseline F0 (M1)

Collect three comparable real tasks before claiming token or cost savings. The existing [[Metrics/execution-log]] has user edits; this integration leaves it byte-for-byte unchanged. Record approved task summaries there after the user work is reconciled; this note supplies the collection contract.

| Field | Source | Missing value |
|---|---|---|
| task type and acceptance | approved spec | required |
| model/adapter/version | actual client/run | unavailable |
| input/output/cache tokens | client-reported usage | not measured |
| cost and provenance | reported/estimated/unavailable | not measured |
| context | client context report; chars only when actually measured | not measured |
| elapsed time | start/end timestamps | not measured |
| loops, rework, quality | tests and explicit review | not measured |
| MCP/skill used | actual tool events | not measured |

Initial sample count for comparable task baselines: zero. A test suite or a quota rejection is integration evidence, not a successful task baseline. Ratios from the proposal remain hypotheses, not results.

## Metadata-only client collection (EVO-09)

Project Claude hooks record PostToolUse, PostToolUseFailure and SubagentStop to:

`~/Downloads/Agent-Knowledge-MCP/runtime-output/harness-telemetry/events.jsonl`

Schema: akm.orchestration.v1. Stored: timestamp, hashed run/task id, hook event, tool vocabulary and event status. Never prompts, commands, input/output bodies, note contents, transcript paths, credentials or raw session ids. A SubagentStop event is not an independent verifier verdict. No token, cost or duration is inferred from these hook events. Direct smoke checks are not proof that the client invoked every hook.

## Runtime receipt bridge (EVO-13)

After an approved real AgentPort execution, pipe the AgentResult JSON into:

`python3 automation/record_runtime.py`

The utility preserves akm.runtime.v1 status and numeric metrics/provenance, hashes task ids and discards result text, error messages and all unrecognized content. Receipts go to runtime-output/harness-telemetry/runtime.jsonl outside both vaults. The utility does not execute agents and is not an automatic runtime launcher. No runtime receipts are synthesized by installing it.

Summarize only actually recorded receipts in the execution log. Keep subscription quota separate from client-estimated USD. The collector never turns not_executed into done. Automated runtime execution and three-task evidence remain pending.

## Log reduction (M10)

Keep complete test logs outside the model context. Report failing command, exit code, failing case, relevant diagnostic and evidence path. Retrieve more lines only when needed; preserve the original log for diagnosis. Do not install Headroom until F0 shows output size is material and an approved comparison preserves the failure cause.

## Rollback

Remove only the project telemetry hook entries to stop future collection; preserve collected evidence. Revert this contract/bridge in isolated commits. The original execution log and global client configuration are not modified.
