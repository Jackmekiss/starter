# Worklog

## 2026-07-04 - Initialize project memory system

### Context

User requested a lightweight, repo-versioned Project Memory System for humans and fresh Codex sessions. The repository had minimal `AGENTS.md` guidance, local skills under `.agents/skills`, no `docs/` directory, no `plans/` directory, and no `CLAUDE.md`.

### Changes

- Inspected `AGENTS.md`, `README.md`, local skills, skill references, package/config files, source tree, domain files, route files, git branch/status, and recent commits.
- Created initial `docs/ai/` memory taxonomy.
- Created `docs/adr/README.md` for ADR guidance.
- Created `plans/README.md` with plan workflow and template.
- Added project memory skills under `.agents/skills/`.
- Patched `AGENTS.md` with project memory and continuity routing.

### Decisions

- Keep `docs/ai/` as the source of truth for memory.
- Keep stable product/domain memory separate from operational state.
- Use `Unknown` for product and technical facts not supported by repo evidence.
- Use `.agents/skills` for project memory maintenance procedures because this repo already uses that skill system.
- Keep `WORKLOG.md` append-only and rewrite `CURRENT.md` / `HANDOFF.md` as operational state changes.

### Validation

- Commands run for inspection included: `sed`, `find`, `rg`, `git branch --show-current`, `git status --short`, `git log --oneline -n 20`, `git ls-files`, and `mkdir -p`.
- Initial `mkdir -p` for `.agents/skills/*` failed because `.agents/skills` was read-only in the managed sandbox; the command was rerun with approved elevated permission.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.
- Reason: documentation and agent-workflow setup only.

### Next

- Run a consistency pass over required memory files, skill references, `AGENTS.md`, git status, and secret patterns.
- Fill product-specific facts in `docs/ai/product-memory.md` when confirmed product context is available.

## 2026-07-04 - Complete memory consistency pass

### Context

Initial memory files and project memory skills had been created and needed a final safety check.

### Changes

- Confirmed required `docs/ai/` files exist.
- Confirmed project memory skills exist under `.agents/skills/`.
- Confirmed `AGENTS.md` references the memory system.
- Updated `CURRENT.md` and `HANDOFF.md` with completed consistency results.

### Decisions

- No new durable decisions.

### Validation

- Ran `find docs/ai -maxdepth 1 -type f -print`.
- Ran `find .agents/skills/resume-project .agents/skills/checkpoint .agents/skills/update-project-memory .agents/skills/create-plan -maxdepth 2 -type f -print`.
- Ran `git status --short`.
- Ran `git status --short` for `src`, `core`, package/config files, and `README.md`; no source/config changes were reported.
- Ran `rg` checks for memory references in `AGENTS.md` and new skills.
- Ran a strict secret-pattern scan over `docs/ai`, `docs/adr`, `plans`, new memory skills, and `AGENTS.md`; no matches were found.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Fill product-specific facts in `docs/ai/product-memory.md` when confirmed product context is available.

## 2026-07-04 - Remove obsolete product brief references

### Context

User requested removing references to the separate product brief path and keeping product guidance inside the project memory system.

### Changes

- Updated `AGENTS.md` to point product guidance to `docs/ai/product-memory.md`, `docs/ai/user-flows.md`, and `docs/ai/OPEN_QUESTIONS.md`.
- Updated `docs/ai/product-memory.md`, `docs/ai/CURRENT.md`, `docs/ai/HANDOFF.md`, and `docs/ai/OPEN_QUESTIONS.md` to remove references to the obsolete product brief path.
- Updated `.agents/skills/resume-project/SKILL.md` to rely on existing project memory when product facts are missing.

### Decisions

- `docs/ai/product-memory.md` is the durable product-memory source of truth unless future confirmed product facts are added elsewhere.

### Validation

- Ran `rg` for the obsolete product brief path and name across `AGENTS.md`, `docs/ai`, `.agents/skills`, `plans`, and `docs/adr`; no matches remained.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Add confirmed product facts directly to `docs/ai/product-memory.md`.

## 2026-07-04 - Add starter memory initialization workflow

### Context

User clarified that this repository is a starter and that project-specific memory must be reinitialized for each new project derived from it.

### Changes

- Added `.agents/skills/initialize-project-memory/SKILL.md`.
- Added reset templates under `docs/ai/_templates/`.
- Added a `Starter reset policy` section to `docs/ai/INDEX.md`.
- Updated `AGENTS.md`, `CURRENT.md`, and `HANDOFF.md` to reference the initialization workflow.

### Decisions

- Use `initialize project memory for <project name>` as the main trigger phrase.
- Keep starter technical memory and reset project-instance memory from templates.

### Validation

