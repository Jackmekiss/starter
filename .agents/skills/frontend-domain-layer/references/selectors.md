# Selectors

The `selectors/` folder contains functions that read or derive state.

Selectors are useful for:

- extracting slices of state
- computing derived values
- simplifying screen code
- centralizing repeated access patterns

Rules:

- keep selectors close to the bounded context
- do not centralize unrelated selectors in one giant file
- if logic becomes business-decision logic, move it to a use-case

## Memoization

Selectors that return a derived array, object, or read model should be memoized with `createSelector`.

Do not use generic memoization helpers such as `lodash.memoize` for Redux selectors.

Default rule:

- prefer direct `createSelector` selectors
- keep selector inputs reference-stable when possible
- use stable fallback constants instead of inline `?? []` or `?? {}`

Use a selector factory only when multiple concurrent instances are truly needed.

Rule of thumb: selectors make reads easy and consistent, but they are not mini use-cases.
