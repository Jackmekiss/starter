# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [../../plans/sync-rva-patterns.md](../../plans/sync-rva-patterns.md)

## Active plan

None. [Synchronize Reusable RVA Patterns](../../plans/sync-rva-patterns.md) is complete.

## Situation summary

The repository is an Expo/React Native starter app with frontend-first architecture. Reusable patterns that matured in `rva-app` are synchronized into frontend-scoped skills. `auth` and `subscription` now provide complete typed-error reference implementations using shared `ApplicationError` and `Result` contracts.

## Exact continuation point

Review the final working-tree diff and commit it when desired. For new fallible contexts, follow `frontend-domain-layer/references/error-management.md` and migrate the entire context rather than mixing contracts.

## Known constraints

- Preserve `frontend-*` skill naming and existing starter-only memory/testing improvements.
- Do not copy RVA product codes, translation keys, generated clients, or backend assumptions.
- Do not introduce a translation dependency solely for the example error resolvers.
- Do not launch Expo unless explicitly requested.

## Last known good state

- Branch at migration start: `master`.
- Both `starter` and `rva-app` working trees were clean before inspection.
- Targeted validation, tests, and typecheck pass; global formatting/lint debt is unrelated and documented below.

## Branch

`master`

## Working tree summary

Expected changes include the completed plan, synchronized skills, shared error contracts, complete `auth` and `subscription` migrations, specs, a CSS module declaration needed by typecheck, and memory updates.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops on pre-existing format issues in untouched files.
- Global `pnpm run lint` stops on pre-existing findings in `src/components/ui/BottomSheetModal.tsx` and `src/components/ui/Button.tsx`.

## Things not to repeat

- Do not reintroduce user-facing messages into domain errors or durable slices.
- Do not leave one bounded context with both legacy success unions and typed failures.

## Recommended first command

`git status --short && git diff --stat`
