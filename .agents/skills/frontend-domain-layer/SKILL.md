---
name: frontend-domain-layer
description: "Use when modeling or refactoring the frontend business layer in this Expo app: client bounded contexts, domain entities, use-cases, gateways, adapters, selectors, RTK Query APIs, runtime state, typed application errors, and Result contracts under core/. Use it for frontend capabilities, domain refactors, data-boundary decisions, backend error mapping, or migrating a bounded context to the shared error system. Do not use it for backend/server domain modeling, database schema design, server APIs, screen layout, component styling, or presentation-only extraction."
---

# Frontend Domain Layer

Use this skill when the task is mainly about the app's frontend business layer under `core/`.

## Goals

- Keep frontend business concepts explicit and stable.
- Model actions as named use-cases.
- Depend on contracts, not concrete infrastructure.
- Provide clean facades for screens and frontend UI consumers.

## Workflow

1. Read [domain.md](references/domain.md) to align on what belongs in the domain model.
2. Read [use-cases.md](references/use-cases.md) for business action modeling and folder structure.
3. Read [error-management.md](references/error-management.md) whenever an operation can fail, an infrastructure error must be mapped, an RTK Query error contract changes, or a bounded context is migrated to typed `Result` values.
4. Read [gateways.md](references/gateways.md) and [adapters.md](references/adapters.md) for data-boundary decisions.
5. Read [authenticated-adapters.md](references/authenticated-adapters.md) when adapters need credentials, a current session, or protected and public operations sharing one transport client.
6. Read [selectors.md](references/selectors.md), [apis.md](references/apis.md), and [runtime-state.md](references/runtime-state.md) for read models, facades, and state alignment.
7. Read [paginated-queries.md](references/paginated-queries.md) when a bounded context exposes a paginated list, history, feed, catalog, or any multi-page retrieval flow.
8. Read [normalized-collections.md](references/normalized-collections.md) when a bounded context owns a durable collection keyed by id.
9. Read [use-case-tests.md](references/use-case-tests.md) when adding, refactoring, or reviewing behavior specs for `core/<bounded-context>/use-cases`.
10. Return a concrete design: frontend bounded context ownership, files to touch, and what stays out of the chosen layer.

## Decision rules

- Put frontend business concepts in `domain/`, not in screens or adapters.
- Model important actions as explicit verb-based use-cases.
- Keep gateways abstract and adapters replaceable.
- In this repository, inject bounded-context gateways into RTK Query API factories, call them from endpoint `queryFn`, and convert their typed `Result` with shared `toRtkQueryResult`.
- Keep RTK Query request objects, transport URLs, HTTP methods, and SDK operation identifiers out of use-cases and business gateway contracts.
- Keep transport credentials out of use-case and business gateway parameters.
- Inject a current-session provider into adapters that perform protected operations.
- Make every fallible gateway operation expose its bounded-context `Result` contract.
- Map infrastructure failures inside concrete adapters, never inside use-cases.
- Expose small context APIs instead of leaking internals.
- Keep runtime state aligned with domain meaning, not with temporary UI shape.
- Treat pagination as a bounded-context contract, not as a screen detail.
- Prefer normalized entity state for durable collections keyed by id.
- Test use-cases through their context API and in-memory adapter, not through screens or shared test helpers.

## Do not use this skill for

- Layout, styling, or JSX-focused UI work.
- Pure route orchestration or component extraction.
- Naming-only or review-only tasks with no domain-layer change.
- Backend services, database schema, server routes, queues, or backend-only domain logic.
