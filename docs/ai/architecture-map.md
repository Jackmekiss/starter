# Architecture Map

## App / package structure

| Path | Responsibility | Notes |
|---|---|---|
| `src/app/` | Expo Router routes, route groups, layouts, and screens. | Current route groups: `(auth)`, `(on-boarding)`, `(tabs)`, `(tabs)/(home)`. Screens are placeholders. |
| `src/app-runtime/` | Runtime composition for providers, navigation, store, app mode, auth API wiring, and persistence transforms. | `src/app/_layout.tsx` exports runtime APIs for screens. |
| `src/components/ui/` | Reusable UI primitives. | Includes `Button`, `Icon`, `Input`, `Text`, `TextArea`, `BottomSheetModal`. |
| `src/components/ux/` | UX-specific components that are not generic primitives. | Current example: `HapticTab`. |
| `src/hooks/` | App hooks and typed Redux hooks. | Keep business logic in `core/` when it has durable meaning. |
| `src/stores/` | UI/runtime stores outside bounded contexts. | Current Zustand `session-store` persists `isConnected`. |
| `src/constants/` | App constants and theme exports. | Keep durable domain constants in `core/` when they are business concepts. |
| `src/lib/` | Small app-level helpers. | Avoid growing generic utility buckets. |
| `core/auth/` | Authentication bounded context. | Owns account/session domain, auth use-cases, auth gateway, adapters, selectors, and RTK Query API options. |
| `core/subscription/` | Subscription bounded context. | Owns premium entitlement domain, subscription use-cases, gateway, adapters, selectors, and RTK Query API options. |
| `core/shared/` | Shared lower-level adapters/helpers. | Current discovered file: Supabase slugify helper. |
| `core/init-redux-store.ts` | Root Redux store factory for bounded-context slices and RTK Query APIs. | Can mount auth and subscription APIs; runtime currently mounts auth API. |
| `.agents/skills/` | Repo-specific agent workflow and convention skills. | `frontend-*` skills cover the Expo app and frontend business core only; project memory skills cover continuity. |
| `docs/ai/` | Project memory system. | Stable and operational memory for humans and agents. |
| `plans/` | Multi-session feature plans. | Use only when work is too large/risky for a single session. |

## Frontend/backend boundaries

- `src/app` and `src/components` are UI/presentation layers.
- `core/<bounded-context>` owns business meaning, use-cases, gateways, adapters, selectors, and context API options.
- Screens should consume context APIs/use-cases and selectors, not concrete adapters.
- Gateways define contracts; adapters implement concrete data sources.
- No backend route files, server actions, webhooks, database schema, or migrations were discovered.

## Important architectural patterns

- Frontend-first architecture inspired by Clean Architecture, Domain-Driven Design, and bounded contexts.
- Use-cases are explicit RTK Query endpoint builders under `core/<context>/use-cases/<action>/`.
- Context API options are assembled in `core/<context>/apis/*-api.ts`.
- Runtime adapters are selected in `src/app-runtime/runtime/*`.
- In-memory adapters are valid local infrastructure while real backend/provider integrations are absent.
- Durable collections keyed by id should use `createEntityAdapter`; subscription offerings already do.

## Dependency direction rules

- UI depends on bounded-context APIs/selectors.
- Domain models should not depend on UI, navigation, storage, or network implementation details.
- Gateways expose contracts and should not know concrete infrastructure.
- Adapters depend on gateways/domain/API DTOs and are replaceable.
- Shared helpers should not become vague catch-all business logic.

## State management approach

- Redux Toolkit slices store durable bounded-context state.
- RTK Query powers use-case APIs and async action orchestration.
- Redux Persist stores root state in AsyncStorage with a transform that keeps only fulfilled RTK Query cache entries.
- Zustand persists the `isConnected` UI session flag before full account retrieval completes.
- Selectors live under bounded contexts and use `createSelector` for derived objects/arrays/read models.

## Auth / session approach

- Auth domain state stores `user`, `session`, `account`, `status`, `error`, and `logoutRequested`.
- Route selection combines persisted `isConnected`, auth status, account, and onboarding status.
- `EXPO_PUBLIC_APP_MODE=fake` selects `FakeAuthBaseQuery`; all other modes use `InMemoryAuthBaseQuery`.
- No production auth backend/provider configuration was discovered.

## Background jobs / queues

Unknown / none discovered.

## Integrations

- RevenueCat subscription boundaries exist through `RevenueCatSubscriptionRuntime` and `RevenueCatSubscriptionBaseQuery`.
- Supabase dependency exists in `package.json`, and a shared Supabase slugify helper exists, but no configured Supabase client, schema, or migrations were discovered.
- Expo SecureStore plugin is configured in `app.json`.

## Deployment / runtime assumptions

- Expo app with `expo-router/entry`.
- NativeWind is wired through Babel and Metro.
- `app.json` configures iOS, Android, web, splash screen, typed routes, and React Compiler.
- `ios/` exists locally but is ignored by `.gitignore`; treat generated native folders carefully.
- Build/release commands are Unknown; no `build` script was discovered in `package.json`.
