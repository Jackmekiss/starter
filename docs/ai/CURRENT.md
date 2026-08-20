# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Deterministic time boundaries for the Auth and Subscription in-memory adapters.

## Current status

Implemented and validated locally. Changes are uncommitted after `cd442b5`.

Starter now owns the same shared `DateProvider`, `RealDateProvider`, and `DeterministicDateProvider` pattern as RVA. Auth and Subscription runtimes inject the system clock, while in-memory and fake gateways can receive deterministic time in behavior specs.

`SubscriptionPlan` has one canonical domain definition, and bundled subscription prices now display EUR values consistently with the domain currency.

## Next 3 concrete actions

1. Review the DateProvider and subscription-domain diff.
2. Commit and push only when requested.
3. Continue the prioritized session/bootstrap audit fixes separately.

## Relevant files

- `core/shared/gateways/date-provider.ts`
- `core/shared/adapters/date/`
- `core/auth/adapters/in-memory/in-memory-auth-gateway.ts`
- `core/subscription/adapters/in-memory/in-memory-subscription-gateway.ts`
- `core/subscription/domain/subscription-plan.ts`
- `src/app-runtime/runtime/auth-runtime.ts`
- `src/app-runtime/runtime/subscription-runtime.ts`

## Active plan

None.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxlint.
- Passed after formatting: targeted Oxfmt and ESLint.
- Passed: `git diff --check`.

## Blockers / open questions

- Production auth token refresh and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.

## Do-not-forget notes

- Runtime adapters should receive `RealDateProvider` from app composition.
- Specs that assert time-dependent behavior should inject `DeterministicDateProvider`.
- Do not push until requested.
