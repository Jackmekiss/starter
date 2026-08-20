# User Flows

## Flow: App startup and route selection

### User goal

Reach the correct route group based on current auth and onboarding state.

### Entry points

- `src/app/_layout.tsx`
- `src/app-runtime/root-app-providers.tsx`
- `src/app-runtime/root-navigator.tsx`

### Happy path

1. Redux Persist reads its serialized root through `secureSessionStorage`.
2. The adapter loads and validates the native SecureStore session, then injects it into the sanitized auth slice.
3. `PersistGate` mounts navigation after rehydration.
4. When the Redux session exists, account retrieval starts with a forced mount refetch.
5. Root navigator chooses `(auth)`, `(on-boarding)`, or `(tabs)` from the Redux session and account.
6. `useAppReadiness` hides the splash after the initial account retrieval stops loading.

### Edge cases

- A session with an incomplete account is routed to `(on-boarding)`.
- A session with a completed account is routed to `(tabs)`.
- A missing or failed account response currently leaves route behavior to the existing auth/account state; dedicated production retry UX remains Unknown.
- Malformed secure sessions are rejected during Redux rehydration.

### Error / empty / loading states

- Loading remains behind the splash until secure-session hydration and initial account retrieval finish.
- Error UI is Unknown; route screens are placeholders.

### Relevant files

- `src/app/_layout.tsx`
- `src/app-runtime/root-navigator.tsx`
- `src/app-runtime/runtime/secure-session-storage.ts`
- `src/app-runtime/runtime/store-runtime.ts`
- `src/hooks/app-shell/useAppReadiness.ts`
- `core/auth/use-cases/account-retrieval/retrieve-account.ts`

### Open questions

- What user-facing loading or error UI should appear while account retrieval runs?
- What user-facing retry state should a production app show after transient startup account retrieval failure?

## Flow: Authentication and registration

### User goal

Create or access an account.

### Entry points

- `src/app/(auth)/index.tsx`
- Auth API hooks exported from the `src/app-runtime/app-runtime.ts` presentation facade

### Happy path

1. The auth entry screen renders French or English login copy from the phone language, falling back to French.
2. The login form validates email and password locally, then calls `useLoginMutation`.
3. The login use-case reaches the selected in-memory, fake, or HTTP auth adapter through RTK Query.
4. The gateway returns an `AuthResult`; HTTP/backend details have already been mapped to `AuthError`.
5. On success, auth state stores user, session, and account and routing continues.
6. On failure, `.unwrap()` rejects with `AuthError`, the presentation resolver selects safe translated copy, and the form renders it as an accessible root error.

### Edge cases

- Email/password login can fail with `INVALID_CREDENTIALS`.
- Google/Apple login can fail when the local adapter has no user/account.
- Registration creates a pending onboarding account in the in-memory adapter.

### Error / empty / loading states

- `auth.session` presence is the durable connection truth; transient loading and error state belongs to RTK Query.
- Auth errors have stable codes without raw backend messages.
- The login form disables controls while submitting and renders localized field and submission errors.

### Relevant files

- `core/auth/apis/auth-api.ts`
- `core/auth/apis/types.ts`
- `core/auth/gateways/auth-gateway.ts`
- `core/auth/use-cases/registration/register.ts`
- `core/auth/use-cases/log-in/login.ts`
- `core/auth/use-cases/google-login/login-with-google.ts`
- `core/auth/use-cases/apple-login/login-with-apple.ts`
- `core/auth/domain/slice.ts`
- `core/auth/adapters/http/http-auth-gateway.ts`
- `core/auth/adapters/presentation/auth-error-message.ts`
- `src/components/auth/login-form.tsx`
- `src/localization/localization-provider.tsx`
- `src/translations/en.json`
- `src/translations/fr.json`

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

- Auth API hooks from the `src/app-runtime/app-runtime.ts` presentation facade
- Current UI entry points are Unknown.

### Happy path

1. Account retrieval stores the current account in auth state.
2. Account updates store the updated account in auth state.
3. Logout waits for the gateway attempt to settle, then always clears local auth state while preserving the remote result.
4. Successful account deletion clears local auth state; a failed deletion remains an RTK Query error.

### Edge cases

- Updating a missing account returns the typed `ACCOUNT_NOT_FOUND` auth result.
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

- Auth API hooks from the `src/app-runtime/app-runtime.ts` presentation facade
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

- Subscription hooks exported from the `src/app-runtime/app-runtime.ts` presentation facade.
- Current UI entry points are Unknown.
- `src/app-runtime/runtime/store-runtime.ts` mounts both `authApi` and `subscriptionApi`.

### Happy path

1. Retrieve offerings through the subscription gateway and store normalized offerings.
2. Purchase selected `annual` or `monthly` plan.
3. Store successful subscription entitlement while transient failures remain in RTK Query.
4. Restore purchases or open subscription management through the active billing adapter.
5. Read subscription status during startup or feature gating.

### Edge cases

- Restore fails when no active premium purchase exists.
- RevenueCat adapter returns unavailable results when the native runtime is not configured.
- Premium access selector requires tier `premium` and status `active` or `trialing`.

### Error / empty / loading states

- Subscription slices store durable entitlement and normalized offerings, not transient error messages.
- RevenueCat adapter normalizes unavailable and failed purchase/restore/manage errors.
- Concrete paywall UI is Unknown.

### Relevant files

- `core/subscription/apis/subscription-api.ts`
- `core/subscription/gateways/subscription-gateway.ts`
- `core/subscription/adapters/in-memory/in-memory-subscription-gateway.ts`
- `core/subscription/adapters/revenuecat/revenue-cat-subscription-gateway.ts`
- `core/subscription/adapters/revenuecat/revenue-cat-subscription-runtime.ts`
- `core/subscription/adapters/selectors/subscription-selectors.ts`
- `core/subscription/domain/subscription.ts`
- `core/subscription/domain/subscription-offering.ts`

### Open questions

- What RevenueCat product identifiers, entitlement names, prices, and platform setup are intended?
