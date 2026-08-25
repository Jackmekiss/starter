# Runtime Wiring Blueprint

> Blueprint version: `1.0.1`

Use this frozen blueprint when adding or changing concrete gateway selection, RTK Query API creation, hook exports, middleware, persistence, store mounting, or the frontend composition root.

Account onboarding remains durable Account truth. Runtime exports
`useCompleteOnboardingMutation`, while navigation reads the Account selector. Do not compose a
Zustand session store, hydration flag, or separate `shouldCreateAccount` value. In-memory and fake
fixtures used to open the neutral Starter begin as `completed`; provisioning behavior specs seed
`pending` explicitly.

## Placeholders

- `<context>` / `<Context>`: bounded context
- `<Context>Gateway`: abstract business port
- `<Context>Api`: runtime RTK Query instance
- `<verbEntity>`: endpoint name exported as a React hook
- `<app-mode>`: supported concrete runtime selection

## Ownership Tree

```text
core/<context>/apis/<context>-api.ts       # API options only
core/init-redux-store.ts                   # API/slice-agnostic store factory
src/app-runtime/runtime/<context>-runtime.ts # concrete gateway + createApi + hooks
src/app-runtime/runtime/store-runtime.ts   # mount APIs/middleware/persistence
src/app-runtime/app-runtime.ts             # narrow UI-facing runtime facade
src/app-runtime/root-app-providers.tsx     # global providers
src/app/_layout.tsx                        # route shell; exports no runtime symbols
```

Concrete adapters are selected exactly once in the composition root. Screens do not reproduce environment branching.

Required when mounting a new context:

- one `<context>-runtime.ts` that selects the gateway, creates the API, and names its hooks;
- the API reducer and middleware in the store factory/runtime;
- explicit UI-hook exports from `app-runtime.ts`.

Conditional:

- session-provider connection for protected infrastructure operations;
- listener middleware and API reset for account-scoped state;
- slice persistence or fulfilled-query persistence only when accepted product/runtime behavior requires it;
- root-provider changes only when the context introduces a genuine app-wide provider.

## Context Runtime Skeleton

```ts
import { createApi } from "@reduxjs/toolkit/query/react";

import { appMode } from "@/app-runtime/runtime/app-mode";
import { Fake<Context>Gateway } from "@core/<context>/adapters/fake/fake-<context>-gateway";
import { InMemory<Context>Gateway } from "@core/<context>/adapters/in-memory/in-memory-<context>-gateway";
import { create<Context>ApiOptions } from "@core/<context>/apis/<context>-api";
import { RealDateProvider } from "@core/shared/adapters/date/real-date-provider";

import type { <Context>Gateway } from "@core/<context>/gateways/<context>-gateway";

/** Creates the <context> gateway for the current runtime mode. */
function create<Context>Gateway(): <Context>Gateway {
  const dateProvider = new RealDateProvider();

  if (appMode === "fake") {
    return new Fake<Context>Gateway(
      <arguments required by Fake<Context>Gateway, including dateProvider>,
    );
  }

  return new InMemory<Context>Gateway(
    <arguments required by InMemory<Context>Gateway, including dateProvider>,
  );
}

export const <context>Api = createApi(
  create<Context>ApiOptions(create<Context>Gateway()),
);

export const {
  use<VerbEntity>Query,
  use<Command>Mutation,
} = <context>Api;
```

Add a remote or SDK branch only when its configuration and runtime contract exist. Preserve the in-memory default for Starter unless an accepted decision changes it.

The constructor expressions above contain deliberate placeholders: inspect each adapter and pass its declared arguments in their declared order. For example, an adapter may accept `(latencyMilliseconds, dateProvider)`, `(dateProvider)`, or an options object. Do not infer a shared constructor signature merely because the adapters implement the same gateway.

## Authenticated Runtime Provider

When a concrete adapter needs the current session, connect a small provider to Redux without copying session state:

```ts
let readCurrentSession: () => Session | null = () => null;

export const <context>SessionProvider: <Context>SessionProvider = {
  getSession() {
    return readCurrentSession();
  },
};

/** Connects the provider to the Redux source of truth. */
export function connect<Context>SessionProvider(
  reader: () => Session | null,
): void {
  readCurrentSession = reader;
}
```

