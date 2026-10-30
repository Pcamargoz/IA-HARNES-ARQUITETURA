---
title: Back-end Operating Notes (Java/Spring and Node APIs)
type: guide
status: active
updated: 2026-10-20
owner: Back-end 1 - Chef A
tags:
  - hermes
  - knowledge
  - backend
related:
  - "[[Process/code-architecture]]"
  - "[[Security/permissions]]"
---

# Back-end Operating Notes

For a Builder or Reviewer that touches an API, auth, or a database. Read [[AGENTS]] and your role in [[Agents/roles]] first, then this note, then stop. The structure rules live in [[Process/code-architecture]]; this note does not repeat them.

## 1. API contract

- REST resources are plural nouns. Verbs only for real actions (`POST /conversations/{id}/claim`).
- Every error is RFC 9457 Problem Details: `type` (a stable URN), `title`, `status`, `detail`. Never return a stack trace, SQL, or the raw driver message.
- Validate input at the edge with one shared schema (Bean Validation on Spring, zod on Node). Reject unknown fields.
- `202 Accepted` for work handed to a queue. `503` when storage cannot write: say nothing was sent and the client may retry.
- Version the contract in `packages/shared` (or the API module); front end and desktop import it, never copy it.

## 2. Authorization and isolation

- Deny by default. Every handler names its roles; a missing annotation is a bug.
- Scope every read and write by the caller (`admin`: all; `supervisor`: own departments; `consultant`: own items). Apply the scope in the query, not after loading.
- Out of scope, not found, and malformed id return the **same** `404` body. A different status or text leaks that the record exists.
- Use `403` only when the caller can already see the resource but may not do that action.
- Use short-lived access tokens and rotating refresh tokens stored as hashes; reusing a refresh token revokes its whole token family.
- Hash passwords with Argon2id (or bcrypt with cost ≥ 12). Throttle login per account and per IP.

## 3. Persistence

- Schema changes only through migrations (Flyway/Liquibase on Spring, Prisma migrate on Node). Never `ddl-auto=update` outside a throwaway local run.
- Parameterized SQL only. No string concatenation, including `ORDER BY` and `LIMIT`.
- Concurrency on a shared item: one conditional `UPDATE ... WHERE status = 'waiting'` and check the row count. The loser gets the same `404` as above.
- JPA: entities stay inside the service layer; controllers return DTOs. Watch N+1 (`@EntityGraph` or a fetch join). `open-in-view=false`.
- One transaction per use case. Do not call the network inside a database transaction.

## 4. Integrations and queues

- Each external provider sits behind one port (interface). Adapters: `none` (default), `fake` (tests only, refused in production), real provider.
- Write the outbound record first, then enqueue. If linking the record to its queue item fails, retry a few times with backoff and log; do not ask the user to resend.
- Webhooks and events are idempotent by a provider message id.

## 5. Logs and secrets

- Log the error name and code (`DatabaseError (23514)`), the request id, and internal ids. Never the raw message, phone numbers, tokens, or payloads.
- Secrets come from the environment or a secret store. `.env`, session folders, and keys never enter a commit, a package, or an archive.
- Run `gitleaks` before every commit, with no allowlist added to make it pass.

## 6. Spring Boot defaults

- Constructor injection, `final` fields, no field `@Autowired`.
- `@ConfigurationProperties` with validation for config; fail at startup on a missing required value.
- Spring Security: stateless filter chain, CORS from an explicit list, CSRF off only for token APIs.
- `@RestControllerAdvice` maps exceptions to Problem Details (`ProblemDetail` in Spring 6).
- Actuator exposes only `health` and `info` publicly.

## 7. Tests (minimum, run at the end)

Follow the team's final validation step; do not block work in progress. For the back end the minimum is:

1. The CI suite is green, with integration tests against a real database (Testcontainers or a CI service container).
2. One isolation check: a user cannot read another user's item, and the body matches the not-found body.
3. `gitleaks` clean.

## Stop rule

If the answer is not here or in the linked notes, search with the vault MCP. Do not browse the whole vault.
