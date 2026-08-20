# Styling

## Styling system

Default styling mechanism:

- use `className` with NativeWind
- use design tokens such as `bg-background`, `text-foreground`, `bg-card`, `border-border`, and `text-muted-foreground`
- use `classNames()` to compose class names
- for an application-owned component, accept `className` and pass it through to the underlying React Native component
- wrap a third-party native component with NativeWind v5 `styled()` when it does not pass `className` through
- map secondary style props with `styled()`, for example `contentContainerClassName` to `contentContainerStyle`

## Third-party component interop

When `className` does not work, first determine whether the component comes from React Native, application code, or a third-party library:

- React Native components support NativeWind through its import rewrites.
- Application-owned components should accept `className` and pass it to the underlying React Native component.
- Third-party native components that ignore or consume `className` require a local NativeWind v5 `styled()` adapter.

Map every class prop to the style prop expected by the third-party component:

```tsx
import { styled } from "nativewind";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const StyledBottomSheetModal = styled(BottomSheetModal, {
  backgroundClassName: "backgroundStyle",
});

<StyledBottomSheetModal backgroundClassName="rounded-t-full bg-background" />;
```

Do not replace the desired utility classes with `StyleSheet.create()` merely because a third-party component does not support `className`. Keep the styling declarative through the adapter. Reserve `StyleSheet` for values that NativeWind cannot represent correctly, not as an interop mechanism.

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
