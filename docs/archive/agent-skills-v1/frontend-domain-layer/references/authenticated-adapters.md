# Authenticated Adapters

Use this pattern when one or more concrete adapters need credentials, a current actor session, or another runtime access context.

## Boundary rule

Keep authentication context out of business actions:

```txt
UI
  -> use-case with business parameters
  -> gateway with domain-oriented parameters
  -> authenticated adapter
  -> injected session provider reads current credentials
  -> transport client performs the operation
```

Do not add access tokens, refresh tokens, API keys, cookies, or transport auth objects to use-case parameters, public API DTOs, domain entities, business gateway methods, or RTK Query request shapes.

If actor identity affects a business decision, pass a stable domain concept such as an account id, role, or tenant id. Do not use a bearer token as a proxy for that concept.

## Provider contract

Define a small read-only port that exposes only what authenticated adapters need:

```ts
interface AccessSessionProvider {
  getCredentials(): AccessSessionCredentials | null;
}
```

Placement depends on ownership:

- keep the port inside one bounded context when only that context consumes it
- place a transport-independent port under `core/shared/gateways/` when several bounded contexts need the same runtime session
- implement the port in the application runtime when Redux, Zustand, secure storage, or another state container owns the current session

Inject the provider into concrete adapters. Do not import the application store from `core/`, use a global service locator, or inspect arbitrary Redux state inside a gateway.

## Single source of truth

Read credentials from the provider immediately before each protected operation. The provider should read the current session source rather than retain a second mutable session copy.

A transport-specific helper may configure an SDK, HTTP client, database connection, or storage adapter from the provider. Keep that helper in the transport's named adapter folder, not in the domain or use-case layer.

## Public and protected operations

Public operations must not clear or replace authentication state used by concurrent protected operations.

When one transport client has mutable global authentication:

- configure it only for protected operations
- do not clear it merely because another endpoint is public
- use separate public and authenticated clients when public requests must never carry credentials
- prefer per-request auth when the transport supports it safely

Treat shared mutable client state as a concurrency boundary. Verify that overlapping operations cannot remove or replace each other's credentials.

## Logout and refresh

Logout owns two effects:

1. clear the durable application session, which is the source of truth
2. clear credentials retained by the concrete transport client

Keep transport cleanup inside the authenticated adapter or its infrastructure authentication helper. Keep durable session cleanup in the successful logout use-case flow.

If the transport refreshes credentials automatically, propagate the refreshed session back through an explicit session-update port. Do not let a refreshed token live only inside the transport client while runtime state keeps an expired copy.

## Review checklist

- Do use-cases and gateway methods accept only business parameters?
- Does the adapter depend on a minimal session-provider contract?
- Are credentials read at operation time from one source of truth?
- Can public and protected requests overlap without mutating each other's auth?
- Does logout clear both runtime state and transport-held credentials?
- Does token refresh update the source of truth?
- Can fake and in-memory adapters remain unaware of transport credentials?
