# Gateways

The `gateways/` folder defines interfaces or contracts for data access.

Gateways should:

- define what data is needed
- avoid specifying how it is retrieved
- remain stable even if implementations change
- expose contracts only
- avoid owning API payload and result DTOs when those types are part of the bounded context public API
- keep transport credentials out of business operation parameters
- expose domain-oriented methods such as `login`, `retrieveAccount`, or `purchaseSubscription`
- return the bounded context's typed `Result` contract for fallible operations
- remain independent from RTK Query `BaseQueryFn`, request routing, URLs, HTTP methods, and SDK operation identifiers

When concrete adapters require a current session, inject a dedicated provider into those adapters instead of extending every business gateway method with credentials. See [authenticated-adapters.md](authenticated-adapters.md).

## DTO placement

Request and response DTOs used by RTK Query endpoints or context APIs should live in:

- `core/<bounded-context>/apis/types.ts`

Do not place those DTOs directly in:

- `gateways/`
- adapters
- screens

Rule of thumb: business logic depends on contracts, not implementations.

## Naming and RTK Query boundary

Name business contracts `<Context>Gateway` and concrete implementations after their infrastructure, for example `HttpAuthGateway`, `InMemoryAuthGateway`, or `RevenueCatSubscriptionGateway`.

Do not add `handle()` or an internal request router merely to turn gateway methods into an RTK Query base query. The context API injects the gateway into endpoint builders, and each use-case calls the required method through `queryFn`.
