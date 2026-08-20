# API Contracts

## API style

No HTTP API route files, server actions, GraphQL schema, webhooks, or backend handlers were discovered.

The current app uses RTK Query endpoint builders over local gateway contracts. Auth and subscription use-cases call their gateway directly through `queryFn`; internal application operations are not backend endpoints.

## Internal contracts

| Area                         | Path / endpoint                                      | Purpose                                                | Auth                                                | Notes                                                                     |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------- |
| Auth API options             | `core/auth/apis/auth-api.ts`                         | Builds RTK Query endpoints for auth use-cases.         | Current user context comes from auth state/gateway. | Runtime mounted in `src/app-runtime/runtime/auth-runtime.ts`.             |
| Auth gateway                 | `core/auth/gateways/auth-gateway.ts`                 | Contract for account/auth data source.                 | Depends on adapter implementation.                  | Use-cases call domain-oriented methods directly.                          |
| Register                     | `AuthGateway.register`                               | Create auth user, account profile, and session.        | Unauthenticated.                                    | Input: `RegisterPayload`; result: `AuthResult<AuthContext>`.              |
| Login                        | `AuthGateway.login`                                  | Authenticate with email/password.                      | Unauthenticated.                                    | Input: `LoginPayload`; result: `AuthResult<AuthContext>`.                 |
| Retrieve account             | `AuthGateway.retrieveAccount`                        | Retrieve current account profile.                      | Current session implied.                            | Result: `AuthResult<Account \| null>`.                                    |
| Update account               | `AuthGateway.updateAccount`                          | Persist editable account fields.                       | Current session implied.                            | Input: `UpdateAccountPayload`; result: `AuthResult<Account>`.             |
| Request password reset       | `AuthGateway.requestPasswordReset`                   | Start password reset flow.                             | Unauthenticated.                                    | Input: `RequestPasswordResetPayload`; result: `AuthResult<void>`.         |
| Reset password               | `AuthGateway.resetPassword`                          | Complete password reset.                               | Reset challenge implied.                            | Input: `ResetPasswordPayload`; result: `AuthResult<void>`.                |
| Google login                 | `AuthGateway.loginWithGoogle`                        | Authenticate/provision through Google provider.        | Unauthenticated.                                    | Result: `AuthResult<AuthContext>`; provider wiring Unknown.               |
| Apple login                  | `AuthGateway.loginWithApple`                         | Authenticate/provision through Apple provider.         | Unauthenticated.                                    | Result: `AuthResult<AuthContext>`; provider wiring Unknown.               |
| Logout                       | `AuthGateway.logout`                                 | End current session and clear local auth state.        | Current session implied.                            | Result: `AuthResult<void>`.                                               |
| Delete account               | `AuthGateway.deleteAccount`                          | Delete current account and clear local auth state.     | Current session implied.                            | Result: `AuthResult<void>`; backend deletion rules Unknown.               |
| Subscription API options     | `core/subscription/apis/subscription-api.ts`         | Builds RTK Query endpoints for subscription use-cases. | Current account implied.                            | Store factory supports it; runtime store does not currently mount it.     |
| Subscription gateway         | `core/subscription/gateways/subscription-gateway.ts` | Contract for billing/status data source.               | Current account/provider identity implied.          | Use-cases call domain-oriented methods directly.                          |
| Retrieve offerings           | `SubscriptionGateway.retrieveSubscriptionOfferings`  | Retrieve paywall offerings.                            | Unknown; likely no auth requirement for catalog.    | Result: `SubscriptionResult<SubscriptionOffering[]>`.                     |
| Purchase                     | `SubscriptionGateway.purchaseSubscription`           | Purchase selected premium plan.                        | Current account/provider identity implied.          | Input: `PurchaseSubscriptionPayload`; result: `SubscriptionActionResult`. |
| Restore                      | `SubscriptionGateway.restoreSubscriptionPurchases`   | Restore platform purchases.                            | Current account/provider identity implied.          | Result: `SubscriptionResult<SubscriptionActionResult>`.                   |
| Manage                       | `SubscriptionGateway.openSubscriptionManagement`     | Open platform subscription management.                 | Current account/provider identity implied.          | Result: `SubscriptionResult<SubscriptionActionResult>`.                   |
| Retrieve subscription status | `SubscriptionGateway.retrieveSubscriptionStatus`     | Read current premium entitlement.                      | Current account/provider identity implied.          | Result: `SubscriptionResult<Subscription \| null>`.                       |

