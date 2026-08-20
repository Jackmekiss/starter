# Use-Cases

The `use-cases/` folder contains explicit application actions.

Each important business action should be modeled as a named use-case, for example:

- retrieve entity
- update entity
- search items
- validate flow
- create record
- complete step
- cancel operation

## Rules

- one file per use-case
- keep each use-case focused
- a use-case should do one clear thing
- a use-case should be easy to call from screens
- keep decisions that depend on the initiating application flow in the use-case
- keep before-and-after comparisons and selection of required updates in the use-case
- construct the command for the action in the use-case, then let adapters map it to infrastructure
- call the injected bounded-context gateway from RTK Query `queryFn`
- convert gateway `ContextResult<Value>` values with shared `toRtkQueryResult`
- keep `url`, HTTP `method`, transport `body`, SDK operation names, and concrete adapter imports out of the use-case

These responsibilities remain use-case behavior even when every input and output uses domain types. Keep intrinsic invariants in the domain instead.

## Structure convention

Group use-cases in a dedicated folder per business action.

Prefer:

```txt
use-cases/
  account-retrieval/
    retrieveAccount.ts
```

Avoid placing all use-case files flat in `use-cases/` once a bounded context starts growing.

## Naming

- use business-first names
- use hyphenated action-oriented folder names
- keep the file verb-based

Rule of thumb: a use-case should read like a business sentence.

## RTK Query integration

Use `queryFn` as the application boundary when an endpoint delegates to a business gateway:

```ts
purchaseSubscription: build.mutation<Result, Payload>({
  queryFn: async (payload) =>
    toRtkQueryResult(await subscriptionGateway.purchaseSubscription(payload)),
});
```

Use-case-owned validation may return `{ error: ContextError }` before calling the gateway. Infrastructure mapping remains inside the concrete adapter.
