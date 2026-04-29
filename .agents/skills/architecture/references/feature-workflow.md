# Feature Workflow

## Recommended order

When adding a feature, follow this order:

1. Model the domain.
2. Define the use-case.
3. Define or extend the gateway.
4. Implement an adapter.
5. Expose the capability through the context API.
6. Consume it in the UI.
7. Extract reusable UI pieces if needed.

Critical rule: do not start from the screen and improvise the architecture afterward.

Rule of thumb: start from business meaning, end in presentation.

## Architectural boundaries

### UI layer

`app/` and `components/` are responsible for:

- rendering
- navigation
- user interaction
- lightweight orchestration

### Business layer

`core/` is responsible for:

- domain modeling
- business actions
- data access contracts
- state rules
- context boundaries

### Infrastructure layer

Adapters are responsible for:

- concrete data retrieval or persistence
- implementation details
- backend replacement strategy

## Placement checks

Before writing code, ask:

- Is this a business concept or a screen concern?
- Is this action important enough to deserve a use-case?
- Should the UI know this directly, or should a context API expose it?
- Am I modeling what the app means, or just what the screen needs today?
