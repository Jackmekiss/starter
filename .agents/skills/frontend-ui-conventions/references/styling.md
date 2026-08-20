# Styling

## Styling system

Default styling mechanism:

- use `className` with NativeWind
- use design tokens such as `bg-background`, `text-foreground`, `bg-card`, `border-border`, and `text-muted-foreground`
- use `classNames()` to compose class names
- for an application-owned component, accept `className` and pass it through to the underlying React Native component
- wrap a third-party native component with NativeWind v5 `styled()` when it does not pass `className` through
- map secondary style props with `styled()`, for example `contentContainerClassName` to `contentContainerStyle`

Do not replace a desired NativeWind utility with `StyleSheet.create()` merely because the target is a third-party component. Keep styling declarative through a local `styled()` adapter. Reserve `StyleSheet` for values that cannot be represented correctly by NativeWind.

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

- the Tailwind v4 `@theme` block in `global.css`
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

## Icon colors

Match the NativeWind color utility to the SVG paint channel:

- use `fill-*` for fill-based icons, including default icons produced by `createIcon`
- use `stroke-*` for stroke-based icons
- do not use `text-*` to color `Icon` or `ButtonIcon`

`ButtonIcon` inherits its size from the parent `Button`. Do not add manual `h-*` or `w-*` utilities when the button size already provides the intended icon size.
