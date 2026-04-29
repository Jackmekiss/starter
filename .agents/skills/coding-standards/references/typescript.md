# TypeScript

Rules:

- prefer explicit types for domain boundaries
- prefer clarity over clever typing
- avoid overengineering the type system
- use simple discriminated unions when useful
- keep interfaces readable
- a domain interface should be understandable in a few seconds

Examples of simple unions:

- `active | paused | finished`
- `planned | completed | skipped`
