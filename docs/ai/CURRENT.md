# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Automatic light and dark appearance.

## Current status

Implemented and validated locally. Changes are uncommitted after `162a1dd`.

NativeWind tokens now react to the system dark preference, Expo Router receives a matching navigation theme, and the shared Bottom Sheet no longer forces light colors.

## Next 3 concrete actions

1. Smoke-test system appearance switching on iOS and Android.
2. Review the focused theme diff.
3. Commit and push only when requested.

## Relevant files

- `src/global.css`
- `src/constants/theme.ts`
- `src/app-runtime/root-app-providers.tsx`
- `src/components/ui/BottomSheetModal.tsx`

## Active plan

None.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check and `git diff --check`.
- Passed: Expo Web export; generated CSS contains the dark preference media query and dark token values.

## Blockers / open questions

- Production auth token refresh and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.

## Do-not-forget notes

- Treat React Native's `unspecified` appearance as light through `resolveAppColorScheme`.
- Keep CSS tokens and navigation theme values aligned.
- Do not push until requested.
