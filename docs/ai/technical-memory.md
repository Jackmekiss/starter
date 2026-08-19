# Technical Memory

## Commands

| Purpose               | Command                 | Source                                   | Status        |
| --------------------- | ----------------------- | ---------------------------------------- | ------------- |
| Package manager       | `pnpm@11.7.0`           | `package.json`                           | Discovered    |
| Install               | `pnpm install`          | `README.md`, package manager metadata    | Discovered    |
| Dev server            | `pnpm run start`        | `package.json`                           | Discovered    |
| Expo start            | `pnpm expo start`       | `README.md`                              | Discovered    |
| Android run           | `pnpm run android`      | `package.json`                           | Discovered    |
| iOS run               | `pnpm run ios`          | `package.json`                           | Discovered    |
| Web run               | `pnpm run web`          | `package.json`                           | Discovered    |
| Build                 | Unknown                 | No build script found                    | Not available |
| Typecheck             | `pnpm run typecheck`    | `package.json`                           | Discovered    |
| Lint                  | `pnpm run lint`         | `package.json`                           | Discovered    |
| Lint fix              | `pnpm run lint:fix`     | `package.json`                           | Discovered    |
| Format                | `pnpm run format`       | `package.json`                           | Discovered    |
| Format check          | `pnpm run format:check` | `package.json`                           | Discovered    |
| Unit / use-case tests | `pnpm run test`         | `package.json`, `vitest.config.ts`       | Discovered    |
| Broad check           | `pnpm run check`        | `package.json`                           | Discovered    |
| Migration             | Unknown                 | No database migration tooling discovered | Not available |

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
- Component files/folders may use PascalCase, such as `MyComponent.tsx` or `MyComponent/index.tsx`.
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
- Use NativeWind `className` and Tailwind/theme tokens.
- Reuse `src/components/ui/` primitives before creating local systems.
- Use `react-hook-form` for real forms, with `<Controller />` for controlled primitives.
- Avoid inline arrow functions in JSX returns when reasonably possible; use named handlers.
- Parent layouts own external spacing; reusable children own internal spacing.
- Avoid arbitrary Tailwind values inside shared primitives; promote repeated values to tokens/config.

## Domain conventions

- Each bounded context under `core/` owns domain entities, use-cases, gateways, adapters, selectors, runtime state, and API facade.
- In this starter, `core/` means frontend business core for the Expo app, not backend server code.
- Use-cases live one action per file under action-oriented folders.
- Gateways define stable contracts and keep implementations replaceable.
- API DTOs live in `core/<context>/apis/types.ts`.
- Durable collections keyed by id should use `createEntityAdapter`.
- Test use-cases by dispatching RTK Query endpoints against in-memory adapters.

## Error handling conventions

- Shared technical failures and the generic `Result` container live in `core/shared/domain/`.
- Each bounded context owns a stable error-code union, type guard, and `ContextResult<Value>` alias.
- Every fallible gateway method returns its context result; base queries convert it to RTK Query `{ data }` or `{ error }`.
- Concrete adapters preserve typed context errors, map infrastructure failures, and never expose raw exception messages.
- `.unwrap()` resolves success values and rejects with the exact typed context error.
- Transient request failures stay in RTK Query instead of durable Redux slices.
- Presentation adapters resolve typed errors into safe message keys/copy with caller-provided fallback wording.
- Unknown: global logging, reporting, or crash/error monitoring strategy.

## Session persistence conventions

- Redux `auth.session` is the only runtime authentication source of truth.
- Persist native credentials through `SessionStorage` and `SecureSessionStorage`; never through AsyncStorage or a persisted RTK Query cache.
- Root Redux persistence requires an explicit allowlist of non-sensitive slices.
- Successful logout and account deletion reset all Redux slices/caches and clear secure session storage.
- Application routing must wait for session hydration and initial account retrieval; do not use persisted connection booleans or fixed readiness delays.

## Logging conventions

Unknown. No explicit logging convention was discovered. ESLint allows `console` in `scripts/**/*` only.

## Dependency rules

- UI should not import concrete adapters.
- Screens should rely on context API hooks/selectors and avoid raw infrastructure access.
- Domain should remain independent from UI, navigation, storage, and networking details.
- Avoid generic folders like `helpers`, `misc`, `manager`, or catch-all `utils` without strong justification.

## Environment / config conventions

- `.env*` files are ignored by git.
- Public runtime mode reads `EXPO_PUBLIC_APP_MODE`.
- `EXPO_PUBLIC_APP_MODE=fake` selects the fake auth adapter; other values use in-memory auth.
- Do not store raw env values in memory files.
- Unknown: production env variables, Supabase config, RevenueCat config, CI config, and release config.

## Before final handoff

- Inspect `git status --short`.
- Update [CURRENT.md](CURRENT.md) and [HANDOFF.md](HANDOFF.md).
- Append a factual entry to [WORKLOG.md](WORKLOG.md).
- Update specific stable memory files only when durable facts changed.
- Record commands run and whether validation passed, failed, or was not run.
- If source changed, run the narrowest meaningful validation first, then broader checks when risk warrants it.
