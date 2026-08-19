# Data Model

## Database technology

No database schema, migration files, ORM configuration, or query layer was discovered during initialization.

Observed data model currently exists as TypeScript domain entities, Redux slices, RTK Query contracts, and in-memory/fake adapters. `@supabase/supabase-js` is installed and a Supabase slugify helper exists, but no configured Supabase client or schema was found.

## Schema files

Unknown / none discovered.

## Migration files

Unknown / none discovered.

## Core entities

| Entity                     | Purpose                                                | Key fields                                                                             | Relationships                                                                        | Notes                                                              |
| -------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Account                    | User-owned profile data for an authenticated identity. | `id`, `email`, `avatarUri`, `firstName`, `lastName`, `onboardingStatus`, `createdAt`   | Associated with `AuthUser` and `Session` through shared user/account id.             | Onboarding status controls route access.                           |
| AuthUser                   | Minimal authenticated identity.                        | `id`, `email`                                                                          | Owns current `Session`; maps to `Account`.                                           | Distinct from account profile.                                     |
| Session                    | Auth token state for current user.                     | `userId`, `accessToken`, `refreshToken`, `expiresAt`                                   | Belongs to `AuthUser`.                                                               | Runtime truth lives in Redux; durable credentials use SecureStore. |
| AuthState                  | Durable auth runtime state.                            | `status`, `user`, `session`, `account`                                                 | Stores current account/session; transient request failures remain in RTK Query.      | Redux slice `auth`.                                                |
| Subscription               | Current premium entitlement.                           | `tier`, `plan`, `status`, `price`, `currentPeriodEnd`, `trialEnd`, `cancelAtPeriodEnd` | Belongs to the current account conceptually; no explicit account id field currently. | Singleton subscription state.                                      |
| SubscriptionOffering       | Sellable premium plan option.                          | `id`, `plan`, `title`, `priceLabel`, `periodLabel`, optional labels                    | Used to purchase a `SubscriptionPlan`.                                               | Normalized with `createEntityAdapter`.                             |
| SubscriptionState          | Runtime subscription entitlement state.                | `subscription`                                                                         | Stores current `Subscription`; transient billing failures remain in RTK Query.       | Redux slice `subscription`.                                        |
| SubscriptionOfferingsState | Normalized offering collection.                        | `ids`, `entities`                                                                      | Stores `SubscriptionOffering` by id.                                                 | Redux slice `subscriptionOfferings`.                               |

## Relationships

- `Session.userId` identifies the current auth user.
- `AuthUser.id` and `Account.id` represent the same local identity in current in-memory fixtures.
- `Account.onboardingStatus` affects route access.
- `Subscription.plan` and `SubscriptionOffering.plan` use the same `SubscriptionPlan` values.
- `SubscriptionOffering` can be purchased to produce a `Subscription`.
- No explicit persisted account-to-subscription foreign key exists in current domain types.

## Lifecycle states

- `AuthState.status`: `idle`, `success`.
- `OnboardingStatus`: `pending`, `in-progress`, `completed`.
- `SubscriptionTier`: `free`, `premium`.
- `SubscriptionStatus`: `inactive`, `trialing`, `active`, `canceled`.

## Deletion / archival rules

- Auth logout clears Redux state, RTK Query caches, and securely persisted credentials.
- Account deletion clears the same runtime/persisted auth state and the in-memory adapter account/auth user.
- Unknown: backend deletion, archival, retention, legal hold, or cascade rules.

## Ownership / multi-tenancy rules

Unknown. No organization, tenant, workspace, team, or role model was discovered.

## Data integrity constraints

- Account id, email, and createdAt are required.
- Session userId and accessToken are required.
- Subscription tier, status, and cancelAtPeriodEnd are required.
- SubscriptionOffering id, plan, title, priceLabel, and periodLabel are required.
- Unknown: database-level uniqueness, foreign keys, indexes, and constraints.

## Open questions

See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
