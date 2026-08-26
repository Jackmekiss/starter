# Architecture Map

## App / package structure

| Path                       | Responsibility                                                                                                          | Notes                                                                                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                 | Expo Router routes, route groups, layouts, and screens.                                                                 | Current route groups: `(auth)`, `(on-boarding)`, `(tabs)`, `(tabs)/(home)`; `storybook.tsx` is an explicit development-only route.                                                                  |
| `src/app-runtime/`         | Runtime composition for providers, navigation, store, app mode, context API wiring, and RVA-aligned secure persistence. | `app-runtime.ts` is the explicit hook facade consumed by presentation code.                                                                                                                         |
| `src/components/ui/`       | Reusable UI primitives and co-located Storybook stories.                                                                | Contains 20 local component families under the gluestack-ui v5 design-system contract.                                                                                                              |
| `src/components/ux/`       | UX-specific components that are not generic primitives.                                                                 | Current example: `HapticTab`.                                                                                                                                                                       |
| `src/hooks/`               | App hooks and typed Redux hooks.                                                                                        | Keep business logic in `core/` when it has durable meaning.                                                                                                                                         |
| `src/localization/`        | i18next initialization, supported locale resolution, and the application localization provider.                         | Bundled catalogs live separately under `src/translations/`.                                                                                                                                         |
| `src/translations/`        | Bundled French and English application copy.                                                                            | French is the typed source catalog and fallback locale.                                                                                                                                             |
| `src/constants/`           | App constants and theme exports.                                                                                        | Keep durable domain constants in `core/` when they are business concepts.                                                                                                                           |
| `src/lib/`                 | Small app-level helpers.                                                                                                | Avoid growing generic utility buckets.                                                                                                                                                              |
| `core/auth/`               | Authentication bounded context.                                                                                         | Owns identity/session domain, auth use-cases, auth gateway, adapters, selectors, and RTK Query API options.                                                                                         |
| `core/account/`            | Account bounded context.                                                                                                | Owns profile and onboarding truth, Account use-cases, gateway, adapters, selectors, and RTK Query API options.                                                                                      |
| `core/subscription/`       | Subscription bounded context.                                                                                           | Owns premium entitlement domain, subscription use-cases, gateway, adapters, selectors, and RTK Query API options.                                                                                   |
| `core/shared/`             | Transport-independent contracts and lower-level shared adapters.                                                        | Owns `ApplicationError`, `Result`, `toRtkQueryResult`, and the Supabase slugify helper.                                                                                                             |
| `core/init-redux-store.ts` | Root Redux store factory for bounded-context slices and RTK Query APIs.                                                 | Runtime mounts Auth, Account, and Subscription APIs.                                                                                                                                                |
| `.agents/skills/`          | Repo-specific agent workflow and convention skills.                                                                     | [`frontend-core`](../../.agents/skills/frontend-core/SKILL.md) owns core/runtime guidance; [`frontend-ui`](../../.agents/skills/frontend-ui/SKILL.md) owns presentation and accessibility guidance. |
| `docs/ai/`                 | Project memory system.                                                                                                  | Stable and operational memory for humans and agents.                                                                                                                                                |
| `plans/`                   | Multi-session feature plans.                                                                                            | Use only when work is too large/risky for a single session.                                                                                                                                         |

## Frontend/backend boundaries

- `src/app` and `src/components` are UI/presentation layers.
- `core/<bounded-context>` owns business meaning, use-cases, gateways, adapters, selectors, and context API options.
- Screens should consume context APIs/use-cases and selectors, not concrete adapters.
- Gateways define contracts; adapters implement concrete data sources.
- No backend route files, server actions, webhooks, database schema, or migrations were discovered.

## Important architectural patterns

- Starter applies strategic DDD to organize frontend business truth by bounded context and pragmatic Clean Architecture to isolate UI, transport, storage, and SDK details.
- Redux Toolkit in `domain/slice.ts` and RTK Query in use-cases/APIs are intentional parts of this frontend architecture, not violations to replace with academic abstractions.
- Use-cases are explicit RTK Query endpoint builders under `core/<context>/use-cases/<action>/`.
- Use-cases call their business gateway directly through `queryFn`; `toRtkQueryResult` owns the RTK Query result adaptation for each context.
- Context API options are assembled in `core/<context>/apis/*-api.ts`.
- Runtime adapters are selected in `src/app-runtime/runtime/*`; auth supports in-memory, fake, and opt-in HTTP implementations.
- In-memory adapters are valid local infrastructure while real backend/provider integrations are absent.
- Durable collections keyed by id should use `createEntityAdapter`; subscription offerings already do.
- Fallible operations use shared `Result<Value, Failure>` and `ApplicationError<Code>` primitives under `core/shared/domain/`.
- Each bounded context owns stable business error codes, maps infrastructure failures in adapters, and exposes typed RTK Query error channels.
- Transient request failures remain in RTK Query; durable slices only store failures when the failure itself is product truth shared across flows.
- Authenticated concrete adapters should read credentials from an injected current-session provider rather than accept transport credentials through use-cases or business gateways.
- Adapter files are grouped by named concern such as `errors/`, `fake/`, `http/`, `in-memory/`, `presentation/`, `selectors/`, or another concrete transport.
- Time-dependent adapters receive the shared `DateProvider`; runtime composition injects
  `RealDateProvider` and deterministic local adapters may inject `DeterministicDateProvider`.

