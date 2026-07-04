# Paginated Queries

Use this pattern when a bounded context exposes a paginated history, feed, catalog, notification list, or any retrieval flow that can grow over time.

## Ownership

- pagination belongs to the bounded context, not to the screen
- the bounded context owns the page contract, aggregation rules, and total count
- other contexts should consume selectors or read models, never the paginated state shape directly

## Use-case modeling

- model the flow as an explicit `retrieve*` use-case
- for RTK Query, prefer `build.infiniteQuery` for multi-page retrieval
- keep folder names action-oriented, for example:

```txt
use-cases/
  journal-entries-retrieval/
    retrieveJournalEntries.ts
```

## API contract

Prefer explicit page DTOs in `apis/types.ts`.

Example naming:

- `RetrieveJournalEntriesPageParam`
- `RetrieveJournalEntriesPageResult`

Recommended result shape:

- `entries`: items for the requested page
- `nextPage`: next page param or `null`
- `totalCount`: total number of items in the full collection

Rule of thumb: do not return a bare array once pagination is part of the business contract.

## Gateway and adapter rules

- gateways should accept explicit page params
- adapters should implement the same page contract
- page calculation stays behind the gateway boundary

Example:

- gateway input: `RetrieveXPageParam`
- gateway output: `RetrieveXPageResult`

## Runtime state

When selectors or other consumers need the aggregated list, keep the bounded-context slice aligned with domain meaning:

- store the loaded entries already aggregated across fetched pages
- store the latest entry id when relevant to the domain
- store `totalCount` separately from `entries.length`

Rule of thumb: `entries.length` means "loaded so far", while `totalCount` means "exists in the collection".

## Selectors

- expose selectors for count and read models from the bounded context
- use `totalCount` for profile cards, badges, and summary UI
- keep pagination details out of unrelated contexts

Examples:

- `selectJournalEntryCount`
- `selectNotificationCount`
- `selectCatalogListModel`

## Screen integration

- screens should use the context API hooks, not internal files
- for RTK Query infinite queries, rely on:
  - `hasNextPage`
  - `fetchNextPage`
  - `isFetchingNextPage`
- screens can render "load more" or `onEndReached`, but they should not define pagination contracts

## Review checklist

Before validating a paginated flow, ask:

- is the retrieval flow modeled as an explicit use-case?
- does the gateway return a page result instead of a bare array?
- does the bounded context keep `totalCount` separate from loaded entries?
- do other contexts rely on selectors instead of reading the slice directly?
- is pagination treated as domain/API behavior rather than screen-only behavior?
