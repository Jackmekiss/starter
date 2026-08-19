# Current Project State

Last updated: 2026-08-19

## Current branch

`master`

## Current focus

Secure auth-session persistence and deterministic startup routing are implemented.

## Why this matters

The starter must never place credentials in unencrypted persistence or route from duplicated connection state.

## Current status

Complete and validated locally. Changes are uncommitted on `master`.

## Next 3 concrete actions

1. Review and commit the secure-auth bootstrap migration when desired.
2. Define production startup retry/error UX when a real auth backend is added.
3. Optionally fix the unrelated global formatting/lint debt.

## Relevant files

- [../../plans/secure-auth-bootstrap.md](../../plans/secure-auth-bootstrap.md): active implementation plan.
- [architecture-map.md](architecture-map.md): reusable architecture boundaries.
- [technical-memory.md](technical-memory.md): engineering conventions.
- [api-contracts.md](api-contracts.md): current gateway and error contracts.

## Active plan

None. [Secure Auth Bootstrap](../../plans/secure-auth-bootstrap.md) is complete.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for every changed source file.
- Passed: targeted Oxfmt for changed source, memory, plan, and package files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops on 11 pre-existing unrelated formatting issues before lint.

## Blockers / open questions

- Production auth backend/provider and startup retry/error UX remain Unknown.
- RevenueCat configuration and translation runtime remain Unknown behind replaceable contracts.

## Do-not-forget notes

- `auth.session` is the only runtime connection truth.
- Never add auth or RTK Query slices to the AsyncStorage persistence allowlist.
- Legacy `persist:root` and `session` AsyncStorage keys are removed during bootstrap.
