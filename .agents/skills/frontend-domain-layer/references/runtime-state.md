# Runtime State

A bounded context may expose a local runtime state module such as:

- a Redux slice
- a Zustand store
- a local reducer
- another state container

Runtime state should:

- define context state shape
- manage runtime updates
- stay aligned with the domain model
- avoid leaking UI-specific temporary state when possible

Global rule:

- a bounded context should own durable product truth
- the UI should own temporary interaction mechanics

Practical test:

- keep state in the bounded context when it must survive the screen, be shared across flows, be persisted, be synced, or drive a real business decision
- keep state in the UI when it exists only while one screen is mounted and only serves local interaction, playback, animation, focus, progress, or view orchestration

Important distinction:

- runtime state is not the domain
- runtime state should reflect the domain

## State conventions

Runtime state should mirror business meaning as much as possible.

Rules:

- do not overstore derived state
- if something can be computed reliably through selectors, do not persist it unnecessarily
- separate domain state from UI state
- do not leak UI state into domain models
- do not create bounded-context use-cases for purely local UI mechanics such as ticking, pausing, stepping, or temporary playback state unless that runtime must be persisted or synchronized outside the screen
- for durable collections keyed by id, prefer normalized `EntityState` with `createEntityAdapter` over parallel `list + map + counters` state