## Request / response patterns

- Endpoint builders return RTK Query query/mutation definitions.
- Every fallible gateway operation returns `ContextResult<Value>` with `{ ok: true, value }` or `{ ok: false, error }`.
- Auth and subscription use-cases call their gateway in `queryFn`; shared `toRtkQueryResult` converts each context result to RTK Query `{ data }` or `{ error }`.
- Auth and subscription use-cases update durable state only after `queryFulfilled` succeeds.
- `.unwrap()` rejects with the exact `AuthError` or `SubscriptionError` from the typed base query.
- Technical errors use transport-independent categories; business codes belong to one bounded context.
- Raw HTTP status, backend codes, SDK exceptions, and messages must remain inside concrete adapter mappers.

## Sample HTTP auth adapter contract

`HttpAuthGateway` is an executable Starter integration example, not evidence of an existing production backend. It is selected with `EXPO_PUBLIC_APP_MODE=http` and configured by `EXPO_PUBLIC_AUTH_API_URL`.

| Method   | Remote path                    | Result            | Authentication |
| -------- | ------------------------------ | ----------------- | -------------- |
| `POST`   | `/auth/register`               | `AuthContext`     | Public         |
| `POST`   | `/auth/login`                  | `AuthContext`     | Public         |
| `POST`   | `/auth/login/google`           | `AuthContext`     | Public         |
| `POST`   | `/auth/login/apple`            | `AuthContext`     | Public         |
| `POST`   | `/auth/password/request-reset` | Empty success     | Public         |
| `POST`   | `/auth/password/reset`         | Empty success     | Public         |
| `GET`    | `/auth/account`                | `Account \| null` | Bearer session |
| `PATCH`  | `/auth/account`                | `Account`         | Bearer session |
| `DELETE` | `/auth/account`                | Empty success     | Bearer session |
| `POST`   | `/auth/logout`                 | Empty success     | Bearer session |

- Successful JSON is decoded into domain-owned `AuthContext`, `Account`, `AuthUser`, and `Session` values; malformed success payloads become `unexpected` errors.
- Error JSON may contain a documented snake-case `code`; recognized backend codes map to stable `AuthErrorCode` values inside `core/auth/adapters/http/`.
- Raw backend `message` fields are ignored.
- HTTP 408/504, 429, 5xx, 401, and 403 map to transport-independent technical categories, with login 401 mapped to `INVALID_CREDENTIALS`.
- Protected requests obtain the latest bearer token from the injected Redux-backed `AuthSessionProvider`.

## External APIs / services

| Service          | Boundary                                                                    | Purpose                                                                                  | Status                                                                   |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| RevenueCat       | `core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime.ts` | Native subscription SDK bridge for offerings, purchase, restore, status, and management. | Interface and adapter exist; concrete SDK implementation/config Unknown. |
| Supabase         | `package.json`, `core/shared/adapters/supabase/slugify.ts`                  | Dependency and helper present.                                                           | No configured client/schema discovered.                                  |
| Expo SecureStore | `src/app-runtime/runtime/secure-session-storage.ts`                         | Encrypted native persistence for validated authentication sessions.                      | Active through RVA's Redux Persist `WebStorage` pattern.                 |

## Webhooks

Unknown / none discovered.

## Background jobs

Unknown / none discovered.

## Contract gotchas

- Auth and subscription use-cases contain no transport URL or HTTP method.
- Subscription API exists in `core/` but is not mounted in the current runtime store.
- In-memory auth fixture contains sample token strings in source; do not copy real token values into memory.
- RevenueCat unavailable states and SDK failures use the typed subscription error channel rather than successful responses containing failure messages.

## Open questions

See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
