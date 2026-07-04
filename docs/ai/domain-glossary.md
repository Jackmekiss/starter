# Domain Glossary

| Term | Meaning | Source / where seen | Notes |
|---|---|---|---|
| Account | User-owned profile data attached to an authenticated identity. | `core/auth/domain/account.ts` | Includes id, email, optional avatar/name fields, onboarding status, and creation timestamp. |
| Account owner | The implied end user who owns an account. | `core/auth/domain/account.ts`, auth use-cases | Product-specific role name is Unknown. |
| AuthUser | Minimal authenticated identity returned by login or registration. | `core/auth/domain/auth.ts` | Contains id and email. Distinct from `Account`. |
| Session | Authentication token state for the current user. | `core/auth/domain/auth.ts` | Contains user id, access token, optional refresh token, optional expiry. Do not store real token values in memory files. |
| OnboardingStatus | Account lifecycle stage controlling whether the user can enter the main app. | `core/auth/domain/account.ts` | Values: `pending`, `in-progress`, `completed`. |
| AuthState | Durable authentication runtime state. | `core/auth/domain/slice.ts` | Tracks status, user, session, account, error, and logout request flag. |
| AuthError | User-facing auth failure with a stable code and message. | `core/auth/apis/types.ts` | Codes include invalid credentials, email issues, weak password, reset issues, OAuth cancellation, provider unavailable, network, unknown. |
| RegisterPayload | Credentials and optional profile data required to create an account. | `core/auth/apis/types.ts` | Email/password plus optional first/last name. |
| LoginPayload | Email/password credentials for standard login. | `core/auth/apis/types.ts` | Used by the `/login` auth gateway request. |
| UpdateAccountPayload | Editable account profile fields. | `core/auth/apis/types.ts` | Can update avatar, names, and onboarding status. |
| Subscription | Current premium entitlement and renewal metadata. | `core/subscription/domain/subscription.ts` | Singleton state for current account's subscription. |
| SubscriptionTier | Product access tier granted to the account. | `core/subscription/domain/subscription.ts` | Values: `free`, `premium`. |
| SubscriptionStatus | Provider-normalized premium lifecycle state. | `core/subscription/domain/subscription.ts` | Values: `inactive`, `trialing`, `active`, `canceled`. |
| SubscriptionPlan | Commercial billing interval for premium access. | `core/subscription/domain/subscription.ts`, `core/subscription/domain/subscription-plan.ts` | Values: `annual`, `monthly`. |
| SubscriptionOffering | Sellable premium option displayed before purchase. | `core/subscription/domain/subscription-offering.ts` | Includes id, plan, title, price label, period label, and optional badges/details. |
| SubscriptionActionResult | Result for subscription actions that can change entitlement. | `core/subscription/apis/types.ts` | Either success with subscription and plan, or failure with error message. |
| Premium | Paid access state. | `core/subscription/adapters/selectors/subscription-selectors.ts` | Selector treats `premium` with `active` or `trialing` as premium. |
| Gateway | Abstract data access contract for a frontend bounded context. | `.agents/skills/frontend-domain-layer/references/gateways.md` | Current examples: `AuthBaseQuery`, `SubscriptionBaseQuery`. |
| Adapter | Concrete implementation of a frontend gateway. | `.agents/skills/frontend-domain-layer/references/adapters.md` | Current examples: in-memory, fake, RevenueCat subscription adapter. |
| Use-case | Explicit application action modeled under a frontend bounded context. | `.agents/skills/frontend-domain-layer/references/use-cases.md`, `core/*/use-cases` | Names should be verb-based and business-first. |
| Bounded context | Folder under frontend `core/` that owns durable product truth for the Expo app. | `.agents/skills/frontend-architecture/references/repo-structure.md` | Current contexts: `auth`, `subscription`; `shared` has shared adapters/helpers. Not a backend bounded context by default. |
| appMode | Public runtime mode used to select concrete data sources. | `src/app-runtime/runtime/app-mode.ts` | Reads `EXPO_PUBLIC_APP_MODE`; `fake` enables fake auth adapter, otherwise in-memory auth adapter. |
| isConnected | Persisted UI session flag used before full account retrieval completes. | `src/stores/session-store.ts` | Zustand state, not the full auth domain session. Do not confuse with `auth.session`. |
