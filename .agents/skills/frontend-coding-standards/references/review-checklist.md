# Review Checklist

Before validating a feature, ask:

- Is the domain naming clear?
- Is the business action modeled as a use-case?
- Is the screen still thin?
- Is data access abstracted behind a gateway?
- Is the implementation placed in the right bounded context?
- Are adapter files grouped under named concern folders instead of living directly in `adapters/`?
- Is any code too generic or ambiguous?
- Is UI logic leaking into the domain?
- Is domain logic leaking into the UI?
- Do fallible gateways expose typed context results without leaking infrastructure failures?
- Are business concepts and application functions documented with useful JSDoc?
- Does the documentation explain intent or constraints instead of repeating names and types?

## Final agent rules

When making changes in this repository:

- prefer obvious code over smart code
- prefer business meaning over technical cleverness
- keep screens thin
- keep components presentational
- keep domain models stable
- keep use-cases explicit
- keep gateways as contracts
- keep adapters replaceable
- do not over-abstract too early
- do not introduce generic folders without strong justification
- do not create vague names like `helpers`, `misc`, `manager`, or `utils`
- do not put domain logic directly inside screens
- do not leak UI state into domain models
- add JSDoc for functions, methods, types, interfaces, and enums when introducing or changing them
- keep JSDoc useful and concise; avoid comments that only paraphrase the code

## Linting rules

- use the hybrid OXC + ESLint toolchain for code quality
- run `pnpm lint` for repo-wide linting; it runs Oxlint first, then ESLint for custom repository rules
- run `pnpm format:check` for formatting checks and `pnpm format` to format with Oxfmt
- keep the Airbnb base ESLint rules as the fallback foundation for rules not covered by Oxlint
- require strict equality with `eqeqeq`
- require consistent curly braces for multi-line control flow
- keep import ordering enabled as a warning, with groups ordered as builtin, external, internal, parent, sibling, index, object, unknown, then type
- keep JSDoc presence enabled as a warning for functions, methods, types, interfaces, and enums
- require JSDoc descriptions, but do not require `@param` or `@returns` tags everywhere
