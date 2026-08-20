# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Reconstructed Starter frontend skills grounded in the normalized codebase.

## Current status

Implemented and validated locally. Changes are uncommitted after `3d63942`.

The five previous frontend skills are archived as non-normative history. `frontend-core` and `frontend-ui` now define the Starter dialect of frontend DDD, pragmatic Clean Architecture, RTK Query, runtime composition, Expo Router, NativeWind, forms, localization, and accessibility through frozen versioned blueprints.

The code was normalized before the blueprints were frozen. Six isolated forward-tests reproduced the intended patterns, and targeted reruns proved the corrections made during final review without changing the main working tree.

## Next 3 concrete actions

1. Review the complete source, skill, archive, and memory diff.
2. Optionally run native VoiceOver/TalkBack and light/dark smoke tests on real targets.
3. Commit and push only when requested.

## Relevant files

- `.agents/skills/frontend-core/SKILL.md`
- `.agents/skills/frontend-ui/SKILL.md`
- `docs/archive/agent-skills-v1/MANIFEST.md`
- `src/app-runtime/app-runtime.ts`
- `core/auth/domain/slice.ts`
- `docs/ai/DECISIONS.md`

## Active plan

None. The requested reconstruction and its forward-tests are complete.

## Last validation commands and results

- Passed: `pnpm run test` (16 files, 32 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: Skill Creator `quick_validate.py` for `frontend-core` and `frontend-ui` with Anaconda Python.
- Passed: targeted Oxfmt checks for every modified file and `git diff --check`.
- Passed: six isolated forward-tests covering a Notifications bounded context, authenticated Auth HTTP mutation, normalized durable collection, route/form, accessibility-only audit, and UI-local modal state.
- Passed: corrected Notifications rerun plus independent Profile and Library regressions after the final blueprint audit.
- Known baseline: global `pnpm run format:check` still reports nine untouched Markdown files outside this change.

## Blockers / open questions

- Production auth backend, token refresh, and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.
- Native VoiceOver/TalkBack and device appearance switching were not run in this session.

## Do-not-forget notes

- `core/` is the frontend business core: strategic DDD plus pragmatic Clean Architecture, not Expo-specific architecture.
- UI imports hooks only from `@/app-runtime/app-runtime`; runtime internals remain private to composition code.
- Starter uses React Native primitives, NativeWind v5/Tailwind v4, CVA, and local primitives; gluestack-ui is not the default stack.
- Frozen blueprints change only after an accepted decision and a new independent forward-test.
- Do not push until requested.
