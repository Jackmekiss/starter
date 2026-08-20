# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `.agents/skills/frontend-domain-layer/SKILL.md`
5. `core/auth/use-cases/log-out/logout.ts`
6. `core/subscription/adapters/in-memory/in-memory-subscription-gateway.ts`

## Situation summary

The audited logout and subscription error-injection gaps are fixed locally.

Logout waits for the remote attempt to settle, preserves its typed RTK Query success or rejection, and clears local auth state in `finally`. Every in-memory subscription operation now runs through the same typed-result execution wrapper, and `FakeSubscriptionGateway.error` forwards deterministic failures to that adapter.

## Exact continuation point

Review the seven changed source/spec files and checkpoint documentation, then commit and push only when requested.

## Known constraints

- Offline logout clears local state after the remote adapter settles; the sample HTTP adapter may wait for its configured timeout.
- Production auth token refresh is still not implemented.
- RevenueCat has no concrete runtime wiring yet.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: auth logout behavior/spec, subscription fake and in-memory adapters/specs, and checkpoint documentation.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check.
- Passed: `git diff --check`.

## Recommended first command

`git diff --check && git status --short`
