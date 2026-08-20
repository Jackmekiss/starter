# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Auth and subscription use domain-oriented gateways instead of HTTP-like RTK Query requests.

## Current status

Implemented and validated locally. Changes are uncommitted after `d1e17ae`.

Auth and subscription use-cases call injected gateways through `queryFn`. Shared `toRtkQueryResult` converts typed application `Result` values to RTK Query's `{ data } | { error }` contract. Infrastructure details remain inside concrete adapters.

The convention is now encoded in the `frontend-domain-layer` and `frontend-coding-standards` skills, including implementation, testing, and review guidance.

## Next 3 concrete actions

1. Review the gateway/queryFn pattern across both bounded contexts.
2. Mount the subscription API in app runtime only when a product flow requires it.
3. Commit and push only when requested.

## Relevant files

- `core/auth/gateways/auth-gateway.ts`
- `core/auth/apis/auth-api.ts`
- `core/subscription/gateways/subscription-gateway.ts`
- `core/subscription/apis/subscription-api.ts`
- `core/shared/adapters/rtk-query/to-rtk-query-result.ts`
- `src/app-runtime/runtime/auth-runtime.ts`
- `.agents/skills/frontend-domain-layer/`
- `.agents/skills/frontend-coding-standards/`

## Active plan

None.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for both bounded contexts.
- Passed: `git diff --check`.

## Blockers / open questions

- Subscription runtime mounting and concrete RevenueCat configuration remain Unknown.
- Production auth backend/provider, token refresh, and startup retry/error UX remain Unknown.

## Do-not-forget notes

- Keep HTTP paths and methods inside concrete HTTP adapters.
- Keep `.unwrap()` rejection values equal to the bounded-context error contract.
- Do not push until requested.
