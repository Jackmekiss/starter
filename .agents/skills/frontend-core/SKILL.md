---
name: frontend-core
description: "Implement or refactor Starter's frontend business core and runtime composition: pragmatic frontend DDD and Clean Architecture, bounded contexts under core/, RTK Query use-case builders, Redux durable state and selectors, typed Results and application errors, gateways and adapters, behavior specs, and src/app-runtime wiring. Use for frontend business capabilities that touch core/, external data boundaries, durable state, or runtime API/store integration. Do not use for backend/server architecture, database schema, or presentation-only screen and component work."
---

# Frontend Core

Build frontend capabilities that look native to Starter's existing `auth` and `subscription` bounded contexts.

## Source of Truth

Apply, in order:

1. The user's requested behavior and scope.
2. Accepted, non-superseded repository decisions.
3. The current target context and the closest complete Starter example.
4. The frozen blueprints in this skill.

Starter uses a pragmatic frontend adaptation of DDD and Clean Architecture. Do not replace it with a framework-free or backend-oriented interpretation.

## Workflow

1. Inspect the relevant context and `src/app-runtime/` before designing the change.
2. Read [starter-ddd-clean-architecture.md](references/starter-ddd-clean-architecture.md) for any ownership, dependency, or context-boundary decision.
3. For a new context, read [bounded-context-blueprint.md](references/bounded-context-blueprint.md).
4. Read only the references required by the capability:
   - failures or infrastructure: [errors-results-adapters-blueprint.md](references/errors-results-adapters-blueprint.md)
   - queries, mutations, or API options: [rtk-query-use-case-blueprint.md](references/rtk-query-use-case-blueprint.md)
   - Redux state or read models: [state-selectors-blueprint.md](references/state-selectors-blueprint.md)
   - concrete adapter selection, APIs, hooks, or store mounting: [runtime-wiring-blueprint.md](references/runtime-wiring-blueprint.md)
   - core behavior tests: [behavior-spec-blueprint.md](references/behavior-spec-blueprint.md)
5. Implement the smallest complete vertical slice. Extend an existing context instead of recreating its skeleton.
6. Derive an independent forward behavior spec from the requested outcome and accepted decisions; do not copy expectations from the implementation under test.
7. Validate the behavior and every changed boundary.

## Non-Negotiable Boundaries

- Organize `core/` by frontend bounded context and business language.
- Keep durable product truth in the owning context; keep temporary interaction mechanics in the UI.
- Model application actions as RTK Query endpoint builders under `use-cases/<action>/`.
- Inject domain-oriented gateway contracts; keep URLs, HTTP methods, SDK calls, credentials, and raw external data inside concrete adapters.
- Return typed context `Result` values from fallible gateways and convert them with `toRtkQueryResult` in `queryFn`.
- Keep transient request failures in RTK Query. Update durable Redux state only after successful fulfillment unless failure is itself durable product truth.
- Instantiate concrete gateways, RTK Query APIs, middleware, hooks, and store wiring in `src/app-runtime/`.
- Test use cases through their RTK Query API and a real Starter store.
- Treat accepted, non-superseded decisions as normative and forward specs as independent evidence of requested behavior, not snapshots of incidental implementation.

## Scope Boundary

This skill owns `core/**`, `core/init-redux-store.ts`, and core-facing `src/app-runtime/**` wiring. Use `frontend-ui` for routes, screens, components, forms, styling, localization, themes, and accessibility. A full vertical slice may require both skills; build the core contract first.

## Validation

Run the narrowest relevant checks first, then broaden according to risk:

- `pnpm run test`
- `pnpm run typecheck`
- `pnpm run lint`
- targeted `pnpm exec oxfmt <changed-files> --check` (required for every modified file)
- global `pnpm run format:check` as a regression check; distinguish unrelated baseline failures and do not rewrite out-of-scope docs to make it green

Do not claim a check passed unless it ran in the current work or is explicitly documented as prior evidence.
