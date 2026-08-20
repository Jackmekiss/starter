# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `core/auth/gateways/auth-gateway.ts`
5. `core/auth/apis/auth-api.ts`
6. `core/shared/adapters/rtk-query/to-rtk-query-result.ts`
7. `core/subscription/gateways/subscription-gateway.ts`

## Situation summary

Auth and subscription now share the validated gateway pattern: RTK Query uses `fakeBaseQuery`, use-cases call their business gateway directly in `queryFn`, and `toRtkQueryResult` performs the application-to-RTK result conversion. Transport and SDK details stay in concrete adapters.

The local Domain and Coding Standards skills now prescribe and review this convention so future bounded contexts do not reintroduce HTTP-shaped base-query routers.

## Exact continuation point

Review the uncommitted diff after `d1e17ae`, then commit/push only when requested.

## Known constraints

- Preserve typed `AuthResult` and `SubscriptionResult` failures through `.unwrap()`.
- Keep session credentials behind the injected `AuthSessionProvider`.
- Do not reintroduce HTTP-shaped requests into use-cases.
- Do not launch Expo unless explicitly requested.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: auth/subscription gateway renames, direct `queryFn` calls, shared RTK result adapter, updated specs/runtime, and checkpoint documentation.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: `git diff --check`.

## Recommended first command

`git diff --check && git status --short`
