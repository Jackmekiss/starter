# Application Error Management

Apply this protocol to every bounded context whose operations can fail.

## Ownership

```txt
backend or local data source
  -> concrete adapter maps infrastructure failure
  -> gateway returns ContextResult<Value>
  -> use-case calls the gateway through RTK Query queryFn
  -> toRtkQueryResult returns { data } or { error }
  -> UI .unwrap() rejects with a domain error
  -> presentation adapter selects safe copy
```

Each layer owns one decision:

- `shared/domain`: generic technical failures and the `Result` container
- `<context>/domain`: stable business error codes
- `<context>/gateways`: explicit fallible operation contracts
- `<context>/adapters`: infrastructure-to-domain mapping
- `<context>/use-cases`: business validation and RTK Query orchestration
- `<context>/adapters/<presentation>`: domain-error-to-copy mapping
- UI: placement, fallback wording, and temporary interaction state

## Shared contracts

Reuse `core/shared/domain/application-error.ts` and `core/shared/domain/result.ts`. `TechnicalApplicationError` owns only transport-independent categories such as `network`, `timeout`, `unauthenticated`, `forbidden`, `rate-limited`, `unavailable`, and `unexpected`.

Never add backend codes, HTTP payloads, SDK types, translated messages, or flow-specific meanings to shared domain errors.

## Context contract

Create one stable error code union in the bounded context:

```ts
export type CatalogErrorCode = "PRODUCT_NOT_FOUND" | "PRODUCT_UNAVAILABLE";
export type CatalogError = ApplicationError<CatalogErrorCode>;
export type CatalogResult<Value> = Result<Value, CatalogError>;
```

Codes describe application meaning, use uppercase snake case, remain valid when infrastructure changes, and belong to exactly one bounded context. Add `is<Context>Error(value)` using the shared technical and context guards.

## Gateway contract

Every fallible operation declares its error channel:

```ts
abstract retrieveProduct(productId: string): Promise<CatalogResult<Product>>;
```

The use-case keeps the context error and converts the result only at the RTK Query boundary:

```ts
queryFn: async (payload) =>
  toRtkQueryResult(await catalogGateway.retrieveProduct(payload));
```

Do not expose `Promise<Product>` when expected failures exist or document the failure only in JSDoc.

## Adapter mapping

Concrete adapters always return values and errors defined by the domain. Map in this order:

1. preserve an existing context error, including one wrapped in `Error.cause`
2. map infrastructure-specific business codes to stable context codes
3. map remaining transport failures to shared technical categories
4. fall back to `{ kind: "unexpected", retryable: false }`

Keep adapter-independent preservation and fallback under `adapters/errors/`. Keep backend codes and SDK shapes in the concrete adapter's named folder.

Wrap each external operation once:

```ts
private async executeOperation<Value>(
  operation: () => Value | Promise<Value>,
): Promise<CatalogResult<Value>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    return { ok: false, error: mapCatalogAdapterError(error) };
  }
}
```

Expected failures must not escape as raw exceptions. In-memory and fake adapters implement the same result contract and expose the same domain codes.

## Use-case rules

A use-case may create a context error when it owns business validation. It must not inspect HTTP status, backend codes, SDK payloads, raw exceptions, infrastructure mappers, or translated messages.

With RTK Query:

- return `{ error: ContextError }` for use-case-owned validation
- call the typed gateway directly and adapt its `Result` with `toRtkQueryResult`
- use `onQueryStarted` for successful durable state updates
- catch `queryFulfilled` rejection only to avoid duplicating request errors
- keep transient request errors in RTK Query rather than a durable domain slice

At the UI boundary, `.unwrap()` resolves the success value and rejects the exact context error.

## Presentation adapter

Keep one error-message resolver per bounded context in a named presentation adapter folder. When copy depends on an action, accept an explicit presentation context. Never assign OTP-, payment-, reservation-, or screen-specific copy to a generic `unauthenticated`, `forbidden`, or similar error without checking that context.

Never expose `error.message` from an exception or backend payload to users.

## Migration workflow

1. Inventory gateway methods, adapters, use-cases, API endpoints, UI consumers, legacy unions, and stored error state.
2. Define context codes from application meaning; never guess backend codes.
3. Add the context guard and result alias.
4. Change every fallible gateway method to return the context result.
5. Update remote, fake, and in-memory adapters.
6. Convert results to RTK Query `{ data }` or `{ error }` with shared `toRtkQueryResult` in each endpoint `queryFn`.
7. Remove infrastructure mapping from use-cases and legacy `success: false` unions.
8. Remove transient request errors from durable slices and selectors.
9. Update UI consumers to use `.unwrap()` and the context presentation adapter.
10. Update use-case tests and run targeted formatting, linting, TypeScript, and tests.

Do not leave a bounded context with mixed raw exceptions, legacy result unions, and typed `Result` operations unless the migration is explicitly staged and documented.
