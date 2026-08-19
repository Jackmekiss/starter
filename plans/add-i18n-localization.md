# Add I18n Localization

## Purpose

Add the reusable i18n runtime already proven in `rva-app` to Starter.

## User outcome

Starter displays French or English copy from the phone locale and exposes a typed `useTranslation` hook for every screen.

## Context

The presentation error resolvers already return hierarchical translation keys, but Starter has no translation runtime or catalogs yet.

## Relevant memory files

- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/user-flows.md`

## Relevant source files

- `src/app-runtime/root-app-providers.tsx`
- `src/app/(auth)/index.tsx`
- `src/localization/`
- `src/translations/`
- `src/hooks/localization/useTranslation.ts`
- `src/types/i18next.d.ts`
- `app.json`
- `package.json`

## Scope

- Add `i18next`, `react-i18next`, and the Expo-compatible `expo-localization` package.
- Add French and English translation catalogs.
- Resolve the phone language to a supported locale with a French fallback.
- Provide i18next at the application root.
- Add a typed app-facing hook and one real translated screen.
- Include every message key currently consumed by auth and subscription error resolvers.

## Non-goals

- Tenant-specific or remotely generated translations.
- A user-facing language selector.
- Product-specific final copy for placeholder screens.

## Plan

1. Add the localization dependencies and Expo plugin.
2. Add typed catalogs, locale resolution, i18next initialization, provider, and hook.
3. Render translated placeholder copy on the auth entry screen.
4. Validate formatting, lint, types, tests, and Expo configuration.
5. Update project memory and close this plan.

## Progress

- [x] Compare the `rva-app` localization runtime.
- [x] Add dependencies and runtime files.
- [x] Wire the provider and translated UI usage.
- [x] Validate the implementation.
- [x] Update project memory.

## Decisions

- Keep bundled catalogs under `src/translations/en.json` and `src/translations/fr.json` as requested.
- Use French as the fallback, matching the reference app.
- Keep translation keys flat and hierarchical with `__` separators.

## Validation

- Passed: `pnpm run typecheck`.
- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: `npx expo config --type public` with `expo-localization` registered.
- Passed: catalog parity check (14 keys in each locale).
- Passed: targeted formatting check and `git diff --check`.
- Global `pnpm run check` stops on 10 pre-existing unrelated formatting issues.

## Risks

- `expo-localization` must match Expo SDK 56.
- i18next resource typing must stay synchronized with the French source catalog.

## Open questions

- None blocking.

## Handoff notes

Implementation is complete. Commit and push only when requested; `rva-app` remains untouched.
