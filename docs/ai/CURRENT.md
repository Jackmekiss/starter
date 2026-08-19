# Current Project State

Last updated: 2026-08-19

## Current branch

`master`

## Current focus

Reusable architecture patterns from `rva-app` are synchronized, including typed application-error contracts across `auth` and `subscription`.

## Why this matters

The starter must remain aligned with patterns proven in the evolved application while keeping product-specific RVA behavior out of the reusable template.

## Current status

Complete. Skills, reference implementations, behavior specs, and durable memory are aligned.

## Next 3 concrete actions

1. Review and commit the completed migration when desired.
2. Optionally fix the unrelated global formatting/lint debt listed below.
3. Use the typed error pattern when adding the next bounded context.

## Relevant files

- [../../plans/sync-rva-patterns.md](../../plans/sync-rva-patterns.md): active migration plan.
- [architecture-map.md](architecture-map.md): reusable architecture boundaries.
- [technical-memory.md](technical-memory.md): engineering conventions.
- [api-contracts.md](api-contracts.md): current gateway and error contracts.

## Active plan

None. [Synchronize Reusable RVA Patterns](../../plans/sync-rva-patterns.md) is complete.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Failed on pre-existing unrelated files: `pnpm run check` formatting phase.
- Failed on pre-existing unrelated files: `pnpm run lint` (`BottomSheetModal.tsx` type-only import and `Button.tsx` accessibility warning).

## Blockers / open questions

- Concrete production backend, auth provider, RevenueCat configuration, and translation runtime remain Unknown and behind replaceable contracts.

## Do-not-forget notes

- Preserve the starter's `frontend-*` skill names and use-case testing reference while importing newer RVA guidance.
- Copy architecture, not RVA-specific error codes, generated API types, translations, or business contexts.
