# Worklog

Older history: [2026-Q3.md](worklog-archive/2026-Q3.md).

## 2026-08-24 - Make Poppins weights deterministic on native

### Changes

- Renamed all eight Poppins assets to their exact PostScript families and registered them through one
  Expo font array.
- Replaced generic weight utilities with explicit Poppins family utilities across Text, compound
  controls, form labels, feedback components, and the phone-input adapter.
- Versioned the corrected typography, component, and Storybook blueprints.

### Validation

- Passed typecheck, lint, formatting, 32 tests, skill validation, all-platform Expo export, direct
  Storybook web export, and generated Android/iOS font-registration inspection.
- Passed an isolated new-component probe using only explicit regular, medium, semibold, bold, and
  heading families, with typecheck and formatting.
- A fresh native build is required before visual device verification because font registration is a
  native configuration change.

## 2026-08-24 - Bound and consolidate project memory

### Changes

- Consolidated four continuity workflows into one `project-memory` skill with four explicit modes.
- Bounded active memory files, removed copied Git state, and made handoffs conditional.
- Moved older worklog entries into the quarterly archive without changing their factual content.
- Reduced technical memory to cross-cutting facts and links to normative owners.

### Validation

- Verified active-file budgets, routing references, archive continuity, and the new skill structure.

## 2026-08-20 - Guarantee local logout and uniform subscription failures

### Context

The audit found that a failed remote logout retained local credentials, while restore and subscription-management operations bypassed the in-memory adapter's injected error path.

### Changes

- Cleared local auth state in the logout lifecycle regardless of remote success or failure while preserving the RTK Query result.
- Routed in-memory auth logout through its typed adapter execution wrapper.
- Routed every in-memory subscription operation through one typed-result execution wrapper.
- Added `FakeSubscriptionGateway.error` and forwarded it to the in-memory adapter.
- Added logout, restore, and management failure behavior specs.

### Validation

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check and `git diff --check`.

### Next

- Review and commit/push only when requested, then continue with auth bootstrap and token refresh hardening.

## 2026-08-20 - Implement automatic dark appearance

### Context

The audit found that `userInterfaceStyle: automatic` was declared while CSS tokens, navigation, and Bottom Sheet imperative colors remained light-only.

### Changes

- Added a complete dark token set under the system color-scheme media query.
- Added a shared resolver for light, dark, null, and `unspecified` React Native appearance values.
- Synchronized Expo Router's navigation theme with system appearance.
- Made Bottom Sheet background and handle colors theme-aware while preserving explicit overrides.

### Validation

