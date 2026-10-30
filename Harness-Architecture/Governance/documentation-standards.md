---
title: Documentation Standards
type: governance
status: active
updated: 2026-10-20
tags:
  - hermes
  - documentation
  - maintenance
---

# Documentation Standards

## Required frontmatter

```yaml
---
title: <human-readable title>
type: index | governance | architecture | process | catalog | metrics | security | guide | reference | policy | bootstrap
status: draft | active | deprecated | reference
updated: YYYY-MM-DD
tags:
  - hermes
  - <area>
---
```

Optional: `owner`, `review_by`, `related`.

`vault_health` (MCP) checks these fields, the allowed values, broken links, orphans, stale `updated` dates, and the size limit below. `Ideas.md` is exempt as the preserved original source.

## Naming

- Files and folders in English, `kebab-case.md`, except established names (`HOME.md`, `AGENTS.md`, `README.md`).
- Acronyms stay uppercase (`HARNESS`, `LLM MODELS`, `MCP`).
- Renames require updating every internal link and the indexes (ADR-007).
- One subject per note. The title describes the content, not the project.
- No new numeric prefixes; ordering comes from indexes.

## Links

- Internal: `[[path/note]]` or `[[path/note|text]]`.
- In tables, escape the pipe: `[[path\|text]]`.
- Every link must resolve (`npm run check:links`).
- Do not link to a note that does not exist "to create later".

## Size and granularity

| Situation | Action |
|---|---|
| < 60 lines, single topic | keep |
| 60–250 lines | normal |
| > 250 lines | split by section |
| Duplicated rule | consolidate at the source and link |
| Orphan note | link it from an index or remove it |

Do not fragment into dozens of 10-line notes: that increases navigation and cost.

## Indexes

Every area has an entry note. The central map is [[HOME]].

When creating a note:
1. add frontmatter;
2. link it from the area index;
3. if structural, update [[HOME]].

## Updates

- Content changed → update `updated`.
- Global rule changed → [[AGENTS]] + ADR.
- Component adopted → matching catalog.
- Decision reverted → superseding ADR, not a silent edit.

## Deprecation

Set `status: deprecated`, explain the replacement, and keep it for one review cycle. Then remove it and fix links.

## What does not belong in the vault

- Secrets, tokens, and credentials.
- Unnecessary personal data.
- Raw conversation transcripts.
- Large binaries.
- Rules duplicated from another place.

## Review

| Frequency | Check |
|---|---|
| Monthly | links, orphan notes, `updated` dates |
| Quarterly | catalogs, metrics, obsolete notes |
| Per change | index + ADR when structural |

## Quality criterion

A note is good when it:
- answers a real question;
- has an owner and a purpose;
- is reachable from [[HOME]] in ≤ 3 hops;
- does not repeat another note;
- can be maintained by someone else.
