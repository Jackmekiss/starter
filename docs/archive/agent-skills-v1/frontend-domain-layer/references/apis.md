# APIs

The `apis/` folder provides a clean facade for the rest of the app.

Instead of screens importing multiple files from inside a context, they should rely on a context API.

APIs should:

- expose a small and clean surface
- hide internal wiring
- remain domain-oriented
- own the public API DTO layer through `apis/types.ts`
- expose actions like `retrieve`, `update`, `search`, and `validate`
- own request and response DTOs such as filters, params, payloads, and transport-specific shapes

APIs should avoid exposing:

- low-level internal helpers
- implementation details
- which adapter is used
- how the slice is updated
- DTO types re-exported indirectly from `gateways/`

## RTK Query wiring

In this repository, the context API factory receives the bounded-context gateway and configures `fakeBaseQuery<ContextError>()`. Endpoint builders receive that gateway explicitly:

```ts
export function createCatalogApiOptions(catalogGateway: CatalogGateway) {
  return {
    baseQuery: fakeBaseQuery<CatalogError>(),
    endpoints: (builder: CatalogEndpointBuilder) => ({
      ...retrieveProductBuilder(builder, catalogGateway),
    }),
  };
}
```

Keep the empty RTK Query base-query type in the API concern. Do not make the business gateway extend `BaseQueryFn` or accept RTK Query request objects.

Rule of thumb: screens should talk to a context API, not to the internals of the context.

For collection retrievals:

- prefer returning normalized `EntityState<T, string>` from RTK Query when the bounded context stores that collection in normalized form
- use `transformResponse` to normalize once at the API boundary instead of normalizing again in selectors or screens
- avoid inventing API-facing domain names such as `XxxListItem` and `XxxDetail` when both payloads represent the same business entity; prefer one entity name plus different hydration levels

Placement rule:

- if a type answers "how do we request this?" it belongs in `apis/types.ts`
- if a type answers "what is this business object?" it belongs in `domain/`
