# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `.agents/skills/frontend-ui-conventions/SKILL.md`
5. `src/global.css`
6. `src/constants/theme.ts`

## Situation summary

Automatic dark mode is implemented locally.

NativeWind v5 resolves dark CSS variables through `prefers-color-scheme`, Expo Router selects `NAV_THEME` from `useColorScheme`, and the Bottom Sheet resolves its imperative background and handle colors from the same scheme. Null or `unspecified` system values fall back to light.

## Exact continuation point

Perform native light/dark smoke tests, review the four source files plus checkpoint documentation, then commit and push only when requested.

## Known constraints

- NativeWind v5 remains a preview dependency.
- Native simulator/device appearance switching was not run in this session.
- Production auth token refresh and RevenueCat runtime wiring remain open.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: four theme/runtime source files and checkpoint documentation.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check and `git diff --check`.
- Passed: Expo Web export with generated dark media-query tokens.

## Recommended first command

`git diff --check && git status --short`
