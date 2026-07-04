# User Flows

## Flow: App startup and route selection

### User goal

Reach the correct route group based on current auth and onboarding state.

### Entry points

- `src/app/_layout.tsx`
- `src/app-runtime/root-app-providers.tsx`
- `src/app-runtime/root-navigator.tsx`

### Happy path

1. Root layout wires global providers, splash handling, status bar, toast, and the root navigator.
2. Auth account retrieval starts through `useRetrieveAccountQuery`.
3. `useAppReadiness` syncs persisted `isConnected` with the retrieved account and hides the splash screen after readiness.
4. Root navigator chooses `(auth)`, `(on-boarding)`, or `(tabs)` based on connection, auth status, and account onboarding status.

### Edge cases

- Connected user with incomplete onboarding is routed to `(on-boarding)`.
- Connected user with completed onboarding is routed to `(tabs)`.
- Missing account after retrieval clears the persisted connection flag.

### Error / empty / loading states

- Loading is represented by account retrieval and splash delay.
- Error UI is Unknown; route screens are placeholders.

### Relevant files

- `src/app/_layout.tsx`
- `src/app-runtime/root-navigator.tsx`
- `src/hooks/app-shell/useAppReadiness.ts`
- `src/stores/session-store.ts`
- `core/auth/use-cases/account-retrieval/retrieve-account.ts`

### Open questions

- What user-facing loading or error UI should appear while account retrieval runs?
- Should `isConnected` remain separate from auth session state long term?

## Flow: Authentication and registration

### User goal

Create or access an account.

### Entry points

- `src/app/(auth)/index.tsx`
- Auth API hooks exported from `src/app/_layout.tsx` through `src/app-runtime/app-runtime.ts`

### Happy path

1. A future auth screen calls the relevant RTK Query hook.
2. Auth use-cases dispatch loading state.
3. The auth gateway returns an `AuthResult`.
4. On success, auth state stores user, session, and account.
5. Root navigation sends the user to onboarding or the main tab group.

### Edge cases

- Email/password login can fail with `INVALID_CREDENTIALS`.
- Google/Apple login can fail when the local adapter has no user/account.
- Registration creates a pending onboarding account in the in-memory adapter.

### Error / empty / loading states

- Auth status supports `idle`, `loading`, `success`, and `error`.
- Auth errors have stable codes and user-facing messages.
- Concrete UI states are Unknown; current auth screen renders an empty view.

### Relevant files

- `core/auth/apis/auth-api.ts`
- `core/auth/apis/types.ts`
- `core/auth/gateways/auth-base-query.ts`
- `core/auth/use-cases/registration/register.ts`
- `core/auth/use-cases/log-in/login.ts`
- `core/auth/use-cases/google-login/login-with-google.ts`
- `core/auth/use-cases/apple-login/login-with-apple.ts`
- `core/auth/domain/slice.ts`

### Open questions

- What concrete auth screens, validation copy, and social-provider configuration are intended?
- Which backend or auth provider should replace the local adapters?

## Flow: Onboarding completion

### User goal

Complete onboarding so the main app becomes accessible.

### Entry points

- `src/app/(on-boarding)/index.tsx`
- `core/auth/use-cases/onboarding-completion/complete-onboarding.ts`

### Happy path

1. A connected account with onboarding status other than `completed` reaches `(on-boarding)`.
2. The onboarding completion use-case updates the account through the auth gateway with `onboardingStatus: "completed"`.
3. Auth state stores the updated account.
4. Root navigation allows access to `(tabs)`.

### Edge cases

- Account update fails if the in-memory adapter has no current account.

### Error / empty / loading states

- Concrete onboarding UI is Unknown; current onboarding screen renders an empty view.

### Relevant files

- `src/app/(on-boarding)/index.tsx`
- `src/app-runtime/root-navigator.tsx`
- `core/auth/use-cases/onboarding-completion/complete-onboarding.ts`
- `core/auth/use-cases/account-modification/update-account.ts`
- `core/auth/domain/account.ts`

### Open questions

- What steps or profile fields should onboarding collect?
- Should onboarding have `pending` and `in-progress` UI distinctions?

## Flow: Main home route

### User goal

Reach the authenticated main app after auth and onboarding.

