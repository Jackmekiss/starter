# RTK Query Use-Case Blueprint

> Blueprint version: `1.3.0`

Starter models application actions as injected RTK Query endpoint builders. Use this frozen blueprint for queries, mutations, API option assembly, and public application DTOs.

## Canonical Account Onboarding Mutation

Account onboarding is a semantic, idempotent operation, not a generic profile patch. The Account
model requires `onboardingStatus: "pending" | "completed"`; its gateway exposes
`completeOnboarding(): Promise<AccountResult<Account>>`, and the mutation stores the returned Account
only after fulfillment. `UpdateAccountPayload` must never accept an onboarding override.

## Placeholders

- `<context>` / `<Context>`: bounded context
- `<action>`: action-oriented use-case folder
- `<verbEntity>` / `<VerbEntity>`: endpoint and exported builder name
- `<Payload>` / `<Value>`: public application input and successful output
- `<ReducerPath>`: literal such as `catalogApi`
- `<Tag>`: optional RTK Query cache tag

## Files

```text
core/<context>/apis/types.ts                         # conditional payload/result DTOs
core/<context>/apis/<context>-api-base-query.ts      # required
core/<context>/apis/<context>-api.ts                 # required
core/<context>/use-cases/<action>/<verb-entity>.ts   # required
core/shared/adapters/rtk-query/to-rtk-query-result.ts # existing shared adapter
```

## Empty Base Query Type

```ts
import type { <Context>Error } from "@core/<context>/domain/<context>-error";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/** Empty RTK Query transport because <context> use cases call their gateway directly. */
export type <Context>ApiBaseQueryFn = BaseQueryFn<
  void,
  never,
  <Context>Error
>;
```

`BaseQuery` naming is reserved for this real RTK Query type. A business gateway never extends `BaseQueryFn` and never accepts RTK request objects.

## Query Builder Skeleton

```ts
import { set<Value> } from "@core/<context>/domain/slice";
import { toRtkQueryResult } from "@core/shared/adapters/rtk-query/to-rtk-query-result";

import type { <Context>ApiBaseQueryFn } from "@core/<context>/apis/<context>-api-base-query";
import type { <Value> } from "@core/<context>/domain/<value>";
import type { <Context>Gateway } from "@core/<context>/gateways/<context>-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Builds the endpoint that retrieves <business meaning>. */
export function <verbEntity>Builder(
  build: EndpointBuilder<<Context>ApiBaseQueryFn, never, "<ReducerPath>">,
  <context>Gateway: <Context>Gateway,
) {
  return {
    <verbEntity>: build.query<<Value>, void>({
      queryFn: async () =>
        toRtkQueryResult(await <context>Gateway.<verbEntity>()),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(set<Value>(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
```

Omit `onQueryStarted` when the result does not belong in durable context state. A query may still return data directly to one consumer.

## Mutation Builder Skeleton

```ts
/** Builds the endpoint that performs <business action>. */
export function <verbEntity>Builder(
  build: EndpointBuilder<<Context>ApiBaseQueryFn, never, "<ReducerPath>">,
  <context>Gateway: <Context>Gateway,
) {
  return {
    <verbEntity>: build.mutation<<Value>, <Payload>>({
      queryFn: async (payload) =>
        toRtkQueryResult(await <context>Gateway.<verbEntity>(payload)),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(set<Value>(data));
        } catch {
          // RTK Query owns the transient request failure.
        }
      },
    }),
  };
}
```

Use-case-owned validation may return `{ error: <Context>Error }` before calling the gateway. It must not inspect transport details or import infrastructure error mappers.

## Context API Options

```ts
import { fakeBaseQuery } from "@reduxjs/toolkit/query";

import { <verbEntity>Builder } from "@core/<context>/use-cases/<action>/<verb-entity>";

import type { <Context>ApiBaseQueryFn } from "@core/<context>/apis/<context>-api-base-query";
import type { <Context>Error } from "@core/<context>/domain/<context>-error";
import type { <Context>Gateway } from "@core/<context>/gateways/<context>-gateway";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

/** Builds RTK Query endpoint options for <context> use cases. */
export function create<Context>ApiOptions(
  <context>Gateway: <Context>Gateway,
) {
  return {
    baseQuery: fakeBaseQuery<<Context>Error>(),
    reducerPath: "<ReducerPath>",
    endpoints: (
      builder: EndpointBuilder<
        <Context>ApiBaseQueryFn,
        never,
        "<ReducerPath>"
      >,
    ) => ({
      ...<verbEntity>Builder(builder, <context>Gateway),
    }),
  };
}
```

Add `tagTypes`, `providesTags`, or `invalidatesTags` only when RTK Query cache invalidation is actually required. They do not replace durable context state.

## Collection Retrieval Pattern

The canonical Starter collection pattern returns the domain array from the gateway and query, then updates normalized durable state once on successful fulfillment:

```ts
retrieve<Entities>: build.query<<Entity>[], void>({
  queryFn: async () =>
    toRtkQueryResult(await <context>Gateway.retrieve<Entities>()),
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      dispatch(update<Entities>(data));
    } catch {
      // RTK Query owns the transient request failure.
    }
  },
}),
```

Do not change the query result to `EntityState` or introduce `transformResponse` merely because the durable slice is normalized.

## Application Action Semantics

- Use `build.query` for retrieval with no business mutation.
- Use `build.mutation` for commands and externally mutating operations.
- Keep before/after comparisons and selection of required commands in the use case.
- Keep intrinsic business invariants in domain code.
- Keep response decoding and infrastructure representation mapping in adapters.
- A logout-like action may intentionally update local state in `finally`; encode such exceptions from explicit product behavior, not from the generic skeleton.

## Invariants

- One action folder and one exported builder per use case.
- Verb-based business names for the endpoint, gateway method, builder, and file.
- Gateway injection is explicit at API option construction.
- `queryFn` calls the required gateway method directly.
- Shared `toRtkQueryResult` is the only routine Result-to-RTK conversion.
- Successful durable updates occur through `queryFulfilled`.

## Anti-Patterns

- `url`, `method`, headers, transport body, SDK operation identifiers, or concrete adapter imports in a use case.
- A generic gateway `handle()` method or semantic request router.
- Creating the RTK Query API instance inside `core/`.
- Persisting loading or transient request errors in the context slice.
- Normalizing the same collection separately in API, selector, and screen.
- A screen importing the use-case builder directly.
