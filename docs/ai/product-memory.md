# Product Memory

## Product thesis / promise

Observed: this repository is named `starter` and is an Expo/React Native starter application with authentication, onboarding, and subscription domain scaffolding.

Unknown: the actual end-user product category, product promise, and product-specific value proposition. No separate product brief is currently required; this file is the durable product-memory source of truth until confirmed product facts are added elsewhere.

Files inspected for product context:

- [../../README.md](../../README.md)
- [../../AGENTS.md](../../AGENTS.md)
- [../../src/app](../../src/app)
- [../../core/auth](../../core/auth)
- [../../core/subscription](../../core/subscription)

## Target users and roles

- End user / account owner: implied by auth, account profile, onboarding, and subscription entities.
- Unauthenticated visitor: implied by the `(auth)` route group and auth use-cases.
- Authenticated user: implied by protected `(tabs)` route access.
- Premium subscriber: implied by subscription tier and entitlement models.
- Developer/agent maintaining the Starter codebase: implied by repository guidance and local skills.
- Unknown: any product-specific persona, admin role, organization role, team role, or staff role.

## Primary user problems

- Unknown for the final product.
- Observed starter capabilities address common app foundation needs: sign up, log in, retrieve/update account, complete onboarding, reset password, delete account, and manage subscription access.

## Core product workflows

- Account registration and login through email/password.
- Google and Apple login through auth gateway contracts.
- Account retrieval during startup.
- Account profile update and onboarding completion.
- Password reset request and completion.
- Logout and account deletion.
- Subscription offering retrieval, purchase, restore, management, and status retrieval at the domain/API layer.
- Unknown: the main product workflow after the authenticated home screen; `src/app/(tabs)/(home)/index.tsx` is currently a placeholder.

## Important product rules

- An account has durable onboarding status `pending` or `completed`; Account is the sole routing truth.
- Routing sends connected users with incomplete onboarding to `(on-boarding)` and completed connected users to `(tabs)`.
- A premium subscription is considered premium when tier is `premium` and status is `active` or `trialing`.
- Logout always clears local auth state after the remote attempt settles; account deletion clears it only after successful deletion.
- Account deletion is modeled as permanent in the current auth use-case; durable backend deletion behavior is Unknown.

## Product principles

Unknown product-specific principles. Current repository principles are technical:

- A bounded context should own durable product truth.
- The UI should own temporary interaction mechanics.
- Prefer obvious code over smart code.

## Non-goals

Unknown. No product brief or roadmap was present during initialization.

## Known product constraints

- The login route has a concrete localized email/password form; onboarding, home, and subscription screens remain placeholders.
- Runtime auth defaults to the in-memory adapter, supports latency-enabled fake mode, and exposes an opt-in sample HTTP mode for backend integration.
- Subscription pricing in in-memory fixtures appears to be sample data and should not be treated as real billing policy.
- No database schema, migrations, or production backend contracts were discovered.

## Monetization / billing assumptions

- The domain supports free and premium tiers.
- Premium plans are `annual` and `monthly`.
- RevenueCat integration boundaries exist through interfaces/adapters.
- Unknown: real products, store identifiers, prices, entitlements, trial policy, refund policy, and billing copy.

## Permissions / roles assumptions

- Route access derives from the Redux auth session and account onboarding status after secure-session bootstrap completes.
- Unknown: role-based access control, admin permissions, organization permissions, or feature permissions.

## Open product questions

See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md).
