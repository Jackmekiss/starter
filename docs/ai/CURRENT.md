# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Fifteen-derived shadcn-style React Native design system and isolated Storybook.

## Current status

Implemented and validated locally. Changes are uncommitted after `57ac541`.

Starter now exposes all 19 Fifteen UI families through local React Native/shadcn-style primitives, CVA, NativeWind v5, focused RN Primitives, and typed third-party adapters. Gluestack is absent. Existing primitives were reworked to the same Poppins metrics, semantic palette, component states, light/dark behavior, and accessibility contracts instead of only adding missing folders.

React Native Storybook 10.4 uses official entry-point swapping, a presentation-only provider tree, generated story discovery, one co-located story file per family, versioned Poppins assets, and no Expo Router route. The normal application bundle remains Storybook-free. `frontend-ui` and its versioned blueprints were updated and independently forward-tested against this implementation.

## Next 3 concrete actions

1. Review the complete UI, Storybook, dependency, skill, and memory diff.
2. Run native VoiceOver/TalkBack, camera, bottom-sheet, and hardware-back smoke tests on real targets when available.
3. Commit and push only when requested.

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
- Passed: normal application web export with no Storybook entry markers.
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
- Storybook's swapped Expo entry must call `registerRootComponent`; a component export or bare `AppRegistry` registration leaves static web export blank.
- Use the local `BottomSheetModalProvider`; it preserves the Gorhom portal/accessibility-guard order and owns Android back handling.
- Frozen blueprints change only after an accepted decision and a new independent forward-test.
- Do not push until requested.
