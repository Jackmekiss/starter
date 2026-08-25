# Errors, Results, and Adapters Blueprint

> Blueprint version: `1.3.0`

Use this frozen blueprint whenever a gateway operation can fail or a concrete transport, SDK, storage system, clock, or session source is introduced.

## Placeholders

- `<context>` / `<Context>`: bounded-context names
- `<ContextErrorCode>`: stable application-owned code union
- `<Value>`: successful operation value
- `<Infrastructure>`: concrete concern such as `Http`, `RevenueCat`, or `SecureStore`
- `<operation>`: domain-oriented gateway method
- `<latency-ms>`: intentional fake-runtime delay, for example `800`

## Required and Conditional Files

```text
core/shared/domain/application-error.ts               # existing shared technical categories
core/shared/domain/result.ts                          # existing Result container
core/<context>/domain/<context>-error.ts              # required for a fallible context
core/<context>/domain/<context>-result.ts             # required
core/<context>/adapters/errors/<context>-error-mapper.ts # required fallback/preservation
core/<context>/gateways/<context>-gateway.ts           # required port
core/<context>/adapters/in-memory/in-memory-<context>-gateway.ts # required baseline
core/<context>/adapters/fake/fake-<context>-gateway.ts   # conditional delayed demo mode
core/<context>/adapters/<infrastructure>/...           # conditional external adapter
core/<context>/adapters/presentation/...               # conditional UI-copy adapter
core/<context>/gateways/*-session-provider.ts          # conditional context-owned auth port
core/shared/gateways/date-provider.ts                  # reuse when behavior depends on now
```

## Error Flow

```text
external failure
  -> concrete adapter maps infrastructure detail
  -> gateway returns <Context>Result<Value>
  -> use-case queryFn calls toRtkQueryResult
  -> RTK Query stores transient request state
  -> UI .unwrap() rejects with the same <Context>Error
  -> presentation adapter selects safe localized copy
```

Each layer makes one decision. Do not map the same failure again downstream.

## Context Error Contract

```ts
import {
  isContextApplicationError,
  isTechnicalApplicationError,
} from "@core/shared/domain/application-error";

import type { ApplicationError } from "@core/shared/domain/application-error";

/** Stable <context> failures independent from infrastructure and UI copy. */
export type <Context>ErrorCode =
  | "<BUSINESS_FAILURE>"
  | "<VALIDATION_FAILURE>";

/** Failure exposed by <context> use cases. */
export type <Context>Error = ApplicationError<<Context>ErrorCode>;

/** Narrows an unknown value to the <context> error contract. */
export function is<Context>Error(value: unknown): value is <Context>Error {
  if (isTechnicalApplicationError(value)) return true;

  return isContextApplicationError(value) && is<Context>ErrorCode(value.code);
}

/** Checks whether a stable code belongs to <context>. */
function is<Context>ErrorCode(value: string): value is <Context>ErrorCode {
  return value === "<BUSINESS_FAILURE>" || value === "<VALIDATION_FAILURE>";
}
```

Use uppercase snake case for business codes. A code describes application meaning and must remain valid when the backend or SDK changes.

## Result Alias

```ts
import type { <Context>Error } from "@core/<context>/domain/<context>-error";
import type { Result } from "@core/shared/domain/result";

/** Result returned by a <context> operation. */
export type <Context>Result<Value> = Result<Value, <Context>Error>;
```

Every expected fallible gateway method returns `Promise<<Context>Result<Value>>`; do not expose raw throws or document failure only in JSDoc.

## Adapter-Independent Mapper

```ts
import { is<Context>Error } from "@core/<context>/domain/<context>-error";

import type { <Context>Error } from "@core/<context>/domain/<context>-error";

/** Preserves <context> failures and hides unexpected adapter details. */
export function map<Context>AdapterError(error: unknown): <Context>Error {
  if (is<Context>Error(error)) return error;
  if (error instanceof Error && is<Context>Error(error.cause)) {
    return error.cause;
  }
  return { kind: "unexpected", retryable: false };
}
```

Backend codes, HTTP status mapping, response decoding, SDK exception classes, and transport timeouts belong in the named concrete adapter, not in this generic mapper.

## In-Memory Adapter Execution Skeleton

```ts
/** In-memory <context> behavior used by local runtime and manual behavior checks. */
export class InMemory<Context>Gateway extends <Context>Gateway {
  private currentError?: <Context>Error;

  /** Sets a deterministic failure for manual behavior checks. */
  set error(value: <Context>Error | undefined) {
    this.currentError = value;
  }

  /** Performs the local <operation> behavior. */
  <operation>(payload: <Payload>): Promise<<Context>Result<<Value>>> {
    return this.executeOperation(() => {
      if (<business-condition-fails>) {
        return {
          ok: false,
          error: {
            kind: "business",
            code: "<BUSINESS_FAILURE>",
            retryable: false,
          },
        };
      }

      return { ok: true, value: <resolved-value> };
    });
  }

  /** Executes one local operation without leaking implementation failures. */
  private async executeOperation<Value>(
    operation: () =>
      | <Context>Result<Value>
      | Promise<<Context>Result<Value>>,
  ): Promise<<Context>Result<Value>> {
    if (this.currentError) return { ok: false, error: this.currentError };

    try {
      return await operation();
    } catch (error) {
      return { ok: false, error: map<Context>AdapterError(error) };
    }
  }
}
```

