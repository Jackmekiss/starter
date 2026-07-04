---
name: frontend-domain-layer
description: "Use when modeling or refactoring the frontend business layer in this Expo app: client bounded contexts, domain entities consumed by the app, use-cases, gateways, adapters, selectors, RTK Query APIs, and runtime state under core/. Use it for frontend capabilities, client-side domain refactors, or frontend data-boundary decisions. Do not use it for backend/server domain modeling, database schema design, server APIs, screen layout, component styling, or presentation-only extraction."
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
3. Read [gateways.md](references/gateways.md) and [adapters.md](references/adapters.md) for data-boundary decisions.
4. Read [selectors.md](references/selectors.md), [apis.md](references/apis.md), and [runtime-state.md](references/runtime-state.md) for read models, facades, and state alignment.
5. Read [paginated-queries.md](references/paginated-queries.md) when a bounded context exposes a paginated list, history, feed, catalog, or any multi-page retrieval flow.
6. Read [normalized-collections.md](references/normalized-collections.md) when a bounded context owns a durable collection keyed by id.
7. Read [use-case-tests.md](references/use-case-tests.md) when adding, refactoring, or reviewing behavior specs for `core/<bounded-context>/use-cases`.
8. Return a concrete design: frontend bounded context ownership, files to touch, and what stays out of the chosen layer.

## Decision rules

- Put frontend business concepts in `domain/`, not in screens or adapters.
- Model important actions as explicit verb-based use-cases.
- Keep gateways abstract and adapters replaceable.
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
