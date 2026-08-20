# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `core/shared/gateways/date-provider.ts`
5. `core/auth/adapters/in-memory/in-memory-auth-gateway.ts`
6. `core/subscription/adapters/in-memory/in-memory-subscription-gateway.ts`

## Situation summary

Auth and Subscription no longer read the system clock directly from their in-memory adapters. Runtime composition injects `RealDateProvider`; deterministic runtimes and behavior specs can inject `DeterministicDateProvider`.

The duplicate `SubscriptionPlan` declaration was removed from `subscription.ts`, leaving `subscription-plan.ts` as the canonical definition. Subscription offering fixtures now use EUR labels.

## Exact continuation point

Review the uncommitted DateProvider/domain diff after `cd442b5`, then commit and push only when requested.

## Known constraints

- Keep system time selection in app runtime composition.
- Keep time-dependent behavior deterministic in specs.
- Keep `SubscriptionPlan` defined only in `core/subscription/domain/subscription-plan.ts`.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: shared DateProvider files, Auth/Subscription gateway injection, runtime wiring, deterministic specs, subscription type/fixture cleanup, and checkpoint documentation.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint after formatting.
- Passed: `git diff --check`.

## Recommended first command

`git diff --check && git status --short`
