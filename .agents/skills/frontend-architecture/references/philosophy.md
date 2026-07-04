# Philosophy

Treat the frontend as a real business application, not as a thin visual wrapper.

Optimize first for:

- clarity
- consistency
- predictability
- discoverability
- business meaning

Do not optimize first for cleverness or shortness.

## Core principle

The UI is temporary. The domain is the long-term asset.

That means:

- model business concepts explicitly
- keep domain logic out of screens
- let the UI consume the domain instead of defining it
- let state reflect business intent, not component structure

Another useful framing:

- the bounded context owns durable product truth
- the UI owns temporary interaction mechanics

Use this test when deciding where state or actions belong:

- if it must survive the screen, be shared across flows, be persisted, be synced, or influence a real product decision, it can belong in the bounded context
- if it only exists to make one screen interaction work while that screen is mounted, it should stay in the UI

## Architectural style

The repository follows a frontend-first architecture inspired by:

- Clean Architecture
- Domain-Driven Design
- bounded contexts
- feature-first organization

This should support:

- strong domain modeling
- explicit business actions
- interchangeable data sources
- scalable growth over time
- maintainable UI boundaries
- easy migration to real APIs or local persistence later
