# Domain

The `domain/` folder contains the core business model.

Typical contents:

- entities
- domain types
- enums or unions
- state contracts
- domain-specific interfaces

The domain layer should:

- describe business concepts clearly
- own canonical representations and intrinsic business invariants
- remain independent from UI
- remain independent from storage
- be stable and expressive
- act as the conceptual source of truth
- name entities after the business concept itself, not after a screen shape or rendering variant

Avoid putting these concerns in the domain layer:

- UI concerns
- navigation concerns
- storage implementation details
- networking concerns
- rendering assumptions
- modal state
- selected tab index
- screen-specific booleans
- local view toggles
- entity names that describe UI consumption shapes such as `XxxListItem`, `XxxCard`, or `XxxDetail` when they all represent the same business object
- query filters, request payloads, or retrieve params that describe how data is asked for rather than what the business object is

Rule of thumb: `domain/` defines what the application is.

## Behavior ownership

A domain file is not a container for every function that manipulates the same business concept.

Keep behavior in the domain only when it expresses durable product truth or an intrinsic invariant. Move flow-specific comparisons and update selection to a use-case, infrastructure representation mapping to an adapter, and presentation formatting to the owning UI.

Split these responsibilities even when they operate on the same domain type.

Naming rule:

- if two types share the same business identity and differ only by hydration level or screen usage, prefer one domain entity with the business name
- do not split a domain entity into `XxxListItem` and `XxxDetail` unless they represent a real business distinction
- if a type describes a filter, query, payload, or request shape, it belongs in the API layer before the domain layer
