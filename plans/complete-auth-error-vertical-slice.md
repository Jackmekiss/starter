# Complete Auth Error Vertical Slice

## Purpose

Provide one production-shaped authentication error example from HTTP infrastructure to localized UI copy.

## User outcome

The login screen submits credentials, shows loading and validation states, and displays safe French or English messages for mapped backend and transport failures.

## Context

Starter already has `ApplicationError`, `Result`, typed RTK Query errors, presentation resolvers, and i18n catalogs. The missing part is a complete consumer path and a concrete HTTP mapper. Fake failures are not currently injectable across every operation.

## Relevant memory files

- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/user-flows.md`
- `docs/ai/api-contracts.md`
- `docs/ai/testing-validation.md`

## Relevant source files

- `core/auth/adapters/http/`
- `core/auth/adapters/fake/fake-auth-gateway.ts`
- `core/auth/adapters/presentation/auth-error-message.ts`
- `core/auth/gateways/auth-session-provider.ts`
- `core/auth/use-cases/log-in/`
- `src/app-runtime/runtime/`
- `src/components/auth/login-form.tsx`
- `src/app/(auth)/index.tsx`
- `src/translations/en.json`
- `src/translations/fr.json`

## Scope

- Add a configurable HTTP auth adapter that maps documented backend codes, HTTP statuses, timeouts, and network failures to `AuthError`.
- Inject the current Redux session into protected HTTP requests through a read-only provider.
- Make fake adapter failure injection apply uniformly to every operation.
- Build a `react-hook-form` login form consuming `useLoginMutation().unwrap()` and `resolveAuthErrorMessage`.
- Add localized form, validation, loading, and fallback copy.
- Add use-case tests proving HTTP and fake failures reach `.unwrap()` unchanged without mutating durable auth state.

## Non-goals

- Define a real production backend implementation or credentials.
- Implement token refresh.
- Build registration, password reset, social login, onboarding, or account screens.
- Launch Expo or perform manual device QA unless explicitly requested.

## Plan

1. Add HTTP DTO decoding and infrastructure error mapping.
2. Add authenticated HTTP adapter wiring and runtime mode selection.
3. Make fake failure injection uniform.
4. Add the localized login form and consume the auth resolver.
5. Add vertical use-case coverage and validate the repository.
6. Update project memory and close the plan.

## Progress

- [x] Audit the existing auth error pipeline and RVA presentation pattern.
- [x] Add the HTTP adapter and session provider.
- [x] Normalize fake failure injection.
- [x] Add the localized login UI.
- [x] Add vertical tests and validate.
- [x] Update project memory.

## Decisions

- Use `EXPO_PUBLIC_APP_MODE=http` and `EXPO_PUBLIC_AUTH_API_URL` to opt into the HTTP adapter; local in-memory behavior remains the default.
- Keep backend codes inside `core/auth/adapters/http/`; only stable `AuthError` values cross the gateway.
- Read bearer credentials immediately before protected requests through an injected provider backed by Redux.

## Validation

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint.
- Passed: catalog parity check (24 keys per locale).
- Passed: targeted formatting check and `git diff --check`.
- Global `pnpm run check` stops on 10 pre-existing unrelated formatting issues.

## Risks

- The sample REST contract must be documented as an adapter contract, not mistaken for a discovered backend.
- Runtime session-provider wiring must avoid a second session source of truth.
- The UI must never display raw backend messages.

## Open questions

- The production auth backend remains unspecified; the HTTP adapter demonstrates the boundary and must be adapted to the chosen backend contract.

## Handoff notes

Implementation is complete. Review and commit/push only when requested; `rva-app` remained read-only.
