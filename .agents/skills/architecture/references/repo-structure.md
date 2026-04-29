# Repository Structure

The repository is organized around three main areas:

- `app/`
- `components/`
- `core/`

## `app/`

The presentation entrypoint.

Use it for:

- routes
- screens
- navigation layout
- screen-level orchestration

Screens should:

- define navigation and route structure
- request data through APIs or use-cases
- render UI components
- trigger user actions
- remain thin and readable
- gate loading and error before placing screen sections

Screens should avoid:

- deep business logic
- domain calculations
- direct data source access
- complex state shaping
- domain mutations outside use-cases
- screen-level render models that exist only to describe visual section placement

Rule of thumb: `app/` should orchestrate, not decide.

## `components/`

Reusable UI building blocks and screen feature sections.

Use it for:

- cards
- lists
- panels
- form controls
- feature-specific presentational blocks
- screen sections that belong to one feature and one UI flow

Components should be:

- presentation-focused
- composable
- reusable across screens
- as domain-agnostic as reasonably possible

Screen feature sections may also be:

- locally autonomous for navigation
- connected to simple selectors already exposed by the relevant bounded context
- responsible for block-local formatting and empty states

Rule of thumb: `components/` should render and compose UI, but not own business rules.

## `core/`

The actual business architecture and domain logic.

Each bounded context should live in its own folder under `core/`.

Each bounded context owns:

- its domain entities
- its use-cases
- its data access contracts
- its implementations
- its selectors or read models
- its API facade

Prefer bounded contexts over generic buckets such as `helpers`, `misc`, or global business folders.
