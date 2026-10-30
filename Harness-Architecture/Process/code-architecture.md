---
title: Code Architecture
type: process
status: active
updated: 2026-10-20
tags:
  - hermes
  - architecture
  - engineering
---

# Code Architecture

## Principle

Readable, predictable code organized by **responsibility**, not by accident. The structure must make it obvious where each thing lives and what depends on what.

## Default structure (application)

```
src/
├── domain/          # entities, rules, contracts (no I/O)
├── application/     # use cases, orchestration
├── infrastructure/  # database, external services, adapters
├── interfaces/      # HTTP, CLI, events
└── shared/          # cross-cutting utilities
```

Adapt to the project — do not impose layers where they add nothing. The rule is: **dependency points inward**.

```
interfaces → application → domain
infrastructure → application/domain (via contracts)
```

## When to use REST

REST is the default for HTTP APIs:

- resources named by noun (`/orders`, `/orders/{id}`);
- HTTP verbs with correct semantics;
- status codes that reflect the result;
- pagination, filtering, and versioning defined up front.

If the flow is purely action-oriented and REST distorts the model, a documented exception is acceptable.

## Package organization

| Criterion | Rule |
|---|---|
| Name | business noun, singular (`order`, `billing`) |
| Boundaries | one package = one responsibility |
| Exposure | explicit public API per package |
| Cycles | forbidden |

## Standards

- Consistent naming across the project.
- Errors treated explicitly, never swallowed.
- Validation at the boundary; domain rules in the domain.
- No business logic in the controller.
- Tests close to what they protect.
- Dependencies injected, not globalized.

## Documentation

- README with run instructions.
- ADR for structural decisions.
- Contracts (OpenAPI/types) updated with the code.
- Comments explain "why", never "what".

## Review checklist

- [ ] Responsibility is clear per module.
- [ ] There are no dependency cycles.
- [ ] Errors and edge cases are handled.
- [ ] Public contracts are documented.
- [ ] Tests cover the critical path.
- [ ] There is no dead or duplicated code.

## Language and framework

Follow the project's existing stack. Do not introduce a framework, ORM, or library without need and without a decision. When creating a new project, prefer the stack already known by the team.

## Project types

| Type | Emphasis |
|---|---|
| API | contracts, validation, observability |
| Automation | isolation, retry, logging |
| Data | lineage, idempotency, schema |
| Frontend | state, accessibility, performance |

## Anti-patterns

| Anti-pattern | Effect |
|---|---|
| God class | untestable, unreadable |
| Business logic in the controller | duplication, coupling |
| Premature abstraction | useless complexity |
| Layer with no purpose | noise |
| Dependency in the wrong direction | fragile domain |

Related: [[Process/code-review]], [[Process/spec-driven]], [[Process/design-patterns]].
