# Align Secure Session With RVA

## Purpose

Replace the first Starter-specific SecureStore implementation with the persistence architecture proven in `rva-app`.

## User outcome

Starter uses the same Redux Persist secure-session storage algorithm and the same Expo package as RVA, with only bounded-context and application-key names adapted.

## Context

The first implementation introduced a `SessionStorage` gateway, auth gateway decorator, and explicit bootstrap that do not exist in RVA. RVA instead provides a `WebStorage` adapter that extracts the session to SecureStore, sanitizes every AsyncStorage copy, serializes token writes, and injects the secure session during Redux rehydration.

## Relevant memory files

- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/user-flows.md`
- `docs/ai/data-model.md`
- `docs/ai/api-contracts.md`

## Relevant source files

- `rva-app/src/app-runtime/runtime/secure-session-storage.ts`
- `rva-app/src/app-runtime/runtime/store-runtime.ts`
- `starter/src/app-runtime/runtime/secure-session-storage.ts`
- `starter/src/app-runtime/runtime/store-runtime.ts`
- `starter/core/init-redux-store.ts`

## Scope

- Port RVA's secure-session `WebStorage` adapter line-for-line where context names allow.
- Use `expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Serialize token writes and recursively remove sensitive fields from AsyncStorage state and RTK Query data.
- Restore RVA's fulfilled-query persistence transform.
- Remove the Starter-specific session gateway, decorator, and explicit bootstrap.
- Keep Starter's Redux-derived route guards; do not restore RVA product-specific Zustand navigation state.
- Align documentation and tests with the RVA-backed implementation.

## Non-goals

- Copy RVA identity flows, SDK token-refresh hook, tenant startup, or product-specific Zustand state.
- Upgrade Starter from Expo SDK 56 to RVA's Expo SDK 57 solely to match a package number.
- Change subscription behavior.

## Plan

1. Port and adapt RVA secure-session storage.
2. Rewire Redux Persist and remove divergent session infrastructure.
3. Restore auth tests to their normal in-memory gateway boundary.
4. Update memory and decisions.
5. Run targeted and broad validation.

## Progress

- Complete: RVA secure-session storage port.
- Complete: Redux Persist and account bootstrap wiring.
- Complete: removal of the divergent gateway/decorator/bootstrap implementation.
- Complete: durable memory and final validation.

## Decisions

- Preserve the exact RVA storage algorithm while adapting `identityAndAccess` to Starter's `auth` slice.
- Keep Starter's Expo-compatible `expo-secure-store` version rather than installing the SDK 57 build into an SDK 56 application.

## Validation

- Passed: mechanical comparison against RVA; only bounded-context/application names and Starter Oxfmt wrapping differ.
- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: `git diff --check`.
- Confirmed: `expo-secure-store` is already installed and configured with Starter's Expo SDK 56-compatible version `56.0.4`.
- Global `pnpm run check` stops on 10 pre-existing unrelated formatting issues.

## Risks

- Redux Persist's nested serialization format must remain identical to RVA's expectations.
- Package versions must remain compatible with Starter's Expo SDK.

## Open questions

- None blocking.

## Handoff notes

Implementation is complete and uncommitted on `master` after `03ff09d`.
