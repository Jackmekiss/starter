# Technical Memory

This file records cross-cutting facts that are costly to rediscover. Coding procedures and
blueprint versions belong to the linked skills, not here.

## Commands

| Purpose                     | Command                                  |
| --------------------------- | ---------------------------------------- |
| Install                     | `pnpm install`                           |
| Expo development            | `pnpm start`                             |
| iOS / Android / Web         | `pnpm ios` / `pnpm android` / `pnpm web` |
| Direct Storybook            | `pnpm storybook`                         |
| In-app Storybook            | `pnpm storybook:in-app`                  |
| Generate Storybook registry | `pnpm storybook:generate`                |
| Tests                       | `pnpm test`                              |
| Typecheck                   | `pnpm typecheck`                         |
| Lint                        | `pnpm lint`                              |
| Format check                | `pnpm format:check`                      |
| Broad static check          | `pnpm check`                             |

Package management is pinned to pnpm 11.7.0. Do not record a command as passing unless it ran in the
current task or a factual Worklog entry records it.

## Runtime and Topology

- Expo Router owns routes and layouts under `src/app/`.
- Frontend business source lives under `core/`; it is not backend code.
- `src/app-runtime/` is the concrete composition edge. Presentation imports public hooks from
  `src/app-runtime/app-runtime.ts`, not stores, gateways, or API instances.
- Aliases resolve `@/*` to `src/*`, `@core/*` to `core/*`, and `@@/*` to the repository root.
- Redux Toolkit stores durable bounded-context state. RTK Query owns request lifecycles and async
  application actions.
- Behavior specs exercise RTK Query endpoints with the real store and deterministic adapters.
- Time-dependent adapters receive a `DateProvider`.
- No backend, migration system, deployment pipeline, or production monitoring owner exists here.

## UI Toolchain

- React Native UI uses local shadcn-style primitives, NativeWind v5, Tailwind CSS v4, CVA, and focused
  RN Primitives. Gluestack is not installed.
- Semantic light/dark tokens live in `src/global.css`; navigation follows the same appearance source.
- Poppins assets are versioned for native and web.
- The shared UI surface contains 19 Fifteen-derived component families under `src/components/ui/`.
- Stories are colocated with primitives.
- Direct Storybook swaps the Expo entry point. In-app Storybook intentionally adds a guarded
  development route and Home launcher.
- The local Bottom Sheet provider owns portal order, background accessibility isolation, and Android
  back handling.

## Localization and Session Facts

- French and English catalogs live in `src/translations/`; French is the typed fallback catalog.
- Presentation uses the app localization hook and stores localized copy only at the UI boundary.
- Redux `auth.session` is the runtime authentication truth.
- Secure session storage keeps credentials in Expo SecureStore and sanitizes persisted AsyncStorage
  and RTK Query values.
- Serialized secure writes prevent an older token write from overwriting a newer rotation.
- Startup routing waits for initial authenticated Account resolution.
- Current runtime modes are in-memory, fake, and the sample HTTP Auth adapter.
- Public environment names are documented in the versioned environment example; raw values never
  belong in memory.

## Operational Notes

- NativeWind remains on its preview-compatible dependency set; upgrade NativeWind, React Native CSS,
  Tailwind, PostCSS, and the Lightning CSS override together.
- Keep the Storybook React Native package set aligned with Expo.
- Native VoiceOver/TalkBack, permission, gesture, and hardware-back behavior require real target
  validation; browser Storybook cannot prove them.
- RevenueCat production configuration, production Auth behavior, deployment, release automation,
  logging, and crash reporting remain `Unknown`.

## Normative Owners

- [frontend-core](../../.agents/skills/frontend-core/SKILL.md) owns frontend DDD, use cases, state,
  gateways, adapters, errors, behavior specs, and runtime wiring.
- [frontend-ui](../../.agents/skills/frontend-ui/SKILL.md) owns routes, components, forms, styling,
  localization, accessibility, and Storybook.
- [architecture-map.md](architecture-map.md) describes current file ownership.
- [testing-validation.md](testing-validation.md) describes validation evidence.
- [project-memory](../../.agents/skills/project-memory/SKILL.md) owns memory procedures.
