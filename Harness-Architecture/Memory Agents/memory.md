---
title: Memory
type: architecture
status: active
updated: 2026-10-29
tags:
  - hermes
  - memory
---

# Memory

## What memory is (and is not)

Memory is the set of **durable facts** an agent can retrieve across sessions. It is not the conversation history, not the full vault, and not a place to dump everything.

| Is memory | Is not memory |
|---|---|
| stable preference ("use TypeScript") | "the user said hi" |
| decision with reason | intermediate reasoning |
| project constraint | file contents |
| recurring convention | one-off command output |

## Layers

| Layer | Content | Where |
|---|---|---|
| **Contract** | global rules | [[AGENTS]] |
| **Structural** | decisions, glossary, standards | [[Governance/decisions]], [[Governance/glossary]] |
| **Knowledge** | processes, catalogs, guides | area notes |
| **Operational** | specs, deliveries, task logs | project/`Inbox` |
| **Ephemeral** | conversation, scratch | not persisted |

## What to store

Store when all are true:
1. it will still be true next week;
2. it changes a future decision;
3. it is not already written in the vault.

Do not store:
- secrets, tokens, passwords;
- unnecessary personal data;
- raw transcripts;
- guesses presented as facts;
- content that already exists in a note (link instead).

## Minimum schema

```yaml
fact: <one sentence, declarative>
scope: global | area | project
source: <how it was verified>
date: YYYY-MM-DD
expires: YYYY-MM-DD | never
```

## Lifecycle

```
capture → validate → store → retrieve → review → expire/correct
```

- **Capture:** at the moment of the decision, not "later".
- **Validate:** confirmed by the user, test, or source.
- **Store:** in the right layer, with a link.
- **Retrieve:** by search, not by loading everything.
- **Review:** monthly for operational, quarterly for structural.
- **Expire:** outdated memory is worse than no memory.

## Conflicts

| Situation | Rule |
|---|---|
| New fact contradicts old | prefer the most recent **and** more specific |
| User changed preference | overwrite, note the date |
| Two notes disagree | fix the source; do not keep both |
| Uncertain fact | mark `unverified`; do not use as a premise |

## Privacy

- Classify before storing: public, internal, restricted.
- Restricted data stays out of the vault unless strictly necessary.
- Never reproduce secrets in logs, notes, or answers.
- See [[Security/permissions]].

## Memory quality

| Indicator | Target |
|---|---|
| Duplicated facts | 0 |
| Facts without source | 0 |
| Expired facts in use | 0 |
| Retrieval time | < 1 s (local MCP) |

## Example

```yaml
fact: The user prefers short, direct answers in Portuguese.
scope: global
source: explicit instruction
date: 2026-10-19
expires: never
```

Do not store what is already in [[AGENTS]]. Store what is specific and durable.

## Shared memory adoption gate (M7)

Basic Memory remains a candidate until E2 is authorized and passes in a dedicated directory outside this vault. Required record fields: fact, scope, source, date, expires; retrieval must preserve provenance and surface conflicts. Do not silently copy notes, credentials or private project content. The current vault write policy is unchanged. A successful MCP knowledge query is not proof of shared writable memory across clients.