- Passed: required reset templates exist under `docs/ai/_templates/`.
- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.
- Passed: `docs/ai/INDEX.md` contains Keep / Reset / History groups under `Starter reset policy`.
- Passed: strict secret-pattern scan over memory docs, plans, skills, and `AGENTS.md` found no matches.
- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists with expected frontmatter.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Use `initialize project memory for <project name>` when deriving a concrete project from this starter.

## 2026-07-04 - Rename code skills as frontend-specific

### Context

User clarified that the code convention skills are for the Expo frontend and frontend business core, and should not be confused with backend skills in a future monorepo.

### Changes

- Renamed code skills to `frontend-architecture`, `frontend-ui-conventions`, `frontend-domain-layer`, and `frontend-coding-standards`.
- Updated skill frontmatter and descriptions to specify Expo/frontend/client-side scope.
- Updated `AGENTS.md` and memory references to use the new names.

### Decisions

- Use `frontend-*` as the namespace for Expo/frontend code skills.
- Treat `core/` in these skills as frontend business core, not backend server code.

### Validation

- Passed: renamed skill folders exist under `.agents/skills/frontend-*`.
- Passed: no stale direct references to old code skill names remained in `AGENTS.md`, `docs/ai`, or `.agents/skills`.
- Passed: `frontend-architecture`, `frontend-ui-conventions`, `frontend-domain-layer`, and `frontend-coding-standards` skill files exist with expected frontmatter.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.

### Next

- Use `frontend-*` skills for Expo/frontend and frontend-core work only.

## 2026-07-04 - Remove standalone starter-only memory file

### Context

User clarified that the starter should not keep a separate starter-only memory file.

### Changes

- Removed the standalone starter-only memory file.
- Updated `docs/ai/INDEX.md` to state that reusable starter knowledge lives in architecture, technical, testing, and skill docs.
- Updated `.agents/skills/initialize-project-memory/SKILL.md` to read reusable technical memory directly.
- Removed separate starter-memory-file references from current state, handoff, and reset templates.

### Decisions

- Do not create a separate starter-only memory file.

### Validation

- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists with expected frontmatter.
- Passed: reset templates no longer list a separate starter-only memory file as a file to read.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.
- Passed: strict secret-pattern scan over memory docs, plans, skills, and `AGENTS.md` found no matches.

### Next

- Keep reusable starter knowledge in architecture, technical, testing, and skill docs.

## 2026-08-19 - Synchronize reusable RVA architecture patterns

### Context

The user asked to bring patterns that evolved in `rva-app` back into `starter`, using error management as the simplest example.

### Changes

- Compared both repositories' local architecture, domain, UI, and coding skills.
- Added reusable guidance for responsibility ownership, named adapter concerns, authenticated adapters, error presentation/review, i18n naming, icon styling, form-value ownership, and accessibility.
- Added shared `ApplicationError` and `Result` primitives.
- Migrated all fallible `auth` and `subscription` gateway operations to bounded-context result contracts.
- Removed legacy success/failure unions, raw user-facing adapter messages, and transient error storage from durable slices.
- Added safe presentation resolvers and updated use-case specs to assert exact `.unwrap()` rejections and unchanged durable state on failure.
- Added the stylesheet module declaration required for the existing global CSS import to typecheck.

### Decisions

- Use stable context-owned business codes plus shared transport-independent technical categories.
- Map infrastructure failures in concrete adapters and propagate typed errors through RTK Query.
- Keep transient request failures in RTK Query unless a failure itself is durable product truth.
- Synchronize architecture from RVA without copying product-specific contexts, backend codes, or translations.

