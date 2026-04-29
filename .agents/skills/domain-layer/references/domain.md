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

Naming rule:

- if two types share the same business identity and differ only by hydration level or screen usage, prefer one domain entity with the business name
- do not split a domain entity into `XxxListItem` and `XxxDetail` unless they represent a real business distinction
- if a type describes a filter, query, payload, or request shape, it belongs in the API layer before the domain layer
