# Data Flow

## Screen orchestration pattern

Preferred flow:

```txt
screen
  -> RTK Query hook
  -> use-case transformResponse
  -> onQueryStarted hydrates Redux
  -> selector resolves read model
  -> component renders
```

This means:

- screens should not parse raw business payloads deeply
- screens should not reach into adapters directly
- selectors should resolve read models for rendering
- query results may keep ordering or meta data while entities live in Redux

## Screen and component data ownership

Default pattern:

- parent fetch
- child selector

Prefer:

- one fetch in the parent screen when the parent must gate the whole screen
- sections reading simple existing selectors when they own a distinct UI block
- screen feature sections owning queries/selectors/handlers when the resulting data or action is used only inside that section
- shared read models in `core/.../selectors` when several screens or components need the same shaped data
- parent gating loading and error, then placing autonomous sections directly

Avoid:

- drilling raw entity fields through many layers
- passing props through a screen or intermediate component when that component only forwards them
- keeping queries/selectors in a screen only to pass their result to a single screen feature section
- broad raw selectors repeated across many components
- calling the same RTK Query hook again in multiple children after the parent already hydrated the store
- using selectors in UI components as a shortcut for business logic or cross-screen state orchestration
- building screen models only to describe section placement
- creating ids, row models, card models, or callback plumbing only to route presses from screen sections back to the parent

## Ownership rule

If a visual block already has a dedicated component, move its display formatting there.

That includes:

- label formatting
- subtitle formatting
- component-local date or count formatting
- empty-copy selection for that block
- small component-scoped selectors or hooks used only by that block
- local navigation for that block when it is a screen feature section

Presentation formatting includes input masks, localized display values, and parsing required by one interaction flow. Keep it with the owning component or form. Keep validation of the canonical business value in the domain.

Do not move into components:

- domain rules
- gateway logic
- use-case behavior
- shared cross-screen read models
- cross-screen state shaping that belongs in `core/`

## Screen sections vs generic UI

Treat these differently:

- `components/ui/` primitives stay prop-driven and presentational
- screen feature sections may read Redux, call router actions, and keep block-local formatting

Use a section-local approach when:

- the block exists only for one screen or one feature area
- the block would otherwise require a screen model or props drilling
- the block only needs simple existing selectors or local formatting helpers

Create a read model in `core/` only when:

- the shape has stable business meaning
- multiple screens truly share it
- the value is more than visual composition
