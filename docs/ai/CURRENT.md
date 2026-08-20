# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

NativeWind v5 and Tailwind CSS v4 migration.

## Current status

Implemented and validated locally. Changes are uncommitted after `8b74ad5`.

Starter now uses NativeWind `5.0.0-preview.4`, `react-native-css`, Tailwind CSS v4, and PostCSS. Theme tokens moved from `tailwind.config.js` to the CSS-first `src/global.css`; Babel no longer loads the removed NativeWind JSX transform, and Metro uses `withNativewind` import rewrites.

Lucide, `KeyboardAwareScrollView`, and the bottom-sheet background style use local `styled()` adapters. Safe-area utilities use the v5/Tailwind v4 syntax. The frontend UI skill records the same convention.

## Next 3 concrete actions

1. Review the NativeWind v5 dependency, configuration, component, and skill diff.
2. Commit and push only when requested.
3. Smoke-test the native iOS/Android screens when a simulator or device is available.

## Relevant files

- `package.json`
- `src/global.css`
- `postcss.config.mjs`
- `metro.config.js`
- `babel.config.js`
- `src/components/ui/Icon.tsx`
- `src/app/(auth)/index.tsx`
- `.agents/skills/frontend-ui-conventions/references/styling.md`

## Active plan

None.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted `oxfmt --check` on migrated files.
- Passed: `pnpm exec expo export --platform web` with the NativeWind-generated CSS bundle.

## Blockers / open questions

- Production auth token refresh and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.

## Do-not-forget notes

- NativeWind v5 is still published as a preview release.
- Keep Tailwind customization in `src/global.css`, not a v3-style JS config.
- Use `styled()` only at incompatible third-party boundaries; application-owned components should forward `className`.
- Do not push until requested.
