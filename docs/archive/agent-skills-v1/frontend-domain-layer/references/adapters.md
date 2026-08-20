# Adapters

The `adapters/` folder contains concrete implementations of gateway contracts.

Typical implementations include:

- in-memory adapters
- local storage adapters
- SQLite adapters
- remote API adapters
- sync adapters

## Folder structure

Do not place TypeScript files directly in `core/<context>/adapters/`. Every adapter must belong to a named concern folder:

- `core-api/` for backend implementations and backend-specific mappers
- `errors/` for adapter-independent context-error preservation and fallback
- `fake/` for latency or demo adapters
- `in-memory/` for local data-source implementations
- `i18next/` or another named presentation concern for domain-error-to-copy adapters
- `selectors/` for Redux read adapters
- another explicit infrastructure name when none of these apply

Keep files directly inside the selected concern folder unless that concern has multiple distinct business areas that justify another level.

Why this matters:

- UI can be built before the backend exists
- business logic can be tested in isolation
- data sources can be replaced later without rewriting screens

Important: in frontend-first projects, in-memory adapters are valid and encouraged early.

For protected infrastructure operations, inject a minimal current-session provider into the concrete adapter and read it at operation time. Keep credentials out of use-cases and business gateway parameters. See [authenticated-adapters.md](authenticated-adapters.md).

Concrete adapters own transport and SDK mapping. HTTP paths, verbs, headers, response decoding, backend codes, RevenueCat calls, database queries, and storage keys must stay inside the adapter that implements the gateway.

Name an adapter `<Infrastructure><Context>Gateway` when it directly implements the business gateway. Reserve `BaseQuery` naming for a real RTK Query base-query function rather than a business contract or adapter.

Rule of thumb: adapters are replaceable infrastructure.
