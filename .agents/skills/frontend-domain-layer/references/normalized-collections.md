# Normalized Collections

When a bounded context owns a durable collection of entities keyed by id, prefer a normalized runtime state.

Typical examples:

- catalogs
- histories
- feeds
- saved items
- entries loaded from the backend and addressed by id

Preferred default:

- use `createEntityAdapter`
- store the collection as `EntityState<T, string>`
- normalize a single business entity, not separate `ListItem` and `Detail` variants of the same entity
- avoid parallel copies such as both `entries[]` and `entitiesById`
- avoid storing `totalCount` when it can be derived from `ids.length`
- avoid storing `latestEntryId` when it can be derived from the sorted entity state

## Slice pattern

Default pattern:

- export the adapter from `domain/`
- initialize state with `adapter.getInitialState()`
- use adapter reducers such as `setAll`, `upsertMany`, `addOne`, `upsertOne`

Prefer a small reducer surface such as:

- `updateXxxs: adapter.upsertMany`
- `appendXxx: adapter.addOne`

Do not add extra wrapper state unless it represents real product truth that cannot be derived.

## Retrieve use-case pattern

For a retrieve query that loads a whole collection:

- let the gateway return the raw array from the backend or adapter
- in RTK Query, normalize with `transformResponse`
- return the normalized `EntityState<T, string>` from the query
- dispatch `updateXxxs(data.entities)` in `onQueryStarted`

Preferred shape:

- response DTO: `Entity[]`
- query result: `EntityState<Entity, string>`

This keeps the public API aligned with the normalized store shape and avoids re-normalizing the same collection in multiple places.

## Naming

When a collection is normalized, prefer the business entity name for the stored type:

- good: `Audio`, `JournalEntry`, `WinEntry`
- avoid: `AudioListItem`, `AudioDetail`, `JournalEntryCard`

If one retrieve hydrates more fields than another:

- keep one domain entity when the business identity is the same
- model partial hydration through optional fields or API-level DTO differences
- only introduce separate domain types when they express different business concepts, not different screens

## Selectors

When the slice is normalized:

- use adapter selectors as the base read layer
- derive ordered arrays with `selectAll`
- derive counts from `ids.length`
- derive latest items from the first sorted entity, not from duplicated `latestId`

If the UI needs grouped or formatted data, build that with memoized selectors from the normalized state.

## When Not To Normalize

Do not force `createEntityAdapter` when the state is:

- a singleton object
- a temporary UI session
- a small local seed only used once
- a payload that is never addressed by id

Rule of thumb:

- durable collection keyed by id: normalize
- one-off object or temporary screen state: keep it simple