- Passed: `pnpm run test` (16 files, 31 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check and `git diff --check`.
- Passed: Expo Web export; generated CSS contains the dark preference media query and token values.

### Next

- Smoke-test light/dark switching on native platforms, then commit and push only when requested.

## 2026-08-20 - Reconstruct Starter frontend skills

### Context

The user requested rebuilding the Starter frontend skills from zero so they generate the normalized Starter implementation precisely. The new guidance had to treat `core/` as a frontend business core grounded in strategic DDD and pragmatic Clean Architecture, without attaching Expo to domain or architecture naming.

### Changes

- Normalized Auth around `auth.session` as the sole connection truth, removed dead selectors and RTK Query tags, unified in-memory/fake failure execution, and updated affected behavior specs.
- Moved shared sleep ownership, aligned Subscription error presentation, normalized the `Textarea` name, corrected theme tokens, and tightened destructive-button text styling.
- Reduced `src/app-runtime/app-runtime.ts` to the explicit UI hook and `appMode` facade, added the missing onboarding hook, and removed the root-layout re-export.
- Archived the five previous frontend skills under `docs/archive/agent-skills-v1/` with a non-normative source manifest.
- Added `frontend-core` and `frontend-ui` with implicit invocation metadata and fourteen frozen `1.0.0` blueprints covering required trees, complete skeletons, invariants, and anti-patterns.
- Updated routing in `AGENTS.md` and aligned architecture, technical, product-flow, data, API, glossary, validation, decision, current-state, and handoff memory.
- Kept historical worklog entries unchanged when they referenced the archived skill names.

### Decisions

- Use two frontend skills only: `frontend-core` for the business core and runtime composition, and `frontend-ui` for routes, screens, presentation, styling, localization, and accessibility.
- Treat the blueprints as frozen generated-code contracts; change them only after an accepted decision and a new independent forward-test.
- Use React Native primitives, NativeWind v5/Tailwind v4, CVA, and local primitives as Starter's UI stack; do not assume gluestack-ui.

### Validation

- Passed: `pnpm run test` (16 files, 32 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: Skill Creator `quick_validate.py` for both new skills with Anaconda Python.
- Passed: targeted Oxfmt for all modified files and `git diff --check`.
- Passed: archive integrity, active-skill inventory, blueprint count/version, and stale source-name searches.
- Passed six isolated forward-tests: Notifications bounded context (38 tests), authenticated Auth email mutation (37 tests), normalized durable collection (34 tests), localized accessible route/form (32 tests), accessibility-only Login audit with no visual change (32 tests), and UI-local logout modal with no `core/` or runtime change (32 tests).
- Each forward-test passed its full suite, typecheck, Oxlint, ESLint, targeted formatting, diff check, and a boundary review.
- An independent final audit found and corrected stale Auth/test documentation, the missing UI naming rule, an Oxfmt-sensitive runtime placeholder, and a test-only runtime factory pattern that was too permissive.
- After those corrections, Notifications reran with direct runtime composition (18 files, 38 tests), Profile reran as the UI naming regression (16 files, 32 tests), and Library independently reproduced normalized state plus direct runtime wiring (17 files, 34 tests).
- Global `pnpm run format:check` still reports nine pre-existing untouched Markdown files outside this change.
- Native VoiceOver/TalkBack was not run because no simulator/device automation harness was provided.

### Next

- Review the complete diff.
- Optionally run native accessibility and appearance smoke tests.
- Commit and push only when requested.

## 2026-08-20 - Port Fifteen's design system and add isolated Storybook

### Context

The user requested every Fifteen UI family missing from Starter, the same visual design language implemented with Starter's shadcn-style React Native stack instead of Gluestack, and Storybook documentation for the complete system.

### Changes

- Audited Fifteen's 19 UI families and translated all missing capabilities without adding Gluestack or its provider/API conventions.
- Added Alert, Badge, CameraView, Checkbox, FormControl, Link, PhoneNumberInput, Progress, Radio, SafeAreaView, ScreenHeader, Switch, and Toast.
- Reworked the six existing families so Button, Input, Text, Textarea, Icon, and BottomSheetModal share Fifteen's Poppins metrics, semantic tokens, variants, states, and accessibility contracts.
- Added focused RN Primitives and typed Expo/vendor adapters, eight versioned Poppins faces, synchronized light/dark theme mirrors, and a local composite bottom-sheet provider with portal-safe background hiding and Android back handling.
- Added one co-located story file for each family and React Native Storybook 10.4 through official Expo entry-point swapping, presentation-only providers, generated discovery, and normal-bundle isolation.
- Corrected the swapped Expo entry to use `registerRootComponent` after a real browser test exposed a blank static export that bundling alone did not detect.
- Updated `frontend-ui` and its frozen component, theme, accessibility, routes, and Storybook blueprints; independently forward-tested a new Card and story.

### Decisions

- Preserve Fifteen's complete visual language while keeping local shadcn-style React Native APIs, NativeWind/CVA, and focused RN Primitives.
- Keep Storybook outside Expo Router and application runtime through entry-point swapping.
- Keep imperative vendor colors synchronized through the shared navigation theme and own bottom-sheet accessibility/Android dismissal in the local provider.

### Validation

- Passed: `pnpm run test` (16 files, 32 tests), `pnpm run typecheck`, `pnpm run lint`, targeted Oxfmt, and `git diff --check`.
- Passed: Storybook registry generation and static web export with all 19 families and eight Poppins assets.
- Passed: in-browser runtime smoke test of every first story, all eight Poppins weights, explicit light/dark switching, vendor theme synchronization, and zero console warnings/errors.
- Passed: normal application web export with no Storybook entry markers.
- Passed: Skill Creator `quick_validate.py` and the independent Card/story forward-test for `frontend-ui`.
- Known baseline: global `pnpm run format:check` still reports the same nine untouched Markdown files.
- Not run: native VoiceOver/TalkBack, camera permission, gestures, or Android hardware-back validation on a simulator or physical device.

### Next

- Review the complete diff and run the remaining native smoke tests when a target is available.
- Commit and push only when requested.

## 2026-08-21 - Add Fifteen-style in-app Storybook access

### Context

The user requested the same Home access pattern used by Fifteen after confirming that the development app may trade Storybook bundle isolation for a navigable in-app route.

### Changes

- Added `pnpm run storybook:in-app`, guarded by `EXPO_PUBLIC_STORYBOOK_ENABLED=true`.
- Extracted the reusable Storybook root, retained the direct swapped entry, and added the development-only `/storybook` route.
- Added the localized floating `home.storybook` launcher on Home, matching Fifteen's developer affordance.
- Updated the Storybook blueprint, UI skill, README, architecture, decision, validation, current-state, and handoff documentation.

### Validation

- Passed: typecheck, lint, Storybook registry generation, direct Storybook export, in-app Storybook export, and normal application export.
- Passed: browser test from in-memory login to Home launcher, then Storybook with all 19 families.

### Next

- Do not enable `EXPO_PUBLIC_STORYBOOK_ENABLED` for production builds.
