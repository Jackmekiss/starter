# Starter Baseline

This file stores durable facts about the starter itself. Keep it when initializing a new project from this repo.

## Starter purpose

This repository is an Expo/React Native starter with frontend-first architecture, local project-memory workflows, and scaffolding for authentication, onboarding, and subscription capabilities.

## Durable technical stack

- Expo Router for route groups, layouts, and navigation.
- React Native with Expo SDK.
- NativeWind and Tailwind tokens for styling.
- Redux Toolkit and RTK Query for bounded-context use-cases and runtime state.
- Redux Persist with AsyncStorage for persisted app state.
- Zustand for the lightweight persisted `isConnected` UI session flag.
- Vitest for use-case behavior specs under `core/**/use-cases/**/*.spec.ts`.
- Oxlint, ESLint, TypeScript, and Oxfmt for validation.

## Starter bounded contexts

- `core/auth`: account, session, auth use-cases, auth gateway, local/fake adapters, selectors, and RTK Query API options.
- `core/subscription`: subscription entitlement, offerings, billing use-cases, subscription gateway, in-memory/fake/RevenueCat adapters, selectors, and RTK Query API options.

## Starter architecture rules

- `src/app/` owns Expo Router routes, screens, layouts, and orchestration.
- `src/components/` owns reusable UI primitives and presentational UI blocks.
- `core/` owns durable product truth, domain models, use-cases, gateways, adapters, selectors, and context APIs.
- Screens should not contain durable domain logic.
- UI state should not leak into domain models.

## Starter memory rules

- `docs/ai/` is the source of truth for project memory.
- Technical starter memory should survive project initialization.
- Product, domain, current state, worklog, decisions, failed attempts, open questions, and active plans may be reset for each new project.
- Use `initialize project memory for <project name>` when a derived repo becomes a new project.

## Known starter caveats

- Product-specific facts are intentionally Unknown until a project supplies them.
- No production database schema or migration set is part of the current starter memory.
- No production auth provider, Supabase setup, or RevenueCat configuration is confirmed by default.
