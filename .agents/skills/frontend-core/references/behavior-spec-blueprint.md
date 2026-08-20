# Behavior Spec Blueprint

> Blueprint version: `1.0.0`

Use this frozen blueprint for behavior under `core/<context>/use-cases`. Specs exercise the public context action through RTK Query and the real Starter store.

## Placeholders

- `<context>` / `<Context>`: bounded context
- `<action>`: use-case folder
- `<verbEntity>` / `<VerbEntity>`: endpoint and behavior name
- `<Payload>` / `<Value>`: action input and success value
- `<expected-state>`: durable state owned by the use case

## Files

```text
core/<context>/use-cases/<action>/<verb-entity>.spec.ts
core/<context>/domain/builders/<entity>-builder.ts
core/<context>/adapters/in-memory/in-memory-<context>-gateway.ts
```

Conditional:

- use a concrete HTTP/SDK adapter inside the spec when verifying its mapping through the use case;
- inject `DeterministicDateProvider` when behavior depends on current time;
- use a fake adapter only when latency/fake failure parity is itself relevant.

Do not create a shared spec-helper layer by default. Each spec remains readable and self-contained.

## Independent Forward-Test Rule

Write scenario names, inputs, observable outcomes, and failure expectations from the user request and accepted, non-superseded decisions before using the implementation as evidence. A forward spec may reuse public builders and the canonical store/API harness, but it must not derive expected values from the same mapper, reducer, fixture, or production helper that produces the result. Existing code is an implementation candidate; the accepted behavior contract decides whether that code or the new spec must change.

## Complete Spec Skeleton

```ts
import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemory<Context>Gateway } from "@core/<context>/adapters/in-memory/in-memory-<context>-gateway";
import { create<Context>ApiOptions } from "@core/<context>/apis/<context>-api";
import { <entity>Builder } from "@core/<context>/domain/builders/<entity>-builder";
import { createStore } from "@core/init-redux-store";

import type { <Payload> } from "@core/<context>/apis/types";
import type { <Context>Gateway } from "@core/<context>/gateways/<context>-gateway";
import type { ReduxStore } from "@core/init-redux-store";

/** Creates the <context> API used by <verbEntity> behavior specs. */
function create<Context>Api(<context>Gateway: <Context>Gateway) {
  return createApi(create<Context>ApiOptions(<context>Gateway));
}

describe("<Verb Entity>", () => {
  let store: ReduxStore;
  let <context>Gateway: InMemory<Context>Gateway;
  let <context>Api: ReturnType<typeof create<Context>Api>;

  beforeEach(() => {
    <context>Gateway = new InMemory<Context>Gateway();
    <context>Api = create<Context>Api(<context>Gateway);
    store = createStore({ <context>Api }, {});
  });

  it("should <business outcome>", async () => {
    const value = <entity>Builder().withId("expected-id").build();
    <context>Gateway.<fixture> = value;

    const result = await <verbEntity>({ <payload-fields> });

    expect(result).toEqual(value);
    expect(store.getState().<context>).toEqual(<expected-state>);
  });

  it("should expose a typed failure without applying success state", async () => {
    <context>Gateway.error = { kind: "network", retryable: true };

    await expect(
      <verbEntity>({ <payload-fields> }),
    ).rejects.toEqual({ kind: "network", retryable: true });

    expect(store.getState().<context>).toEqual(<unchanged-state>);
  });

  /** Dispatches the <verbEntity> use case. */
  async function <verbEntity>(payload: <Payload>) {
    return store
      .dispatch(<context>Api.endpoints.<verbEntity>.initiate(payload))
      .unwrap();
  }
});
```

For a `void` query or mutation argument, call `.initiate()` with no payload according to the generated endpoint signature.

## Fluent Builder Skeleton

```ts
import type { <Entity> } from "@core/<context>/domain/<entity>";

/** Creates immutable <entity> fixtures for behavior specs. */
export function <entity>Builder({
  id = "<entity>-id",
  status = "active",
}: Partial<<Entity>> = {}) {
  const props: <Entity> = { id, status };

  return {
    /** Returns a new builder with the provided identifier. */
    withId(value: <Entity>["id"]) {
      return <entity>Builder({ ...props, id: value });
    },
    /** Builds the represented entity. */
    build(): <Entity> {
      return { id: props.id, status: props.status };
    },
  };
}
```

Builders live in `domain/builders/`, mirror domain entities, and return new builders rather than mutating fixture state.

## External Mapping Through a Use Case

Instantiate the concrete adapter, rebuild the API/store around the abstract gateway, dispatch the same endpoint, and assert the `.unwrap()` value or rejection. This proves the full boundary without mapper-only specs.

```ts
/** Rebuilds the spec API and store around one gateway implementation. */
function use<Context>Gateway(nextGateway: <Context>Gateway) {
  <context>Api = create<Context>Api(nextGateway);
  store = createStore({ <context>Api }, {});
}
```

When testing HTTP, inject a deterministic fetch function and inspect only contract-relevant request details. Never call a live backend.

## Time-Dependent Behavior

```ts
const dateProvider = new DeterministicDateProvider();
dateProvider.dateOfNow = new Date("2026-01-01T00:00:00.000Z");
<context>Gateway = new InMemory<Context>Gateway(dateProvider);
```

Assert the exact resulting timestamp. Prefer this over fake timers or broad ISO-string assertions.

When a fake adapter is the subject of a parity or latency spec, instantiate it with its actual declared signature. Starter adapters are gateway-compatible but do not share a constructor contract; for example, latency may precede the date provider.

## Behavior Coverage

Cover what the use case owns:

- success return value;
- durable state update or deliberate absence of one;
- use-case validation;
- mapped business and technical failures reaching `.unwrap()` unchanged;
- no success-side state mutation after failure;
- cleanup semantics for logout/account deletion when relevant;
- gateway-visible effects that cannot be observed through returned value or Redux state.

## Invariants

- Dispatch the RTK Query endpoint; do not call the builder or gateway as the primary assertion path.
- Use the actual `createStore` factory and only the APIs required by the spec.
- Keep scenario fixture setup inside the owning `it` block.
- Use explicit expectations rather than broad snapshots.
- Type the API factory against the abstract gateway so the same path can test alternate adapters.

## Anti-Patterns

- Screen or component tests standing in for use-case behavior.
- Mapper-only tests that never cross the gateway/use-case boundary.
- Shared mutable module-level in-memory adapter fixtures.
- A large shared test utility hiding API/store construction.
- Assertions about RTK internal cache shape when business state/result is sufficient.
- Claiming a failure was tested without awaiting `.unwrap()` rejection.

## Validation

Run, in order as relevant:

- the targeted spec with Vitest when practical;
- `pnpm run test`;
- `pnpm run typecheck`;
- targeted lint/format checks, then repository-wide checks for broad changes.
