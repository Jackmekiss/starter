# State and Selectors Blueprint

> Blueprint version: `1.0.0`

Use this frozen blueprint when a bounded context owns durable frontend truth or exposes stable reads derived from Redux state.

## Placeholders

- `<context>` / `<Context>`: bounded context
- `<entity>` / `<Entity>`: owned business entity
- `<Entities>`: plural collection name
- `<readModel>` / `<ReadModel>`: stable derived value shared by consumers

## Ownership Test

Keep state in the bounded context when it must survive a screen, be shared across flows, be persisted or synchronized, or drive a real product decision. Keep focus, open/closed state, form fields, animation/playback progress, temporary selection, and other mounted interaction mechanics in the UI.

Runtime state reflects the domain; it is not the domain model itself.

## Files

```text
core/<context>/domain/slice.ts
core/<context>/adapters/selectors/<context>-selectors.ts
core/init-redux-store.ts
```

Conditional:

- `createEntityAdapter` for a durable collection keyed by id.
- a context-wide clear action when several slices must reset together.
- memoized selectors when a read returns a derived object, array, or read model.

## Singleton Slice Skeleton

```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { <Entity> } from "@core/<context>/domain/<entity>";

/** Durable <context> state shared across application flows. */
export interface <Context>State {
  /** Current <entity>, or null when none is known. */
  <entity>: <Entity> | null;
}

const initial<Context>State: <Context>State = {
  <entity>: null,
};

export const <context>Slice = createSlice({
  name: "<context>",
  initialState: initial<Context>State,
  reducers: {
    set<Entity>: (state, action: PayloadAction<<Entity> | null>) => ({
      ...state,
      <entity>: action.payload,
    }),
    clear<Context>: () => initial<Context>State,
  },
});

export const { set<Entity>, clear<Context> } = <context>Slice.actions;
```

Do not store a value that can be derived reliably from canonical state.

## Normalized Collection Skeleton

```ts
import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import type { <Entity> } from "@core/<context>/domain/<entity>";

export const <entity>Adapter = createEntityAdapter<<Entity>>();

/** Clears every durable value owned by <context>. */
export const clear<Context>State = createAction(
  "<context>/clear<Context>State",
);

export const <entity>Slice = createSlice({
  name: "<entities>",
  initialState: <entity>Adapter.getInitialState(),
  reducers: {
    clear<Entities>: <entity>Adapter.removeAll,
    update<Entities>: <entity>Adapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder.addCase(clear<Context>State, <entity>Adapter.removeAll);
  },
});

export const { clear<Entities>, update<Entities> } = <entity>Slice.actions;
```

Use one canonical entity state, not parallel arrays, id maps, duplicated counts, or separate list/detail copies. Preserve API ordering only if it has real business meaning; configure the entity adapter or keep explicit ordered metadata when needed.

## Selector Skeleton

```ts
import { createSelector } from "@reduxjs/toolkit";

import { <entity>Adapter } from "@core/<context>/domain/slice";

import type { RootState } from "@core/init-redux-store";
import type { <Entity> } from "@core/<context>/domain/<entity>";

export const <entity>Selectors = <entity>Adapter.getSelectors(
  (state: RootState) => state.<entities>,
);

/** Returns the canonical <entity> collection. */
export const select<Entities> = <entity>Selectors.selectAll;

/** Returns the current <entity> when the context owns a singleton. */
export function selectCurrent<Entity>(
  state: RootState,
): <Entity> | null {
  return state.<context>.<entity>;
}

export const select<ReadModel> = createSelector(
  [selectCurrent<Entity>],
  (<entity>): <ReadModel> => ({
    <derived-field>: <entity>?.<field> ?? <fallback>,
  }),
);
```

Use direct functions for simple reads. Use `createSelector` when returning a derived object, array, grouping, count, or stable read model. Prefer stable module-level fallback arrays/objects if selector inputs require them.

## Root Store Integration

Add each context slice to the root reducer using its slice name:

```ts
return combineReducers({
  [<context>Slice.name]: <context>Slice.reducer,
  [<entity>Slice.name]: <entity>Slice.reducer,
  // RTK Query reducers remain conditional on mounted runtime APIs.
});
```

Update `RootState` through inference from the root reducer. Do not create a second handwritten root-state contract.

## Canonical Collection Data Flow

```text
gateway returns Entity[]
  -> RTK Query query resolves Entity[]
  -> onQueryStarted waits for queryFulfilled
  -> updateEntities(data) uses entity adapter
  -> selectors read normalized durable state
  -> UI consumes query metadata and/or selectors
```

RTK Query owns request lifecycle. Redux slices own durable product state. Do not store the same transient error in both.

## Invariants

- State names express product meaning, not component shape.
- Only the owning context mutates its durable state.
- Selectors read state; they do not perform commands or external access.
- Block-local display formatting stays in the UI.
- Derived values are not persisted without a demonstrated need.
- Account-scoped state has an explicit reset path when auth clears.

## Anti-Patterns

- Modal, selected tab, field text, focus, animation, or temporary playback state in a domain slice.
- `latestError`, `isLoading`, or request-message fields duplicated from RTK Query.
- `items[]` plus `entitiesById` plus stored count for the same collection.
- A selector used as a destination for arbitrary parsing moved out of a component.
- `lodash.memoize` for Redux selectors.
- One global selector file spanning unrelated contexts.
