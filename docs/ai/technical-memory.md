# Technical Memory

## Commands

| Purpose               | Command                       | Source                                   | Status        |
| --------------------- | ----------------------------- | ---------------------------------------- | ------------- |
| Package manager       | `pnpm@11.7.0`                 | `package.json`                           | Discovered    |
| Install               | `pnpm install`                | `README.md`, package manager metadata    | Discovered    |
| Dev server            | `pnpm run start`              | `package.json`                           | Discovered    |
| Expo start            | `pnpm expo start`             | `README.md`                              | Discovered    |
| Android run           | `pnpm run android`            | `package.json`                           | Discovered    |
| iOS run               | `pnpm run ios`                | `package.json`                           | Discovered    |
| Web run               | `pnpm run web`                | `package.json`                           | Discovered    |
| Build                 | Unknown                       | No build script found                    | Not available |
| Typecheck             | `pnpm run typecheck`          | `package.json`                           | Discovered    |
| Lint                  | `pnpm run lint`               | `package.json`                           | Discovered    |
| Lint fix              | `pnpm run lint:fix`           | `package.json`                           | Discovered    |
| Format                | `pnpm run format`             | `package.json`                           | Discovered    |
| Format check          | `pnpm run format:check`       | `package.json`                           | Discovered    |
| Unit / use-case tests | `pnpm run test`               | `package.json`, `vitest.config.ts`       | Discovered    |
| Storybook             | `pnpm run storybook`          | `package.json`, `.rnstorybook/`          | Discovered    |
| Story registry        | `pnpm run storybook:generate` | `package.json`, `.rnstorybook/main.ts`   | Discovered    |
| Broad check           | `pnpm run check`              | `package.json`                           | Discovered    |
| Migration             | Unknown                       | No database migration tooling discovered | Not available |

Do not claim a command passes unless it was run in the current session or a recorded worklog entry says so.

## Code style conventions

- Prefer obvious code over smart code.
- Prefer business-first names over generic helpers.
- Keep screens thin and orchestration-focused.
- Keep generic UI primitives presentational.
- Keep durable product truth under bounded contexts in `core/`.
- Do not leak UI state into domain models.
- Do not put domain logic directly inside screens.
- Add useful JSDoc for functions, methods, types, interfaces, and enums when introducing or changing them.
- Avoid comments that only repeat symbol names or TypeScript types.

## Naming conventions

- Files and folders use kebab-case by default.
- Shared UI and UX primitives use PascalCase filenames; feature components use kebab-case filenames.
- Hook files/folders use camelCase, such as `useThing.ts`.
- Expo Router conventions may keep `_layout.tsx`, `index.tsx`, and route group names.
- Variables, functions, parameters, and properties use `camelCase`, `UPPER_CASE`, or `PascalCase`.
- Types and enum members use `PascalCase`.
- Treat acronyms as words: use `createAuthApi`, not `createAuthAPI`.
- Avoid short aliases like `cfg`, `tmp`, and `val`.

## TypeScript conventions

- `strict` TypeScript is enabled.
- Path aliases: `@/*` -> `src/*`, `@core/*` -> `core/*`, `@@/*` -> repo root.
- Prefer explicit types at domain boundaries, gateways, adapters, and exported APIs when inference is not obvious.
- Prefer `function name()` declarations for named functions.
- Use `import type` for type-only imports.
- Do not use `any`, non-null assertions, or type assertions; prefer `unknown`, DTOs, typed adapters, and narrowers.
- Unused variables are errors unless prefixed with `_`.

## UI conventions

- Use Expo Router route groups and keep route files thin.
- Import generated context hooks through `@/app-runtime/app-runtime`; routes and feature components must not import API instances or concrete gateways.
- Use NativeWind v5 `className` and Tailwind/theme tokens defined CSS-first in `src/global.css` with Tailwind v4 `@theme`/`@utility`.
- Define automatic dark token values under `@media (prefers-color-scheme: dark)` and keep `NAV_THEME` synchronized through `useColorScheme`.
- Application-owned components accept and forward `className`. Wrap incompatible third-party native components with `styled()` and map secondary style props there; do not replace desired utilities with `StyleSheet` workarounds.
- Reuse `src/components/ui/` primitives before creating local systems.
- The 19 shared UI families are Alert, Badge, BottomSheetModal, Button, CameraView, Checkbox, FormControl, Icon, Input, Link, PhoneNumberInput, Progress, Radio, SafeAreaView, ScreenHeader, Switch, Text, Textarea, and Toast.
- Starter translates Fifteen's visual language into local shadcn-style React Native composition; it does not install Gluestack or expose Gluestack compound props.
- Poppins font assets are versioned under `public/fonts/`; native Expo font configuration and web `@font-face` declarations use the same eight files.
- Imperatively styled vendor adapters consume the mounted navigation theme through `useTheme()` so application and Storybook explicit themes stay synchronized.
- Mount the exported local `BottomSheetModalProvider`, not Gorhom's provider directly. It preserves the portal/accessibility-guard order, background hiding, and Android top-sheet back handling.
- Storybook stories are co-located beside shared primitives and run through the swapped `.rnstorybook/index.tsx` entry; presentation providers must not mount Redux, persistence, gateways, or app runtime.
- Use `react-hook-form` for real forms, with `<Controller />` for controlled primitives.
- Avoid inline arrow functions in JSX returns when reasonably possible; use named handlers.
- Parent layouts own external spacing; reusable children own internal spacing.
- Keep raw colors and arbitrary values out of screens and feature components. Confine justified interop or design-system exceptions to shared primitives and promote repeated values to tokens.

## Localization conventions