### Entry points

- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/(home)/index.tsx`

### Happy path

1. `(tabs)/index.tsx` redirects to `/(tabs)/(home)`.
2. Home screen renders.

### Edge cases

- Unknown; home screen has no product content yet.

### Error / empty / loading states

- Unknown; current home screen renders an empty view.

### Relevant files

- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/_layout.tsx`
- `src/app/(tabs)/(home)/index.tsx`
- `src/app/(tabs)/(home)/_layout.tsx`

### Open questions

- What is the actual authenticated product experience?

## Flow: Account management

### User goal

Retrieve, update, log out, or delete an account.

### Entry points

- Auth API hooks from `src/app-runtime/runtime/auth-runtime.ts`
- Current UI entry points are Unknown.

### Happy path

1. Account retrieval stores the current account in auth state.
2. Account updates store the updated account in auth state.
3. Logout marks logout requested, waits for the gateway, then clears auth state.
4. Account deletion marks logout requested, waits for the gateway, then clears auth state.

### Edge cases

- Updating an account throws if no account exists in the in-memory adapter.
- Account retrieval can store `null`.

### Error / empty / loading states

- Concrete account management UI is Unknown.

### Relevant files

- `core/auth/use-cases/account-retrieval/retrieve-account.ts`
- `core/auth/use-cases/account-modification/update-account.ts`
- `core/auth/use-cases/log-out/logout.ts`
- `core/auth/use-cases/account-deletion/delete-account.ts`
- `core/auth/domain/slice.ts`

### Open questions

- Should account deletion require confirmation, re-authentication, or backend cleanup?

## Flow: Password reset

### User goal

Request and complete password reset.

### Entry points

- Auth API hooks from `src/app-runtime/runtime/auth-runtime.ts`
- Current UI entry points are Unknown.

### Happy path

1. Password reset request submits an email.
2. Password reset completion submits a new password and optional recovery URL.
3. The in-memory adapter acknowledges both actions without changing credentials.

### Edge cases

- Auth error codes include invalid or expired password reset states, but current in-memory adapter always succeeds.

### Error / empty / loading states

- Concrete password reset UI is Unknown.

### Relevant files

- `core/auth/use-cases/password-reset-request/request-password-reset.ts`
- `core/auth/use-cases/password-reset-completion/reset-password.ts`
- `core/auth/apis/types.ts`

### Open questions

- Which provider supplies reset links and recovery URLs?

## Flow: Subscription and premium access

### User goal

View premium offerings, purchase or restore premium, manage subscription, and read current entitlement.

### Entry points

- Subscription RTK Query API in `core/subscription/apis/subscription-api.ts`.
- Current UI entry points are Unknown.
- The runtime store defines subscription support, but `src/app-runtime/runtime/store-runtime.ts` currently mounts only `authApi`.

### Happy path

1. Retrieve offerings through the subscription gateway and store normalized offerings.
2. Purchase selected `annual` or `monthly` plan.
3. Store successful subscription entitlement or an error message.
4. Restore purchases or open subscription management through the active billing adapter.
5. Read subscription status during startup or feature gating.

### Edge cases

- Restore fails when no active premium purchase exists.
- RevenueCat adapter returns unavailable results when the native runtime is not configured.
- Premium access selector requires tier `premium` and status `active` or `trialing`.

### Error / empty / loading states

- Subscription state stores latest billing `errorMessage`.
- RevenueCat adapter normalizes unavailable and failed purchase/restore/manage errors.
- Concrete paywall UI is Unknown.

### Relevant files

- `core/subscription/apis/subscription-api.ts`
- `core/subscription/gateways/subscription-base-query.ts`
- `core/subscription/adapters/in-memory/in-memory-subscription-base-query.ts`
- `core/subscription/adapters/revenuecat/revenue-cat-subscription-base-query.ts`
- `core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime.ts`
- `core/subscription/adapters/selectors/subscription-selectors.ts`
- `core/subscription/domain/subscription.ts`
- `core/subscription/domain/subscription-offering.ts`

### Open questions

- Should the subscription API be mounted in the runtime store now or only when a paywall UI exists?
- What RevenueCat product identifiers, entitlement names, prices, and platform setup are intended?
