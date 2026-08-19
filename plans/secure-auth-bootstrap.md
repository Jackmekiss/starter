# Secure Auth Bootstrap

## Purpose

Remove insecure token persistence and make authentication startup deterministic.

## User outcome

The starter stores session tokens with Expo SecureStore, uses Redux auth state as the only runtime source of truth, and chooses routes only after session hydration and account retrieval finish.

## Context

The root Redux state and RTK Query mutations are currently persisted in AsyncStorage. A separate persisted Zustand flag also represents connection state, which can diverge from the auth bounded context during startup.

## Relevant memory files

- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/user-flows.md`
- `docs/ai/data-model.md`
- `docs/ai/api-contracts.md`

## Relevant source files

- `core/auth/domain/slice.ts`
- `core/auth/gateways/session-storage.ts`
- `core/auth/adapters/secure-store/secure-session-storage.ts`
- `core/init-redux-store.ts`
- `src/app-runtime/runtime/store-runtime.ts`
- `src/app-runtime/root-navigator.tsx`
- `src/hooks/app-shell/useAppReadiness.ts`

## Scope

- Persist only explicitly allowed non-sensitive Redux slices in AsyncStorage.
- Persist session tokens behind a `SessionStorage` port implemented with Expo SecureStore.
- Synchronize secure storage from auth lifecycle actions.
- Clear auth state, RTK Query cache, and SecureStore after successful logout or account deletion.
- Remove the persisted Zustand connection flag.
- Hydrate the session and retrieve the account before computing navigation guards.
- Add focused behavior assertions for secure session synchronization and logout cleanup.

## Non-goals

- Implement a production auth backend.
- Build auth or startup error screens.
- Change subscription runtime behavior.
- Fix unrelated repository-wide formatting and lint debt.

## Plan

1. Add the session-storage port and SecureStore adapter.
2. Add auth hydration state/actions and runtime session synchronization.
3. Restrict Redux persistence and remove persisted API caches.
4. Replace Zustand routing state with deterministic auth bootstrap.
5. Remove the obsolete Zustand dependency and update durable memory.
6. Run focused and repository-wide validation.

## Progress

- Complete: session-storage port and SecureStore adapter.
- Complete: auth lifecycle persistence and logout/account-deletion cleanup.
- Complete: explicit non-sensitive Redux persistence allowlist without RTK Query cache.
- Complete: removal of Zustand session state and deterministic startup bootstrap.
- Complete: focused and repository-wide validation plus checkpoint memory.

## Decisions

- Redux `auth.session` is the sole runtime source of authentication truth.
- SecureStore is a persistence boundary, not a second runtime store.
- Web falls back to process-memory session storage rather than persisting tokens in an unencrypted browser store.
- RTK Query cache is not persisted.

## Validation

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for every changed source file.
- Passed: targeted Oxfmt for changed source, documentation, plan, and package files.
- Passed: `git diff --check`.
- Global `pnpm run check` reaches only pre-existing formatting debt in 11 unrelated files.

## Risks

- SecureStore is asynchronous, so routing must remain blocked until hydration completes.
- Auth lifecycle persistence must preserve action order to avoid restoring a session after logout.

## Open questions

- A future production adapter must define the user-facing behavior for an account retrieval failure during bootstrap.

## Handoff notes

Implementation is complete and remains uncommitted on `master`. A future production adapter still needs a user-facing retry/error strategy for account retrieval failures during bootstrap.
