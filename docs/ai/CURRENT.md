# Current Project State

Last updated: 2026-08-19

## Current branch

`master`

## Current focus

The authentication error vertical slice is implemented.

## Why this matters

Starter has the error primitives but still needs one executable reference showing each layer consuming the typed contract correctly.

## Current status

Complete and validated locally. Changes are uncommitted on `master` after `18a7b84`.

## Next 3 concrete actions

1. Review the complete adapter-to-UI diff.
2. Run device QA against a compatible HTTP backend if desired.
3. Commit and push only when requested.

## Relevant files

- [../../plans/complete-auth-error-vertical-slice.md](../../plans/complete-auth-error-vertical-slice.md): active implementation plan.
- [architecture-map.md](architecture-map.md): reusable architecture boundaries.
- [technical-memory.md](technical-memory.md): engineering conventions.
- [api-contracts.md](api-contracts.md): current gateway and error contracts.

## Active plan

None. [Complete Auth Error Vertical Slice](../../plans/complete-auth-error-vertical-slice.md) is complete.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed files.
- Passed: catalog parity check (24 keys per locale).
- Passed: targeted formatting check and `git diff --check`.
- Global `pnpm run check` stops on 10 pre-existing unrelated formatting issues.

## Blockers / open questions

- Production auth backend/provider, token refresh, and startup retry/error UX remain Unknown.
- RevenueCat configuration remains Unknown behind replaceable contracts.

## Do-not-forget notes

- Add new UI copy to both translation catalogs.
- Keep hierarchical translation keys separated by `__`.
- Keep Expo native modules compatible with the Starter Expo SDK.