### Validation

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` stopped on pre-existing format issues in untouched files.
- Global `pnpm run lint` stopped on pre-existing findings in `src/components/ui/BottomSheetModal.tsx` and `src/components/ui/Button.tsx`.

### Next

- Review and commit the migration.
- Use the same complete-context error migration for future bounded contexts.

## 2026-08-19 - Secure auth persistence and startup routing

### Context

The audit found that access/refresh tokens and RTK Query mutations were persisted in AsyncStorage, while a second Zustand `isConnected` value could diverge from Redux during startup.

### Changes

- Added a typed `SessionStorage` gateway, SecureStore adapter, in-memory test adapter, and auth-gateway persistence decorator.
- Restricted root Redux persistence to the non-sensitive subscription-offering catalog and removed RTK Query cache persistence.
- Changed the persistence namespace to `root-v2` and deleted the legacy `persist:root` and `session` AsyncStorage keys during bootstrap.
- Made `clearAuth` reset the complete Redux tree, including API caches.
- Removed the Zustand session store and dependency.
- Added deterministic `PersistGate` bootstrap: restore secure session, retrieve account, then mount navigation.
- Updated auth specs to verify session persistence and cleanup.
- Updated architecture, data, API, flow, glossary, technical, decision, validation, current-state, and handoff memory.

### Decisions

- Redux `auth.session` is the only runtime authentication source of truth.
- SecureStore is a persistence boundary, not another runtime store.
- Unsupported platforms use process memory rather than unencrypted credential persistence.

### Validation

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for all changed source files.
- Passed: targeted Oxfmt for changed source, memory, plan, and package files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops on 11 pre-existing unrelated formatting issues.

### Next

- Review and commit/push the migration when requested.
- Define startup retry/error UX when wiring a production auth backend.

## 2026-08-19 - Align secure session persistence with RVA

### Context

The user clarified that Starter should use the actual secure-token implementation from `rva-app`, not a separate architecture with similar behavior.

### Changes

- Ported RVA's `secure-session-storage.ts` algorithm into Starter, adapting only the auth slice name and application storage key.
- Added `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, serialized SecureStore writes, session shape validation, and recursive removal of sensitive fields from AsyncStorage/RTK Query state.
- Restored RVA's fulfilled-query persistence transform and root Redux Persist wiring.
- Removed the Starter-specific `SessionStorage` gateway, SecureStore domain adapter, auth gateway decorator, and explicit bootstrap runtime.
- Kept Starter's Redux-derived route guards while starting account retrieval only after session rehydration.
- Confirmed the same `expo-secure-store` package is already installed/configured with the SDK 56-compatible version.

### Decisions

- Track RVA's secure Redux Persist implementation as the reusable starter reference.
- Adapt context/application names only; do not copy RVA product flows or install an Expo SDK 57 module into Expo SDK 56.

### Validation

- Passed: mechanical RVA comparison; only adapted names and Starter Oxfmt wrapping differ.
- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops on 10 pre-existing unrelated formatting issues.

### Next

- Review and commit/push the alignment when requested.

## 2026-08-19 - Add French and English i18n localization

### Context

The user requested an i18n foundation in Starter with a translations directory, French and English resources, and an application-facing i18n hook.

### Changes

- Added SDK-compatible `expo-localization`, `i18next`, and `react-i18next` dependencies.
- Added bundled catalogs under `src/translations/en.json` and `src/translations/fr.json`.
- Added typed i18next initialization, supported-locale resolution, root provider wiring, and `useI18n`.
- Added all keys currently consumed by auth and subscription presentation error resolvers.
- Replaced the empty auth entry view with localized neutral welcome copy.
- Updated architecture, technical, flow, validation, decision, current-state, handoff, and plan memory.

### Decisions

- French is the fallback and typed source catalog.
- Translation keys remain flat and hierarchical with `__` separators.
- Tenant-generated translation behavior from RVA stays out of the neutral Starter.

### Validation

- Passed: `pnpm run typecheck`.
- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: `npx expo config --type public`; `expo-localization` is registered for SDK 56.
- Passed: catalog parity check (14 keys per locale), targeted formatting, and `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 10 pre-existing unrelated files.

### Next

- Review the diff and commit/push only when requested.

### Follow-up

- Renamed the app-facing localization hook from `useI18n` to `useTranslation` and updated its consumer and documentation.

## 2026-08-19 - Complete authentication error vertical slice

### Context

The error audit identified that typed errors and presentation resolvers stopped before the UI, no concrete HTTP mapper existed, and fake failures were not injectable uniformly.

### Changes

- Added a configurable HTTP auth adapter with response decoding, backend-code mapping, HTTP/transport mapping, timeouts, and bearer-session injection.
- Connected protected HTTP requests to the latest Redux session through a read-only runtime provider without duplicating credentials.
- Made one fake error setter apply before every fake auth operation.
- Added a localized `react-hook-form` login form consuming `useLoginMutation().unwrap()` and `resolveAuthErrorMessage`.
- Added accessible field and root errors, loading behavior, and French/English copy.
- Added vertical use-case specs for backend codes, HTTP failures, fake failures, unchanged durable state, and protected bearer headers.
- Documented the opt-in sample HTTP contract and runtime configuration.

### Decisions

- Keep in-memory auth as the default and select the HTTP example only with explicit runtime configuration.
- Keep remote identifiers and messages inside the HTTP adapter.
- Read protected-request credentials from Redux at request time through an injected provider.

### Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: catalog parity check (24 keys per locale).
- Passed: targeted formatting check and `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 10 pre-existing unrelated files.

### Next

- Review the diff and commit/push only when requested.
- Adapt the sample HTTP contract when the production auth backend is selected.

## 2026-08-20 - Decouple auth use-cases from HTTP-shaped base-query requests

### Context

The user challenged `url` and `method` values inside auth use-cases and requested a concrete `toRtkQueryResult` experiment on the Starter auth bounded context.

### Changes

