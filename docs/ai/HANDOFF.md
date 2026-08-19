# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [../../plans/complete-auth-error-vertical-slice.md](../../plans/complete-auth-error-vertical-slice.md)

## Active plan

None. [Complete Auth Error Vertical Slice](../../plans/complete-auth-error-vertical-slice.md) is complete.

## Situation summary

Starter now has a complete login error example across HTTP/fake adapters, typed RTK Query rejection, presentation resolution, and accessible translated form copy.

## Exact continuation point

Review the working-tree diff, then commit/push only when requested.

## Known constraints

- Never allow `accessToken` or `refreshToken` to survive the recursive AsyncStorage sanitizer.
- Preserve serialized SecureStore writes and `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Keep the package version compatible with Starter's Expo SDK 56.
- Do not launch Expo unless explicitly requested.
- Keep all bundled keys synchronized between `src/translations/en.json` and `src/translations/fr.json`.

## Last known good state

- Branch at migration start: `master`.
- Starter was clean at `45d3a5d`; RVA was read-only and remained untouched.
- Tests, typecheck, targeted format/lint, and Expo public config pass.

## Branch

`master`

## Working tree summary

Expected uncommitted changes implement the completed vertical-slice plan; `18a7b84` is the clean baseline.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: catalog parity check (24 keys per locale).
- Passed: targeted formatting check and `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 10 pre-existing unrelated files.

## Things not to repeat

- Do not display raw backend messages or inspect HTTP failures in UI/use-cases.
- Do not pass bearer tokens through use-case or gateway request parameters.
- Do not treat the sample HTTP contract as a discovered production backend.

## Recommended first command

`git diff --check && git status --short`
