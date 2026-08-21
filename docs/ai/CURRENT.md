# Current Project State

Last updated: 2026-08-21

## Current branch

`master`

## Current focus

Fifteen-derived shadcn-style React Native design system and direct/in-app Storybook modes.

## Current status

The Fifteen design-system and base Storybook work is committed as `aef3a9e`. The accepted in-app Storybook launcher is implemented and validated locally, with uncommitted follow-up changes.

Starter now exposes all 19 Fifteen UI families through local React Native/shadcn-style primitives, CVA, NativeWind v5, focused RN Primitives, and typed third-party adapters. Gluestack is absent. Existing primitives were reworked to the same Poppins metrics, semantic palette, component states, light/dark behavior, and accessibility contracts instead of only adding missing folders.

React Native Storybook 10.4 keeps the official entry-point swap for direct use and adds an explicit Fifteen-style in-app mode: `pnpm run storybook:in-app` exposes a guarded `/storybook` route and localized Home launcher. That mode intentionally includes Storybook in the development app bundle. `frontend-ui` and its versioned blueprints describe both paths.

## Next 3 concrete actions

1. Review the in-app Storybook launcher diff.
2. Run native VoiceOver/TalkBack, camera, bottom-sheet, and hardware-back smoke tests on real targets when available.
3. Commit and push the launcher follow-up only when requested.

## Relevant files

- `.agents/skills/frontend-ui/SKILL.md`
- `.agents/skills/frontend-ui/references/storybook-blueprint.md`
- `.rnstorybook/preview.tsx`
- `src/components/ui/BottomSheetModal.tsx`
- `src/global.css`
- `src/constants/theme.ts`

## Active plan

None. The requested design-system port, Storybook setup, skill alignment, and browser validation are complete.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 32 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: Storybook registry generation and production web export with 19 registered families and eight versioned Poppins font assets.
- Passed: browser smoke test for every first story, all eight Poppins weights, explicit light/dark switching, imperative vendor-theme synchronization, and a non-empty registered Storybook root with no console errors.
- Passed: direct Storybook, in-app Storybook, and normal application web exports; the Home launcher opened all 19 stories in browser validation.
- Passed: Skill Creator `quick_validate.py` for `frontend-ui` and an independent Card/story forward-test.
- Passed: targeted Oxfmt checks for every modified file and `git diff --check`.
- Known baseline: global `pnpm run format:check` still reports nine untouched Markdown files outside this change.

## Blockers / open questions

- Production auth backend, token refresh, and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.
- Native VoiceOver/TalkBack, camera permission, Android hardware-back, and device appearance switching were not run on a simulator or physical device in this session.

## Do-not-forget notes

- `core/` is the frontend business core: strategic DDD plus pragmatic Clean Architecture, not Expo-specific architecture.
- UI imports hooks only from `@/app-runtime/app-runtime`; runtime internals remain private to composition code.
- Starter uses React Native primitives, NativeWind v5/Tailwind v4, CVA, RN Primitives, and local primitives; Gluestack is not installed.
- Use `pnpm run storybook` for the swapped direct entry or `pnpm run storybook:in-app` for the Fifteen-style Home launcher; the latter is development-only.
- Use the local `BottomSheetModalProvider`; it preserves the Gorhom portal/accessibility-guard order and owns Android back handling.
- Frozen blueprints change only after an accepted decision and a new independent forward-test.
- Do not push until requested.