Route every operation through the same failure-preserving path. Fixture state is private instance state; expose focused setters only for behavior setup.

## Fake Adapter Skeleton

A fake adds demo latency or scenario controls but delegates business behavior and failure handling to the in-memory adapter:

```ts
import { InMemory<Context>Gateway } from "@core/<context>/adapters/in-memory/in-memory-<context>-gateway";
import { <Context>Gateway } from "@core/<context>/gateways/<context>-gateway";
import { DeterministicDateProvider } from "@core/shared/adapters/date/deterministic-date-provider";
import { sleep } from "@core/shared/adapters/time/sleep";

import type { <Context>Error } from "@core/<context>/domain/<context>-error";
import type { <Context>Result } from "@core/<context>/domain/<context>-result";
import type { DateProvider } from "@core/shared/gateways/date-provider";

/** Delayed demo implementation backed by canonical in-memory behavior. */
export class Fake<Context>Gateway extends <Context>Gateway {
  private readonly inMemoryGateway: InMemory<Context>Gateway;

  /** Configures fake latency while preserving an injectable clock. */
  constructor(
    private readonly latencyMilliseconds = <latency-ms>,
    dateProvider: DateProvider = new DeterministicDateProvider(),
  ) {
    super();
    this.inMemoryGateway = new InMemory<Context>Gateway(dateProvider);
  }

  /** Injects the same deterministic failure used by the in-memory adapter. */
  set error(value: <Context>Error | undefined) {
    this.inMemoryGateway.error = value;
  }

  /** Performs <operation> after the configured demo latency. */
  async <operation>(payload: <Payload>): Promise<<Context>Result<<Value>>> {
    await sleep(this.latencyMilliseconds);
    return this.inMemoryGateway.<operation>(payload);
  }
}
```

If different operations intentionally have different delays, keep those delays beside the corresponding method instead of forcing one field. In every case, declare the fake's actual constructor and make runtime and manual checks follow that signature; gateway substitutability does not imply constructor substitutability.

## Concrete Adapter Skeleton

```ts
/** <Infrastructure>-backed implementation of the <context> gateway. */
export class <Infrastructure><Context>Gateway extends <Context>Gateway {
  /** Creates the adapter around its external runtime. */
  constructor(private readonly runtime: <Infrastructure>Runtime) {
    super();
  }

  /** Maps one external operation into the context Result contract. */
  async <operation>(payload: <Payload>): Promise<<Context>Result<<Value>>> {
    try {
      const response = await this.runtime.<externalOperation>(payload);
      return decode<Infrastructure><Value>(response);
    } catch (error) {
      return { ok: false, error: map<Infrastructure><Context>Error(error) };
    }
  }
}
```

Decode successful external data as `unknown` when the boundary is untrusted. Convert it to domain/application values before returning.

## Authenticated Adapter Pattern

```ts
/** Reads the current session without copying ownership into an adapter. */
export abstract class <Context>SessionProvider {
  /** Returns the session visible at operation time. */
  abstract getSession(): Session | null;
}
```

Inject the provider into the concrete adapter and read it immediately before each protected operation. Keep credentials out of domain models, `apis/types.ts`, use-case args, and gateway args. Runtime connects the provider to the current Redux-owned session.

## Time-Dependent Adapter Pattern

Inject the existing `DateProvider`. Runtime uses `RealDateProvider`; in-memory adapters and manual checks use `DeterministicDateProvider`. Do not call `Date.now()` or construct the current date directly in time-dependent adapter behavior.

## Presentation Adapter Pattern

Presentation adapters accept `unknown`, a typed i18next `TFunction`, and an options object containing safe fallback copy plus optional action context. They map stable context codes and shared technical kinds only. UI placement and retry controls remain outside the adapter.

## Invariants

- Preserve an existing typed context error, including through `Error.cause`.
- Map documented infrastructure business codes before generic transport failures.
- Unknown failures become non-retryable `unexpected` errors with no raw detail.
- Fake, in-memory, HTTP, and SDK implementations satisfy the same gateway contract.
- Fake operations delegate through the in-memory adapter's `Result`-aware execution path.
- `retryable` controls recovery behavior, never user-visible backend detail.

## Anti-Patterns

- Returning `Promise<Value>` from an expected-fallible gateway.
- `throw error`, `error.message`, raw HTTP status, backend code, or SDK exception outside a concrete adapter.
- `success: false` transport unions beside the shared `Result` contract.
- Storing request errors in a durable slice merely so UI can select them.
- Mapping one generic `unauthenticated` error to action-specific copy without action context.
- Importing the Redux store directly from a gateway.