- Replaced `AuthBaseQuery` with a domain-oriented `AuthGateway`.
- Renamed HTTP, fake, and in-memory auth implementations from base queries to gateways.
- Configured the auth API with `fakeBaseQuery` and injected the gateway into endpoint builders.
- Migrated every auth use-case to call its gateway method through `queryFn`.
- Added shared `toRtkQueryResult` as the only `Result` to RTK Query conversion boundary.
- Updated the auth behavior specs and runtime composition without changing public hooks or outcomes.

### Decisions

- Keep HTTP paths and methods exclusively inside `HttpAuthGateway`.
- Preserve typed application results until the use-case's RTK Query boundary.

### Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: `git diff --check`.

### Next

- Review the spike and commit/push only when requested.
- Migrate `subscription` only after the auth convention is accepted.

## 2026-08-20 - Apply the direct gateway pattern to subscription

### Context

The user accepted the auth spike and requested the same architecture for the subscription bounded context.

### Changes

- Replaced `SubscriptionBaseQuery` with `SubscriptionGateway`.
- Renamed in-memory, fake, and RevenueCat implementations as gateways.
- Configured the subscription API with `fakeBaseQuery`.
- Migrated all five subscription use-cases to direct gateway `queryFn` calls through `toRtkQueryResult`.
- Updated behavior specs, architecture guidance, and contract memory.

### Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint.

### Next

- Review both bounded-context migrations and commit/push only when requested.

## 2026-08-20 - Codify direct gateway RTK Query wiring in frontend skills

### Context

The user requested that the accepted auth/subscription pattern become durable skill guidance.

### Changes

- Added the direct gateway `queryFn` and `toRtkQueryResult` convention to `frontend-domain-layer`.
- Documented gateway naming, adapter ownership, `fakeBaseQuery` API wiring, and use-case test setup.
- Added review checks to `frontend-coding-standards` for transport leakage in use-cases.
- Declared that `BaseQuery` naming is reserved for real RTK Query base-query functions.

### Validation

- Passed: Skill Creator `quick_validate.py` for both updated skills using the available Anaconda Python runtime.
- Passed: targeted Oxfmt and `git diff --check`.

### Next

- Use these skill rules for new bounded contexts and future architecture reviews.

## 2026-08-20 - Make Auth and Subscription time deterministic

### Context

The audit found direct system-clock access in in-memory adapters, a duplicated subscription-plan type, and USD labels conflicting with the EUR domain currency.

### Changes

- Added the RVA-aligned shared `DateProvider`, `RealDateProvider`, and `DeterministicDateProvider` implementations.
- Injected time into Auth and Subscription in-memory/fake gateways and wired the real clock in app runtimes.
- Added exact time assertions for registration and monthly subscription purchase behavior.
- Kept `subscription-plan.ts` as the single `SubscriptionPlan` source of truth.
- Replaced bundled USD offering labels with EUR labels.

### Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint after formatting.

### Next

- Review the diff and commit/push only when requested.

## 2026-08-20 - Migrate Starter to NativeWind v5

### Context

The user requested the NativeWind v5 migration and asked that third-party component styling use the v5 `styled()` boundary instead of `StyleSheet` workarounds.

### Changes

- Upgraded NativeWind to the preview v5 release with `react-native-css`, Tailwind CSS v4, and PostCSS.
- Replaced Babel/Metro v4 wiring with v5 import rewrites and pinned the migration-required Lightning CSS version.
- Moved design tokens and the hairline utility from `tailwind.config.js` into CSS-first `src/global.css`.
- Replaced Lucide `cssInterop`, the keyboard-aware scroll view's `StyleSheet` bridge, and the ignored bottom-sheet background `className` with `styled()` adapters.
- Migrated bottom-sheet safe-area classes to the Tailwind v4 safe-area plugin syntax.
- Updated the frontend UI skill with the application-owned versus third-party `className` rule.

### Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check.
- Passed: Expo web export and generated CSS verification for theme and safe-area utilities.
- Passed: Skill Creator validation for the updated frontend UI skill using the available Anaconda Python runtime; the system Python lacked PyYAML.

### Next

- Review and native smoke-test the migration, then commit/push only when requested.

## 2026-08-20 - Strengthen the NativeWind third-party interop skill rule

### Context

The user requested an explicit skill rule for components whose `className` does not work because they are not React Native primitives.

### Changes

- Added the mandatory `styled()` decision directly to the `frontend-ui-conventions` entrypoint.
- Expanded the styling reference with the React Native, application-owned, and incompatible third-party decision tree.
- Added a concrete secondary-style-prop mapping example and prohibited `StyleSheet` as an interop workaround.

### Validation

- Passed: Skill Creator `quick_validate.py` with the available Anaconda Python runtime.
- Passed: targeted Oxfmt check on both skill files.
- Passed: `git diff --check`.

### Next

- Review the focused skill diff and commit/push only when requested.

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
