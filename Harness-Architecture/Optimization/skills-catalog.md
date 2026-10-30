---
title: Skills Catalog
type: catalog
status: active
updated: 2026-10-29
tags:
  - hermes
  - skills
  - catalog
---

# Skills Catalog

Central registry of reusable procedures. A skill is **versioned knowledge**, not a loose prompt.

## Card format

```markdown
## <skill-name>

- **Status:** proposed | active | deprecated
- **Purpose:** one sentence
- **Triggers:** when to use
- **Agents:** who can use it
- **Prerequisites:** tools, access
- **Inputs:** what is needed
- **Steps:** short summary
- **Output:** artifact
- **Success criterion:** verifiable
- **Cost:** tokens/complexity
- **Limitations:** what it does not cover
- **File:** path
- **Last review:** date
```

## Criteria to create

Create only when:

1. the procedure repeated at least twice;
2. the result is predictable;
3. the steps can be written without ambiguity;
4. there is a verifiable success criterion.

Otherwise: note in the area, not a skill.

## Active

Installed in the user scope (`~/.claude/skills/<name>/SKILL.md`), verified on 2026-10-20.

### Hermes core (first wave — all active)

| Skill | Workflow step | Trigger | Output |
|---|---|---|---|
| `vault-context` | Understand | start of a non-trivial task that depends on Hermes rules | minimal L0–L2 context |
| `short-spec` | Specify | feature, 3+ steps, or ambiguous request | spec with acceptance criteria ([[Process/spec-driven]]) |
| `handoff-brief` | Plan | before delegating | go/no-go + brief ([[Optimization/delegation-cost]]) |
| `final-code-review` | Validate | end of a feature or non-trivial fix | findings by severity, max 2 rounds ([[Process/code-review]]) |
| `delivery-report` | Deliver | end of any task that changed files | Status / Result / Evidence / Open items ([[Process/delivery]]) |

### Knowledge HUB (Obsidian) and design

| Skill | Purpose |
|---|---|
| `vault-capture` | capture a URL into the Obsidian HUB |
| `vault-assistant` | broken links, orphans, backlinks, index upkeep in the HUB |
| `auto-tagging` | normalize tags and frontmatter |
| `spark` | synthesize scattered notes into one synthesis note |
| `impeccable` | frontend design, critique, and polish |
| `video-use` | conversational video editing |

For this vault, `vault-assistant` overlaps `vault_health`; prefer the MCP tool here (it reads the Hermes standards directly).

## Candidates

Source: `anthropics/skills` (182k stars, official). Community lists: `travisvn/awesome-claude-skills`, `obra/superpowers`. Some are already bundled in Claude apps as `anthropic-skills:*`.

| Skill | Use when | Note |
|---|---|---|
| `mcp-builder` | extending `.mcp/` or creating a new server | pairs with [[MCP]] §11 |
| `skill-creator` | turning a repeated procedure into a skill | applies the creation criteria below |
| `webapp-testing` | verifying a UI change in a browser | gives the Reviewer evidence |
| `doc-coauthoring` | long specs or ADR drafts | |
| `docx`, `pdf`, `pptx`, `xlsx` | office deliverables | bundled in Claude apps |
| `frontend-design` | UI work without `impeccable` | do not run both on the same task |

## Priority (first wave)

| Skill | Why now | Trigger |
|---|---|---|
| `short-spec` ✅ | prevents rework | feature request |
| `final-code-review` ✅ | standardizes the gate | delivery |
| `vault-context` ✅ | reduces cost | start of any task |
| `handoff-brief` ✅ | improves delegation | delegating |
| `delivery-report` ✅ | standardizes output | end of task |

✅ = active. Second wave is decided by [[Metrics/scorecard]], not by enthusiasm.

"Prevents rework" and "reduces cost" come before "adds capability".

## Anatomy of a good skill

- **Name** that says what it does.
- **Trigger** that is specific (not "any task").
- **Inputs** and **outputs** explicit.
- **Steps** in imperative order.
- **Success criterion** verifiable.
- **Limits** declared.

## Lifecycle

```
proposed → active → under review → deprecated
```

- Active: used and referenced.
- Under review: failing or outdated.
- Deprecated: replaced; keep one cycle for links.

## Anti-patterns

| Anti-pattern | Problem |
|---|---|
| Skill for a one-off case | maintenance without return |
| Skill that is a 2-line prompt | no value |
| Skill without a criterion | cannot be validated |
| Duplicated skill | divergence |
| Giant skill | impossible to maintain |

## Where to store

- Description/card: this note.
- Full procedure: skill file in the agent/client skill folder.
- When the vault MCP supports writes, drafts go to `Inbox/` first.

## Review

Quarterly: is it still used? does it still work? can it be merged into another?

Related: [[Optimization/mcp-catalog]], [[Optimization/plugins-catalog]], [[Optimization/repositories-catalog]], [[Templates]].

## Workflow mapping and adoption gate (M6)

Superpowers remains a candidate process source; it is not installed by this integration. Map a selected procedure to the existing Understand/Specify/Plan/Execute/Validate/Deliver stages and choose one procedure per need. Do not run duplicate spec, review or delivery workflows.

Before any active skill claim, confirm the SKILL.md exists in the selected client and its scope is approved. The current agent-knowledge configuration intentionally exposes only AI-Agent-Ecosystem, so it does not prove availability of skills outside the KB. Historical active listings above need a separate installation audit. E3 must pass before promoting a Superpowers-based executor.