- Bundled catalogs live in `src/translations/en.json` and `src/translations/fr.json`.
- Use `useTranslation` from `src/hooks/localization/useTranslation.ts` in presentation code.
- Use flat hierarchical keys separated by `__`; use snake_case inside each compound segment.
- French is the fallback and typed source catalog; unsupported phone languages resolve to French.
- Keep every key consumed by presentation error resolvers in both bundled catalogs.
- `LocalizationProvider` belongs in the root runtime provider composition, not in domain code.

## Domain conventions

- Each bounded context under `core/` owns its frontend business vocabulary, models, use-cases, gateways, adapters, selectors, durable state, and API options.
- In this starter, `core/` means frontend business core for the Expo app, not backend server code.
- Starter uses strategic DDD and pragmatic Clean Architecture; do not add aggregates, value objects, repositories, or domain services without a concrete business need.
- Redux Toolkit slices under `domain/` and RTK Query builders under `use-cases/` are intentional Starter conventions.
- Use-cases live one action per file under action-oriented folders.
- Gateways define stable contracts and keep implementations replaceable.
- Public application payloads and result shapes live in `core/<context>/apis/types.ts`; raw transport DTOs stay in concrete adapters.
- Durable collections keyed by id should use `createEntityAdapter`.
- Test use-cases by dispatching RTK Query endpoints against in-memory adapters.
- Inject `DateProvider` into time-dependent adapters instead of reading `Date.now()` or constructing the current date directly.
- Use `RealDateProvider` in app runtime composition and `DeterministicDateProvider` in time-dependent behavior specs.

## Error handling conventions

- Shared technical failures and the generic `Result` container live in `core/shared/domain/`.
- Each bounded context owns a stable error-code union, type guard, and `ContextResult<Value>` alias.
- Every fallible gateway method returns its context result. Use-cases call their bounded-context gateway through `queryFn`, and shared `toRtkQueryResult` converts it to RTK Query `{ data }` or `{ error }`.
- Concrete adapters preserve typed context errors, map infrastructure failures, and never expose raw exception messages.
- `.unwrap()` resolves success values and rejects with the exact typed context error.
- Transient request failures stay in RTK Query instead of durable Redux slices.
- Presentation adapters resolve typed errors into safe message keys/copy with caller-provided fallback wording.
- Login UI catches `.unwrap()` failures, delegates them to `resolveAuthErrorMessage`, and stores only localized copy in the form root error.
- HTTP auth adapters map documented backend codes first, then HTTP/transport categories, and validate successful response bodies.
- Fake adapters expose one deterministic error setter that applies before every operation.
- Unknown: global logging, reporting, or crash/error monitoring strategy.

## Session persistence conventions

- Redux `auth.session` is the only runtime authentication source of truth.
- Use the RVA-aligned `secureSessionStorage` Redux Persist adapter in `src/app-runtime/runtime/secure-session-storage.ts`.
- Keep `accessToken` and `refreshToken` only in Expo SecureStore, with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Recursively sanitize sensitive session fields from every AsyncStorage slice and persisted RTK Query result.
- Serialize SecureStore writes so token rotation cannot be overwritten by an older pending persistence write.
- Use the fulfilled-query persistence transform from `persisted-api-cache.ts`; secure-session sanitization remains responsible for removing credentials.
- Application routing must read connection from Redux and keep the splash visible during the initial connected-account query.

## Logging conventions

Unknown. No explicit logging convention was discovered. ESLint allows `console` in `scripts/**/*` only.

## Dependency rules

- UI should not import concrete adapters.
- Screens should rely on context API hooks/selectors and avoid raw infrastructure access.
- `core/` must not import `src/`, and bounded contexts must not import one another directly; cross-context reactions belong in runtime composition.
- Domain should remain independent from UI, navigation, storage, and networking details.
- Avoid generic folders like `helpers`, `misc`, `manager`, or catch-all `utils` without strong justification.
- NativeWind v5 is currently installed from its preview channel. Keep `react-native-css`, PostCSS, Tailwind CSS v4, and the pinned `lightningcss` override aligned with the official migration guide.
- Keep the pinned Storybook 10.4 package set and its React Native controls dependencies aligned with Expo 57; validate upgrades as one compatibility change.

## Frontend skill blueprint maintenance

- [`frontend-core`](../../.agents/skills/frontend-core/SKILL.md) and [`frontend-ui`](../../.agents/skills/frontend-ui/SKILL.md) are the only discoverable frontend code skills.
- Their versioned blueprints are the default shape for new Starter code.
- Change a frozen blueprint only alongside an accepted architecture decision and independent forward-testing.
- Archived frontend skills under `docs/archive/agent-skills-v1/` are historical and non-normative.

## Environment / config conventions

- `.env*` files are ignored by git.
- Public runtime mode reads `EXPO_PUBLIC_APP_MODE`.
- `EXPO_PUBLIC_APP_MODE=fake` selects the fake auth adapter; other values use in-memory auth.
- `EXPO_PUBLIC_APP_MODE=http` selects the sample HTTP auth adapter.
- `EXPO_PUBLIC_AUTH_API_URL` configures its backend origin; an absent origin returns a typed unavailable error.
- Do not store raw env values in memory files.
- Unknown: production env variables, Supabase config, RevenueCat config, CI config, and release config.

## Before final handoff

- Inspect `git status --short`.
- Update [CURRENT.md](CURRENT.md) and [HANDOFF.md](HANDOFF.md).
- Append a factual entry to [WORKLOG.md](WORKLOG.md).
- Update specific stable memory files only when durable facts changed.
- Record commands run and whether validation passed, failed, or was not run.
- If source changed, run the narrowest meaningful validation first, then broader checks when risk warrants it.
