# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [../../plans/add-i18n-localization.md](../../plans/add-i18n-localization.md)

## Active plan

None. [Add I18n Localization](../../plans/add-i18n-localization.md) is complete.

## Situation summary

Starter now has typed French/English i18next catalogs, phone-language resolution with a French fallback, a root localization provider, and a translated auth entry screen.

## Exact continuation point

Review the localization diff, then commit/push only when requested.

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

Expected uncommitted changes add localization dependencies, Expo plugin configuration, runtime/provider/hook files, French and English catalogs, translated auth placeholder copy, and aligned plans/memory.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: `npx expo config --type public`.
- Passed: catalog parity check, targeted formatting, and `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 10 pre-existing unrelated files.

## Things not to repeat

- Do not copy RVA's tenant-specific generated translation resources into the neutral starter.
- Do not hard-code user-facing strings that belong in the bundled catalogs.
- Do not upgrade Expo native modules beyond SDK 56-compatible versions.

## Recommended first command

`git diff --check && git status --short`
