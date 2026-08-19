# Synchronize Reusable RVA Patterns

## Purpose

Bring reusable architectural and implementation patterns that matured in `rva-app` back into `starter` without importing RVA-specific product behavior.

## User outcome

New projects derived from `starter` begin with the current architecture guidance and a coherent, typed error-management example instead of the older mixed success-union, thrown-exception, and stored-message patterns.

## Context

- `starter` is the reusable Expo/Clean Architecture/DDD foundation.
- `rva-app` is a production-derived project where the original patterns evolved.
- The repositories are independent Git worktrees; only `starter` is changed by this plan.

## Relevant memory files

- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/api-contracts.md`
- `docs/ai/testing-validation.md`

## Relevant source files

- `.agents/skills/frontend-*/**`
- `core/shared/domain/**`
- `core/auth/**`
- `core/subscription/**`

## Scope

- Synchronize reusable skill guidance from `rva-app` while preserving the starter's `frontend-*` naming and its stronger use-case testing guidance.
- Add shared `ApplicationError` and `Result` contracts.
- Migrate `auth` and `subscription` gateway operations to bounded-context `Result` contracts.
- Keep transient request failures in RTK Query rather than durable Redux slices.
- Add safe presentation-resolver examples without coupling the starter to a translation library.
- Update use-case specs and durable project memory.

## Non-goals

- Copy RVA business contexts, backend codes, generated clients, translations, or product copy.
- Add a real auth, billing, or i18next integration.
- Change placeholder screens or launch Expo.

## Plan

1. Inventory and classify the reusable deltas between the repositories.
2. Merge architecture, domain, UI, coding, accessibility, and adapter guidance into the starter skills.
3. Add shared typed-error and `Result` primitives.
4. Migrate the complete `auth` bounded context.
5. Migrate the complete `subscription` bounded context.
6. Update use-case behavior specs for failure propagation and success-only state updates.
7. Run formatting, lint, typecheck, and tests; fix regressions caused by the migration.
8. Update project memory and close the plan.

## Progress

- [x] Inventory and classify repository deltas.
- [x] Synchronize reusable skills.
- [x] Add shared contracts.
- [x] Migrate `auth`.
- [x] Migrate `subscription`.
- [x] Update tests.
- [x] Validate.
- [x] Update memory and handoff.

## Decisions

- Migrate one complete bounded context at a time; do not leave mixed legacy and typed error contracts.
- Use application-meaning codes in each context, with technical categories shared globally.
- Preserve `starter` improvements newer than `rva-app`, notably `frontend-*` skill names and colocated use-case testing guidance.

## Validation

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for all changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` remains blocked by pre-existing formatting findings in untouched files.
- Global `pnpm run lint` remains blocked by pre-existing findings in `src/components/ui/BottomSheetModal.tsx` and `src/components/ui/Button.tsx`.

## Risks

- RTK Query endpoint builder generics may expose contract mismatches across all use-cases.
- Existing specs assert durable transient errors and legacy success unions; they must assert `.unwrap()` rejection instead.
- Subscription's RevenueCat abstraction must map unknown runtime exceptions without leaking messages.

## Open questions

- None blocking. `starter` has no concrete translation runtime, so presentation resolvers will use an injected message resolver rather than introduce i18next as a dependency.

## Handoff notes

Implementation is complete. Review the final diff and commit when desired; global check debt is documented in project memory.
