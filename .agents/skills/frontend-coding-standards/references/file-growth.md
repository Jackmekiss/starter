# File Growth

Rules:

- split files before they become vague
- if a file starts holding multiple unrelated concepts, split it
- split by responsibility and reason to change, not only by line count
- do not keep functions together only because they manipulate the same business noun
- avoid giant utility files
- do not leave TypeScript files directly under a bounded context's `adapters/`
- group adapter files under a named concern such as `core-api/`, `errors/`, `fake/`, `i18next/`, `in-memory/`, or `selectors/`

If a helper file keeps growing, ask whether that logic belongs in:

- a bounded context
- a selector
- a use-case
- a UI helper

Rule of thumb: prefer more small clear files over fewer ambiguous files.

A small file still needs splitting when it mixes durable domain invariants, application-flow decisions, infrastructure mapping, and presentation formatting.
