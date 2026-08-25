# Bounded Context Blueprint

> Blueprint version: `1.3.0`

Use this frozen blueprint only when creating a new frontend bounded context. For an existing context, add only the files required by the requested capability and follow its established names.

## Placeholders

| Placeholder    | Meaning                     | Example             |
| -------------- | --------------------------- | ------------------- |
| `<context>`    | kebab-case context          | `catalog`           |
| `<Context>`    | PascalCase context          | `Catalog`           |
| `<entity>`     | kebab/camel business entity | `product`           |
| `<Entity>`     | PascalCase entity           | `Product`           |
| `<action>`     | action-oriented folder      | `product-retrieval` |
| `<verbEntity>` | endpoint/use-case name      | `retrieveProduct`   |

## Complete Skeleton

```text
core/<context>/
├── domain/
│   ├── <entity>.ts
│   ├── <context>-error.ts
│   ├── <context>-result.ts
│   ├── slice.ts
│   └── builders/<entity>-builder.ts
├── apis/
│   ├── <context>-api-base-query.ts
│   ├── <context>-api.ts
│   └── types.ts
├── gateways/<context>-gateway.ts
├── use-cases/<action>/
│   ├── <verb-entity>.ts
└── adapters/
    ├── errors/<context>-error-mapper.ts
    ├── in-memory/in-memory-<context>-gateway.ts
    └── selectors/<context>-selectors.ts

src/app-runtime/runtime/<context>-runtime.ts
core/init-redux-store.ts
src/app-runtime/runtime/store-runtime.ts
src/app-runtime/app-runtime.ts
```

Required for this complete baseline:

- one real business model;
- one typed fallible gateway contract;
- one query or mutation use case;
- durable state owned by the context;
- one manual behavior checks through RTK Query and the Starter store;
- one in-memory implementation;
- runtime API creation and store mounting.

Conditional additions:

```text
core/<context>/adapters/fake/                       # delayed demo mode
core/<context>/adapters/http/                       # remote REST contract
core/<context>/adapters/<sdk>/                      # concrete SDK integration
core/<context>/adapters/presentation/               # localized error copy
core/<context>/gateways/<context>-session-provider.ts # context-only credentials
core/shared/gateways/<shared-provider>.ts           # truly shared runtime port
```

## Domain Model Skeleton

```ts
/** Business entity owned by the <context> bounded context. */
export interface <Entity> {
  /** Stable business identifier. */
  id: string;
  /** Canonical business state, independent from rendering and transport. */
  status: "active" | "inactive";
}
```

Prefer one canonical entity for one business identity. API hydration differences belong in adapter DTOs or optional canonical fields unless they represent genuinely different concepts.

## Public Application DTO Skeleton

```ts
import type { <Entity> } from "@core/<context>/domain/<entity>";

/** Input accepted by the <verbEntity> application action. */
export interface <VerbEntity>Payload {
  /** Entity targeted by the action. */
  <entity>Id: <Entity>["id"];
}
```

Keep request filters, command payloads, page params, and application result shapes here. Do not put HTTP response objects, SDK errors, headers, or credentials here.

## Port Skeleton

```ts
import type { <VerbEntity>Payload } from "@core/<context>/apis/types";
import type { <Entity> } from "@core/<context>/domain/<entity>";
import type { <Context>Result } from "@core/<context>/domain/<context>-result";

/** Domain-oriented operations implemented by replaceable <context> adapters. */
export abstract class <Context>Gateway {
  /** Performs the <verbEntity> business operation. */
  abstract <verbEntity>(
    payload: <VerbEntity>Payload,
  ): Promise<<Context>Result<<Entity>>>;
}
```

## Construction Order

1. Name the context and its owned business concepts.
2. Define canonical models and the context error/result channel.
3. Define public application DTOs and the gateway operation.
4. Implement the in-memory adapter.
5. Implement the RTK Query use case and API options.
6. Add the durable slice and selectors when the resolved value must outlive the request consumer.
7. Write the manual behavior checks.
8. Wire the context in `src/app-runtime/` and `core/init-redux-store.ts`.
9. Add a remote/SDK, fake, authenticated, or presentation adapter only when required.

## Invariants

- Every added file has one clear context-owned responsibility.
- Adapter files live under a named concern, never directly in `adapters/`.
- The gateway describes business operations, not a generic `request()` or RTK `BaseQueryFn`.
- API options receive the abstract gateway; runtime selects the concrete implementation.
- The first manual behavior checks proves both returned behavior and owned durable state.
- No route or component is required for a core-only request.

## Anti-Patterns

- Creating every conditional folder with empty placeholder files.
- Adding a `repository` beside a gateway for the same boundary.
- Naming the context after its first screen.
- Creating entity, list-item, detail, response, and card types for one identity.
- Adding an index barrel across all internals.
- Mounting an API in a route file.
- Copying Auth-specific session behavior into a context that does not need authentication.
