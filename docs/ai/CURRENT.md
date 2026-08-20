# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Reliable local logout and uniform subscription fake failures.

## Current status

Implemented and validated locally. Changes are uncommitted after `86da542`.

Logout now clears durable authentication state after either remote success or failure. The in-memory and fake subscription gateways expose injected typed failures consistently across offerings, purchase, restore, management, and status operations.

## Next 3 concrete actions

1. Review the focused auth and subscription diff.
2. Commit and push only when requested.
3. Continue the remaining audit priorities, starting with auth bootstrap and token refresh.

## Relevant files

- `core/auth/use-cases/log-out/logout.ts`
- `core/auth/use-cases/log-out/logout.spec.ts`
- `core/subscription/adapters/in-memory/in-memory-subscription-gateway.ts`
- `core/subscription/adapters/fake/fake-subscription-gateway.ts`
- `core/subscription/use-cases/subscription-restore/restore-subscription-purchases.spec.ts`
- `core/subscription/use-cases/subscription-management/open-subscription-management.spec.ts`

## Active plan

None.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check.
- Passed: `git diff --check`.

## Blockers / open questions

- Production auth token refresh and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.

## Do-not-forget notes

- A rejected remote logout must remain visible through RTK Query while local auth state is still cleared.
- Subscription fake errors must use the same `SubscriptionError` contract for every operation.
- Do not push until requested.
