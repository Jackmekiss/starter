# API Contracts

## API style

No HTTP API route files, server actions, GraphQL schema, webhooks, or backend handlers were discovered.

The current app uses RTK Query endpoint builders over local gateway contracts. Gateway requests use internal `url` strings such as `/login` or `/purchase`; these are not discovered server endpoints.

## Internal contracts

| Area                         | Path / endpoint                                         | Purpose                                                | Auth                                                | Notes                                                                    |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| Auth API options             | `core/auth/apis/auth-api.ts`                            | Builds RTK Query endpoints for auth use-cases.         | Current user context comes from auth state/gateway. | Runtime mounted in `src/app-runtime/runtime/auth-runtime.ts`.            |
| Auth gateway                 | `core/auth/gateways/auth-base-query.ts`                 | Contract for account/auth data source.                 | Depends on adapter implementation.                  | Internal request union maps to abstract methods.                         |
| Register                     | `/register`                                             | Create auth user, account profile, and session.        | Unauthenticated.                                    | Body: `RegisterPayload`; result: `AuthResult`.                           |
| Login                        | `/login`                                                | Authenticate with email/password.                      | Unauthenticated.                                    | Body: `LoginPayload`; result: `AuthResult`.                              |
| Retrieve account             | `/retrieve`                                             | Retrieve current account profile.                      | Current session implied.                            | Result: `Account                                                         | null`. |
| Update account               | `/update`                                               | Persist editable account fields.                       | Current session implied.                            | Body: `UpdateAccountPayload`; result: `Account`.                         |
| Request password reset       | `/password/request-reset`                               | Start password reset flow.                             | Unauthenticated.                                    | Body: `RequestPasswordResetPayload`; result: `AuthActionResult`.         |
| Reset password               | `/password/reset`                                       | Complete password reset.                               | Reset challenge implied.                            | Body: `ResetPasswordPayload`; result: `AuthActionResult`.                |
| Google login                 | `/login/google`                                         | Authenticate/provision through Google provider.        | Unauthenticated.                                    | Result: `AuthResult`. Provider wiring Unknown.                           |
| Apple login                  | `/login/apple`                                          | Authenticate/provision through Apple provider.         | Unauthenticated.                                    | Result: `AuthResult`. Provider wiring Unknown.                           |
| Logout                       | `/logout`                                               | End current session and clear local auth state.        | Current session implied.                            | Result: `void`.                                                          |
| Delete account               | `/delete`                                               | Delete current account and clear local auth state.     | Current session implied.                            | Result: `void`; backend deletion rules Unknown.                          |
| Subscription API options     | `core/subscription/apis/subscription-api.ts`            | Builds RTK Query endpoints for subscription use-cases. | Current account implied.                            | Store factory supports it; runtime store does not currently mount it.    |
| Subscription gateway         | `core/subscription/gateways/subscription-base-query.ts` | Contract for billing/status data source.               | Current account/provider identity implied.          | Internal request union maps to abstract methods.                         |
| Retrieve offerings           | `/offerings/retrieve`                                   | Retrieve paywall offerings.                            | Unknown; likely no auth requirement for catalog.    | Result: `SubscriptionOffering[]`.                                        |
| Purchase                     | `/purchase`                                             | Purchase selected premium plan.                        | Current account/provider identity implied.          | Body: `PurchaseSubscriptionPayload`; result: `SubscriptionActionResult`. |
| Restore                      | `/restore`                                              | Restore platform purchases.                            | Current account/provider identity implied.          | Result: `SubscriptionActionResult`.                                      |
| Manage                       | `/manage`                                               | Open platform subscription management.                 | Current account/provider identity implied.          | Result: `SubscriptionActionResult`.                                      |
| Retrieve subscription status | `/status/retrieve`                                      | Read current premium entitlement.                      | Current account/provider identity implied.          | Result: `Subscription                                                    | null`. |

## Request / response patterns

- Endpoint builders return RTK Query query/mutation definitions.
- Every fallible gateway operation returns `ContextResult<Value>` with `{ ok: true, value }` or `{ ok: false, error }`.
- Gateway `handle()` methods adapt internal requests and convert context results to RTK Query `{ data }` or `{ error }`.
- Auth and subscription use-cases update durable state only after `queryFulfilled` succeeds.
- `.unwrap()` rejects with the exact `AuthError` or `SubscriptionError` from the typed base query.
- Technical errors use transport-independent categories; business codes belong to one bounded context.
- Raw HTTP status, backend codes, SDK exceptions, and messages must remain inside concrete adapter mappers.

## External APIs / services

| Service          | Boundary                                                                    | Purpose                                                                                  | Status                                                                   |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| RevenueCat       | `core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime.ts` | Native subscription SDK bridge for offerings, purchase, restore, status, and management. | Interface and adapter exist; concrete SDK implementation/config Unknown. |
| Supabase         | `package.json`, `core/shared/adapters/supabase/slugify.ts`                  | Dependency and helper present.                                                           | No configured client/schema discovered.                                  |
| Expo SecureStore | `core/auth/adapters/secure-store/secure-session-storage.ts`                 | Encrypted native persistence for validated authentication sessions.                      | Active through the runtime `SessionStorage` boundary.                    |

## Webhooks

Unknown / none discovered.

## Background jobs

Unknown / none discovered.

## Contract gotchas

- Internal gateway `url` strings are not proof of backend routes.
- Subscription API exists in `core/` but is not mounted in the current runtime store.
- In-memory auth fixture contains sample token strings in source; do not copy real token values into memory.
- RevenueCat unavailable states and SDK failures use the typed subscription error channel rather than successful responses containing failure messages.

## Open questions

See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