Call the connector after the store is created. The adapter reads the session immediately before a protected operation. Do not retain another mutable credential copy.

## Store API Contract

Extend the API registry with the new runtime API:

```ts
/** Minimal RTK Query API surface needed by the Redux store. */
interface StoreApi {
  reducerPath: string;
  reducer: Reducer;
  middleware: Middleware;
}

/** RTK Query API instances mounted into the Redux store. */
export interface Apis {
  /** Account API retained by the complete Starter baseline. */
  accountApi: StoreApi;
  /** Authentication API retained by the complete Starter baseline. */
  authApi: StoreApi;
  /** Subscription API retained by the complete Starter baseline. */
  subscriptionApi: StoreApi;
  /** New bounded-context API mounted by this slice. */
  <context>Api: StoreApi;
}
```

The store factory keeps APIs optional for isolated behavior specs:

```ts
/** Creates the root reducer from enabled APIs and domain slices. */
function createReducers(apis: Partial<Apis>) {
  return combineReducers({
    ...(apis.<context>Api && {
      [apis.<context>Api.reducerPath]: apis.<context>Api.reducer,
    }),
    [<context>Slice.name]: <context>Slice.reducer,
  });
}
```

Middleware is collected from the supplied API values; do not hard-code each API middleware twice.

## Store Runtime Skeleton

```ts
import { <context>Api } from "@/app-runtime/runtime/<context>-runtime";
import { createStore } from "@core/init-redux-store";

export const store = createStore(
  {
    authApi,
    subscriptionApi,
    <context>Api,
  },
  {},
  {},
  persistConfig,
  [<context>ListenerMiddleware.middleware],
  runtimeConfiguration,
);
```

Preserve current persistence and middleware ordering. Add account-clear listener behavior only when the new context owns account-scoped data:

```text
<context>ListenerMiddleware.startListening({
  actionCreator: clearAuth,
  effect: (_, { dispatch }) => {
    dispatch(clear<Context>State());
    dispatch(<context>Api.util.resetApiState());
  },
});
```

## Runtime Facade

Expose runtime hooks through the app-facing barrel:

```ts
export { appMode } from "@/app-runtime/runtime/app-mode";
export {
  use<VerbEntity>Query,
  use<Command>Mutation,
} from "@/app-runtime/runtime/<context>-runtime";
```

Keep the existing `appMode` export exactly once; add only the explicit hooks for each context. UI imports them from `@/app-runtime/app-runtime`. Keep API instances, store, persistor, listener middleware, session providers, and concrete gateway factories internal to `src/app-runtime/runtime/`. `src/app/_layout.tsx` imports providers and the root navigator for composition only; it does not re-export the facade or any runtime symbol.

## Providers and Persistence

- Redux `Provider`, `PersistGate`, localization, theme, safe area, gestures, and other global providers stay in `root-app-providers.tsx`.
- Keep existing secure-session storage and fulfilled-query persistence transforms intact unless the request explicitly changes persistence.
- Do not persist credentials in ordinary AsyncStorage or duplicate the Redux session source of truth.
- Runtime environment values remain configuration; never copy raw values into docs or domain code.

## Invariants

- `core/` exports API options, never a globally configured React API instance.
- Runtime owns concrete implementation choice and React hook generation.
- Keep standard runtime composition direct; verify its wiring structurally and cover durable reset behavior through the context's core behavior specs unless the request explicitly requires a runtime integration harness.
- Store factories remain usable by tests with a subset of APIs and no persistence.
- UI consumes a stable facade containing explicit `appMode` and hook exports only.
- A new context's reducer, API reducer, middleware, reset behavior, and hook exports are wired together in one change.

## Anti-Patterns

- `createApi()` in a use-case or route.
- Constructing an HTTP, in-memory, fake, or SDK gateway in a component.
- Importing the application store from a concrete gateway.
- Passing the store through domain models or use-case payloads.
- A second persisted auth/connection flag beside Redux auth state.
- Clearing mutable transport auth for a public request and racing a protected request.
- `export *` from a runtime module or any `_layout.tsx` runtime re-export.
- Exporting a test-only runtime factory, adding `src/app-runtime` specs, or widening Vitest discovery merely to prove the standard API/listener/store wiring.
- Publishing API instances, store, persistor, listeners, gateway factories, or session providers through the UI facade.