## Dependency direction rules

- UI depends on bounded-context APIs/selectors.
- `core/` never imports `src/`, and bounded contexts do not import one another directly.
- Domain models should not depend on UI, navigation, storage, or network implementation details.
- Gateways expose contracts and should not know concrete infrastructure.
- Adapters depend on gateways/domain/API DTOs and are replaceable.
- Shared helpers should not become vague catch-all business logic.

## State management approach

- Redux Toolkit slices store durable bounded-context state.
- RTK Query powers use-case APIs and async action orchestration.
- Redux Persist uses `secureSessionStorage`, aligned with RVA, for the serialized root state.
- The storage adapter recursively strips `accessToken` and `refreshToken` from every AsyncStorage slice and RTK Query result.
- Only fulfilled RTK Query queries are retained by the persistence transform.
- Redux `auth.session` is the single runtime source of authentication truth.
- Expo SecureStore persists the validated session with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`; rehydration injects it back into the serialized auth slice before Redux receives state.
- SecureStore writes are serialized so older tokens cannot overwrite newer credentials.
- Selectors live under bounded contexts and use `createSelector` for derived objects/arrays/read models.

## Auth / session approach

- Auth state stores only runtime `user` and `session`; connection derives from `session`.
- Account state separately stores the current profile and durable onboarding status.
- The secure-session adapter stays in `src/app-runtime/runtime/`; the auth domain remains independent from storage.
- `PersistGate` waits for secure-session rehydration before mounting route selection.
- Account provisioning starts only after a rehydrated session exists, and the splash remains visible during its first attempt.
- Route selection derives connection from `auth.session` and onboarding from `account.current`.
- Missing Account after a failed provisioning attempt renders localized retry UI without clearing the valid session.
- Successful logout and account deletion clear `auth.session`; the next serialized persistence write removes SecureStore credentials.
- `EXPO_PUBLIC_APP_MODE=fake` selects `FakeAuthGateway`; `http` selects `HttpAuthGateway`; all other modes use `InMemoryAuthGateway`.
- The HTTP adapter reads the current Redux session through an injected `AuthSessionProvider` immediately before protected requests.
- `EXPO_PUBLIC_AUTH_API_URL` configures the sample HTTP origin; the production backend/provider remains unspecified.

## Background jobs / queues

Unknown / none discovered.

## Integrations

- Expo Localization provides the phone language; i18next and react-i18next provide typed French/English UI translation.
- The optional auth HTTP adapter uses the platform `fetch` API, validates successful JSON, and maps remote failures before the gateway boundary.
- RevenueCat subscription boundaries exist through `RevenueCatSubscriptionRuntime` and `RevenueCatSubscriptionGateway`.
- Supabase dependency exists in `package.json`, and a shared Supabase slugify helper exists, but no configured Supabase client, schema, or migrations were discovered.
- Expo SecureStore is configured and used by `secureSessionStorage`; unsupported platforms keep the Redux runtime session but never persist credentials in AsyncStorage.

## Deployment / runtime assumptions

- Expo app with `expo-router/entry`.
- NativeWind v5 preview is wired through Tailwind CSS v4/PostCSS and Metro import rewrites; Babel uses only `babel-preset-expo`.
- UI composition uses the local gluestack-ui v5 component contract, NativeWind, and React Native implementation primitives.
- Poppins is versioned under `public/fonts/` and shared by the native Expo font plugin and web CSS.
- Storybook uses official entry-point swapping through `.rnstorybook/index.tsx` by default. `EXPO_PUBLIC_STORYBOOK_ENABLED=true` adds the development-only `/storybook` route and Home launcher.
- The local `BottomSheetModalProvider` composes Gorhom's portal host outside the guarded application sibling so open sheets hide background accessibility and receive Android hardware back first.
- `app.json` configures iOS, Android, web, splash screen, typed routes, and React Compiler.
- `ios/` exists locally but is ignored by `.gitignore`; treat generated native folders carefully.
- Build/release commands are Unknown; no `build` script was discovered in `package.json`.
