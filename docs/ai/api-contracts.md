# API Contracts

## API style

No HTTP API route files, server actions, GraphQL schema, webhooks, or backend handlers were discovered.

The current app uses RTK Query endpoint builders over local gateway contracts. Auth and subscription use-cases call their gateway directly through `queryFn`; internal application operations are not backend endpoints.

## Internal contracts

| Area                         | Path / endpoint                                      | Purpose                                                      | Auth                                                | Notes                                                                                         |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Auth API options             | `core/auth/apis/auth-api.ts`                         | Builds RTK Query endpoints for auth use-cases.               | Current user context comes from auth state/gateway. | Runtime mounted in `src/app-runtime/runtime/auth-runtime.ts`.                                 |
| Auth gateway                 | `core/auth/gateways/auth-gateway.ts`                 | Contract for identity/session data source.                   | Depends on adapter implementation.                  | Use-cases call domain-oriented methods directly.                                              |
| Register                     | `AuthGateway.register`                               | Create an auth identity and optional session.                | Unauthenticated.                                    | Input: `RegisterPayload`; result: `AuthResult<AuthContext>`.                                  |
| Login                        | `AuthGateway.login`                                  | Authenticate with email/password.                            | Unauthenticated.                                    | Input: `LoginPayload`; result: `AuthResult<AuthContext>`.                                     |
| Account API options          | `core/account/apis/account-api.ts`                   | Builds RTK Query endpoints for Account use-cases.            | Current identity comes from runtime composition.    | Mounted in `src/app-runtime/runtime/account-runtime.ts`.                                      |
| Account gateway              | `core/account/gateways/account-gateway.ts`           | Contract for durable Account data.                           | Current identity implied by adapter implementation. | Independent from Auth and from any concrete transport.                                        |
| Provision account            | `AccountGateway.provisionAccount`                    | Idempotently create or retrieve the current Account.         | Current session implied.                            | Result: `AccountResult<Account>`; a new Account starts `pending`.                             |
| Retrieve account             | `AccountGateway.retrieveAccount`                     | Retrieve the current Account.                                | Current session implied.                            | Result: `AccountResult<Account>`.                                                             |
| Update account               | `AccountGateway.updateAccount`                       | Persist editable Account fields.                             | Current session implied.                            | Input: `UpdateAccountPayload`; result: `AccountResult<Account>`.                              |
| Complete onboarding          | `AccountGateway.completeOnboarding`                  | Idempotently complete the durable Account lifecycle.         | Current session implied.                            | No payload; result: `AccountResult<Account>` with `completed`.                                |
| Request password reset       | `AuthGateway.requestPasswordReset`                   | Start password reset flow.                                   | Unauthenticated.                                    | Input: `RequestPasswordResetPayload`; result: `AuthResult<void>`.                             |
| Reset password               | `AuthGateway.resetPassword`                          | Complete password reset.                                     | Reset challenge implied.                            | Input: `ResetPasswordPayload`; result: `AuthResult<void>`.                                    |
| Google login                 | `AuthGateway.loginWithGoogle`                        | Authenticate/provision through Google provider.              | Unauthenticated.                                    | Result: `AuthResult<AuthContext>`; provider wiring Unknown.                                   |
| Apple login                  | `AuthGateway.loginWithApple`                         | Authenticate/provision through Apple provider.               | Unauthenticated.                                    | Result: `AuthResult<AuthContext>`; provider wiring Unknown.                                   |
| Logout                       | `AuthGateway.logout`                                 | Attempt remote revocation and always clear local auth state. | Current session implied.                            | Result: `AuthResult<void>`; remote failure still rejects through RTK Query.                   |
| Delete account               | `AuthGateway.deleteAccount`                          | Delete current account and clear local auth state.           | Current session implied.                            | Result: `AuthResult<void>`; backend deletion rules Unknown.                                   |
| Subscription API options     | `core/subscription/apis/subscription-api.ts`         | Builds RTK Query endpoints for subscription use-cases.       | Current account implied.                            | Mounted by `src/app-runtime/runtime/store-runtime.ts`.                                        |
| Subscription gateway         | `core/subscription/gateways/subscription-gateway.ts` | Contract for billing/status data source.                     | Current account/provider identity implied.          | Use-cases call domain-oriented methods directly.                                              |
| Retrieve offerings           | `SubscriptionGateway.retrieveSubscriptionOfferings`  | Retrieve paywall offerings.                                  | Unknown; likely no auth requirement for catalog.    | Result: `SubscriptionResult<SubscriptionOffering[]>`.                                         |
| Purchase                     | `SubscriptionGateway.purchaseSubscription`           | Purchase selected premium plan.                              | Current account/provider identity implied.          | Input: `PurchaseSubscriptionPayload`; result: `SubscriptionResult<SubscriptionActionResult>`. |
| Restore                      | `SubscriptionGateway.restoreSubscriptionPurchases`   | Restore platform purchases.                                  | Current account/provider identity implied.          | Result: `SubscriptionResult<SubscriptionActionResult>`.                                       |
| Manage                       | `SubscriptionGateway.openSubscriptionManagement`     | Open platform subscription management.                       | Current account/provider identity implied.          | Result: `SubscriptionResult<SubscriptionActionResult>`.                                       |
| Retrieve subscription status | `SubscriptionGateway.retrieveSubscriptionStatus`     | Read current premium entitlement.                            | Current account/provider identity implied.          | Result: `SubscriptionResult<Subscription \| null>`.                                           |

## Request / response patterns

- Endpoint builders return RTK Query query/mutation definitions.
- Every fallible gateway operation returns `ContextResult<Value>` with `{ ok: true, value }` or `{ ok: false, error }`.
- Auth, Account, and Subscription use-cases call their own gateway in `queryFn`; shared `toRtkQueryResult` converts each context result to RTK Query `{ data }` or `{ error }`.
- Each context updates only its own durable state after `queryFulfilled` succeeds, except logout which always clears local identity-scoped state after the remote attempt settles.
- `.unwrap()` rejects with the exact bounded-context error from the typed base query.
- Technical errors use transport-independent categories; business codes belong to one bounded context.
- Raw HTTP status, backend codes, SDK exceptions, and messages must remain inside concrete adapter mappers.

## Sample HTTP auth adapter contract

`HttpAuthGateway` is an executable Starter integration example, not evidence of an existing production backend. It is selected with `EXPO_PUBLIC_APP_MODE=http` and configured by `EXPO_PUBLIC_AUTH_API_URL`.

| Method   | Remote path                    | Result        | Authentication |
| -------- | ------------------------------ | ------------- | -------------- |
| `POST`   | `/auth/register`               | `AuthContext` | Public         |
| `POST`   | `/auth/login`                  | `AuthContext` | Public         |
| `POST`   | `/auth/login/google`           | `AuthContext` | Public         |
| `POST`   | `/auth/login/apple`            | `AuthContext` | Public         |
| `POST`   | `/auth/password/request-reset` | Empty success | Public         |
| `POST`   | `/auth/password/reset`         | Empty success | Public         |
| `DELETE` | `/auth/account`                | Empty success | Bearer session |
| `POST`   | `/auth/logout`                 | Empty success | Bearer session |

- Successful JSON is decoded into domain-owned `AuthContext`, `AuthUser`, and `Session` values; malformed success payloads become `unexpected` errors.
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
- Auth and Subscription in-memory/fake adapters propagate their injected typed context error consistently across every gateway operation.
- In-memory auth fixture contains sample token strings in source; do not copy real token values into memory.
- RevenueCat unavailable states and SDK failures use the typed subscription error channel rather than successful responses containing failure messages.

## Open questions

See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
