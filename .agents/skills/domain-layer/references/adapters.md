# Adapters

The `adapters/` folder contains concrete implementations of gateway contracts.

Typical implementations include:

- in-memory adapters
- local storage adapters
- SQLite adapters
- remote API adapters
- sync adapters

Why this matters:

- UI can be built before the backend exists
- business logic can be tested in isolation
- data sources can be replaced later without rewriting screens

Important: in frontend-first projects, in-memory adapters are valid and encouraged early.

Rule of thumb: adapters are replaceable infrastructure.
