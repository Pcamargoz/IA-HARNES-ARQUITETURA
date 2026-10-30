---
title: Minimal Validation
type: process
status: active
updated: 2026-10-20
tags:
  - hermes
  - validation
  - quality
---

# Minimal Validation

## Principle

QA does **not** test during implementation. There is a single minimal validation round at the end of the **complete** implementation (the Validate step of Understand → Specify → Plan → Execute → **Validate** → Deliver → Record), capped at **30–40 minutes** and run from a script written in advance. It is **one plan shared by both QAs**.

## During Execute

- CI on every PR: gitleaks and the build **block** the merge; automated tests are **informational** only.
- No human review is required to merge: a PR goes in once CI is green, meaning gitleaks and the build pass. There is no QA gate between commits.
- QA writes the validation script in parallel, so Validate is execution only.

## Blocking rule

Only a failed checklist item blocks a delivery. Everything else goes to the next version's backlog, with severity.

## Checklist

1. **CI** — green on the final `main`: automated tests + gitleaks.
2. **App smoke** — the installer opens; install and open the app, log in, connect to the API, send and receive one message. Fake data only: `5511900000001..99` and `@exemplo.invalid`, or a test number Pedro provides for QR.
3. **Security** — user isolation (a consultant never sees another consultant's conversation; always the same 404) and no secrets in the binaries.
4. **Publication** — sha512 and `latest.yml` match the files; public links open without login.
5. **UI** — axe reports zero violations on new screens in light and dark themes.
6. **Harness** — `npm test` and `check:links` pass; the vault stays read-only.
7. **Version-specific** — e.g. Frans WhatsApp v0.2: QR e2e with the Fake provider (automated, in CI); real WhatsApp pairing with a test number Pedro provides (fake numbers cannot pair); the connection recovers on its own after a restart; license checked for any reused third-party code (e.g. OpenWA, MIT).

## Who runs it

QA A and QA B run the same single plan: they split the items and run them in parallel. Suggested split: QA A → 1, 3, 4, 7; QA B → 2, 5, 6. Adjust per release in the script.

## Report format

```
Status: pass | partial | blocked
Result: one line per checklist item (ok / fail)
Evidence: run link, hashes, short log excerpt
Open items: backlog entries with severity
```

Related: [[Process/workflow]], [[Process/delivery]], [[Process/code-review]], [[Process/loops]].
