# Styling

## Styling system

Default styling mechanism:

- use `className` with NativeWind
- use design tokens such as `bg-background`, `text-foreground`, `bg-card`, `border-border`, and `text-muted-foreground`
- use `classNames()` to compose class names
- use `cssInterop` when a third-party component does not support `className`

Prefer:

- theme tokens
- named Tailwind scales
- config-backed utilities

Avoid inside shared primitives:

- arbitrary `text-[...]`
- arbitrary `leading-[...]`
- arbitrary `tracking-[...]`
- arbitrary `rounded-[...]`
- arbitrary `w-[...]` or `h-[...]`
- arbitrary `bg-[...]`

If a value matters enough to repeat, promote it into:

- `tailwind.config.js`
- `global.css`
- a named utility or token

## UI primitives

The reusable UI base should come from `components/ui/` before creating screen-local alternatives.

Prefer composing primitives such as:

- `Text`
- `Button`
- `Input`
- `Icon`
- `Header`

Do not recreate typography, button, or input systems inside screens.
