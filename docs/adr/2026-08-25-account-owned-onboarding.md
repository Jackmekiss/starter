# Account-Owned Onboarding

Date: 2026-08-25

## Status

Accepted

## Context

Onboarding controls durable access to the authenticated application. A separate session flag can
drift from Account and cannot represent a lifecycle shared across devices.

## Decision

Account exclusively owns `onboardingStatus: "pending" | "completed"`. Completion is a dedicated,
idempotent gateway/use-case operation. Root navigation waits for Account, exposes a localized retry
state when it is unavailable, and routes only from session plus Account.

## Consequences

No Zustand session store or `shouldCreateAccount` flag exists. Neutral runtime fixtures are already
completed, while provisioning behavior explicitly starts pending. Product onboarding screens remain
empty until their actual data requirements are decided.

## Alternatives Considered

- Persist onboarding in a session store.
- Infer onboarding from profile fields.
- Add an unused intermediate lifecycle state.
