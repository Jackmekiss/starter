# Review Checklist

Before validating a feature, ask:

- Is the domain naming clear?
- Is the business action modeled as a use-case?
- Is the screen still thin?
- Is data access abstracted behind a gateway?
- Is the implementation placed in the right bounded context?
- Is any code too generic or ambiguous?
- Is UI logic leaking into the domain?
- Is domain logic leaking into the UI?

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
