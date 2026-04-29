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
