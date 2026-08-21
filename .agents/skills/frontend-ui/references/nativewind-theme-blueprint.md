# Frozen Blueprint: NativeWind, Theme, Variants, and Interop

> Blueprint version: `1.1.1`

Use this reference for Starter styling infrastructure, theme tokens, typography, shared visual variants, icons, or third-party native components. It freezes the Fifteen-derived design language after translation to shadcn-style React Native composition. Preserve it unless an accepted repository decision explicitly replaces it.

Gluestack is neither a dependency nor an implementation reference after the migration. The visual decisions survive through semantic CSS tokens, local CVA recipes, native primitives, and typed adapters.

## Canonical Owners

```text
app.json                                      # versioned Poppins assets and native vendor plugins
metro.config.js                              # NativeWind, plus isolated Storybook wrapper
public/fonts/
├── OFL.txt
├── Poppins_100Thin.ttf
├── Poppins_300Light.ttf
├── Poppins_400Regular.ttf
├── Poppins_500Medium.ttf
├── Poppins_600SemiBold.ttf
├── Poppins_700Bold.ttf
├── Poppins_800ExtraBold.ttf
└── Poppins_900Black.ttf
src/
├── app/_layout.tsx                          # imports global.css once in the app entry
├── app-runtime/root-app-providers.tsx       # system scheme + navigation theme + toast host
├── components/ui/
│   ├── Button.tsx                           # canonical action/variant/size recipe
│   ├── Icon.tsx                             # Lucide adapter
│   ├── Text.tsx                             # Poppins body/heading scale
│   ├── <Primitive>.tsx                      # local shadcn/RN component
│   └── <VendorWrapper>.tsx                  # typed third-party adapter
├── constants/theme.ts                       # imperative/native mirror
├── global.css                               # Tailwind v4 CSS-first tokens
└── lib/cn.ts                                # clsx + tailwind-merge
```

`src/global.css` is the only palette and utility authority. `src/constants/theme.ts` mirrors only values required by imperative native APIs. A feature, route, story, or adapter does not own a second palette.

## CSS-First Theme Contract

Keep this import order:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";
```

Do not add `tailwind.config.js`. Tailwind v4 configuration stays in `global.css`.

### Semantic roles

Expose every CSS variable through `@theme inline` with the `--color-*` alias consumed by NativeWind:

- neutral surfaces: `background`, `foreground`, `body-foreground`, `canvas`, `card`/`card-foreground`, `popover`/`popover-foreground`, `muted`/`muted-foreground`, `secondary`/`secondary-foreground`, `accent`/`accent-foreground`, `border`, `input`, `ring`;
- structural roles: `border-subtle`, `border-emphasis`, `border-strong`, `divider`, `track`, `control-border`, `control-border-focus`, `control-border-strong`, and `control-subtle`;
- brand actions: `primary`, `tertiary`, and `brand-secondary`;
- status actions: `destructive`, `success`, `warning`, and `info`;
- each colored family has a base, `-soft`, `-border`, and `-foreground` role;
- status families expose `-emphasis` for outlined feedback; destructive additionally exposes `destructive-status-foreground` for soft error surfaces and `destructive-strong` for the strongest error border.
- primary and tertiary expose `-strong` for their darkest/lightest durable emphasis role.

Use exact role names rather than hue names or feature names. For example:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-body-foreground: var(--body-foreground);
  --color-primary: var(--primary);
  --color-primary-soft: var(--primary-soft);
  --color-primary-border: var(--primary-border);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-strong: var(--primary-strong);
  --color-border-emphasis: var(--border-emphasis);
  --color-border-strong: var(--border-strong);
  --color-border-subtle: var(--border-subtle);
  --color-control-border: var(--control-border);
  --color-control-border-focus: var(--control-border-focus);
  --color-control-border-strong: var(--control-border-strong);
  --color-control-subtle: var(--control-subtle);
  --color-destructive-emphasis: var(--destructive-emphasis);
  --color-destructive-status-foreground: var(--destructive-status-foreground);
  --color-destructive-strong: var(--destructive-strong);
  --color-divider: var(--divider);
  --color-info-emphasis: var(--info-emphasis);
  --color-success: var(--success);
  --color-success-soft: var(--success-soft);
  --color-success-border: var(--success-border);
  --color-success-emphasis: var(--success-emphasis);
  --color-success-foreground: var(--success-foreground);
  --color-track: var(--track);
  --color-warning-emphasis: var(--warning-emphasis);
  --color-tertiary-strong: var(--tertiary-strong);
  /* expose every remaining role by the same exact mapping */

  --font-body: Poppins;
  --font-heading: Poppins;
  --leading-heading: 1;
  --tracking-heading: 0.0125rem;

  --radius-base: var(--radius);
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  --spacing-screen: 1.5rem;
}
```

The screen spacing contract is 24 points. Screen chrome and page framing use `px-screen`; local component padding still uses the nearest named spacing utility.

### Canonical light and dark palette

The following values define the initial Starter theme. Changing them is a product/design decision, not an incidental component edit.

| Role family                                       | Light                                         | Dark                                          |
| ------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| background / foreground                           | `#ffffff` / `#171717`                         | `#121212` / `#f5f5f5`                         |
| body foreground                                   | `#525252`                                     | `#d4d4d4`                                     |
| canvas                                            | `#f6f6f6`                                     | `#181719`                                     |
| card / card foreground                            | `#ffffff` / `#171717`                         | `#272625` / `#f5f5f5`                         |
| popover / popover foreground                      | `#ffffff` / `#171717`                         | `#272625` / `#f5f5f5`                         |
| muted / muted foreground                          | `#f2f1f1` / `#737373`                         | `#414040` / `#d4d4d4`                         |
| border / input                                    | `#dddcdb` / `#dcdbdb`                         | `#535252` / `#535252`                         |
| border subtle / emphasis / strong                 | `#d3d3d3` / `#535252` / `#272624`             | `#414040` / `#a3a3a3` / `#e5e5e5`             |
| control border / focus / strong / subtle          | `#8c8d8d` / `#272624` / `#737474` / `#d5d4d4` | `#737474` / `#e5e5e5` / `#a3a3a3` / `#414040` |
| divider / track                                   | `#414141` / `#dcdbdb`                         | `#dbdbdc` / `#535252`                         |
| primary base / soft / border / foreground         | `#234b7e` / `#d4eaf8` / `#7aacd8` / `#ffffff` | `#7aacd8` / `#112b5a` / `#234b7e` / `#06143c` |
| tertiary base / soft / border / foreground        | `#e78128` / `#ffe9d5` / `#fdb474` / `#272625` | `#fdb474` / `#6c3d13` / `#e78128` / `#272625` |
| brand-secondary base / soft / border / foreground | `#7e234b` / `#f8d4d6` / `#d87a91` / `#3c0633` | `#d87a91` / `#3c0633` / `#7e234b` / `#f8d4d6` |
| destructive base / soft / border / foreground     | `#ff2d3f` / `#ffe0d5` / `#ff8d81` / `#ffffff` | `#ff8d81` / `#7a083b` / `#b71641` / `#7a083b` |
| success base / soft / border / foreground         | `#0b7a2e` / `#cef8cb` / `#61d76f` / `#023a2a` | `#61d76f` / `#023a2a` / `#0b7a2e` / `#cef8cb` |
| warning base / soft / border / foreground         | `#ff6c2d` / `#ffecd5` / `#ffb781` / `#7a0c08` | `#ffb781` / `#7a0c08` / `#ff6c2d` / `#ffecd5` |
| info base / soft / border / foreground            | `#1c5fef` / `#d1e5fe` / `#75a8fa` / `#051972` | `#75a8fa` / `#051972` / `#1c5fef` / `#d1e5fe` |

Keep `accent` aligned with the primary soft/emphasis relationship, `ring` with the primary border, and ordinary `secondary` with the neutral muted surface. Emphasis roles are:

- light: `primary-emphasis #112b5a`, `tertiary-emphasis #b4621a`, `destructive-emphasis #b71641`, `success-emphasis #05572f`, `warning-emphasis #b73116`, and `info-emphasis #0e35ac`;
- dark: `primary-emphasis #d4eaf8`, `tertiary-emphasis #ffe9d5`, `destructive-emphasis #ff8d81`, `success-emphasis #61d76f`, `warning-emphasis #ffb781`, and `info-emphasis #75a8fa`.

Destructive feedback also freezes `destructive-status-foreground` as `#7a083b` in light and `#ffe0d5` in dark, and `destructive-strong` as `#7a083b` in light and `#ff8d81` in dark.

Brand strong roles are `primary-strong #06143c` and `tertiary-strong #6c3d13` in light, then `primary-strong #d4eaf8` and `tertiary-strong #ffe9d5` in dark.

Outlined status feedback uses the action's emphasis role on `bg-background`. Softly filled `solid` feedback uses the action's soft surface and status foreground; filled errors use `destructive-status-foreground`. Solid buttons pair the base with the purpose-built button foreground. Never assume one foreground role works on every treatment; use the role frozen for that visual contract.

Light values live in `:root`. Automatic dark values override them under `@media (prefers-color-scheme: dark) { :root:not([data-color-scheme]) { ... } }`. Repeat the same dark palette under `:root[data-color-scheme="dark"]` so Storybook web can force dark; `data-color-scheme="light"` keeps the root light palette even when the operating system is dark.

## Typography

Poppins is the body and heading family. Version the eight TTF assets under `public/fonts`; do not make CSS depend on a `node_modules` URL, because Metro web export does not copy that local resource reliably. Configure the Expo font plugin with the same `./public/fonts/...` files for weights 100, 300, 400, 500, 600, 700, 800, and 900 on Android and iOS. `global.css` owns eight matching `@font-face` declarations, and both app `_layout.tsx` and Storybook `preview.tsx` import that CSS.

| Weight | Versioned asset                         |
| ------ | --------------------------------------- |
| 100    | `public/fonts/Poppins_100Thin.ttf`      |
| 300    | `public/fonts/Poppins_300Light.ttf`     |
| 400    | `public/fonts/Poppins_400Regular.ttf`   |
| 500    | `public/fonts/Poppins_500Medium.ttf`    |
| 600    | `public/fonts/Poppins_600SemiBold.ttf`  |
| 700    | `public/fonts/Poppins_700Bold.ttf`      |
| 800    | `public/fonts/Poppins_800ExtraBold.ttf` |
| 900    | `public/fonts/Poppins_900Black.ttf`     |

Each declaration uses the `Poppins` family, normal style, `font-display: swap`, its numeric weight, and an absolute public URL such as `url('/fonts/Poppins_400Regular.ttf') format('truetype')`. Keep these declarations in `global.css`; do not duplicate them in Storybook or a screen. Keep the font license beside the versioned assets.

`Text.tsx` owns the finite type variants, heading roles, and `TextClassContext` used by compound controls. Its base copy uses `text-body-foreground`; headings and explicit high-emphasis copy use their semantic foreground roles. Named `h1` through `h4` variants derive their matching role/level automatically; the visual `heading` variant gains semantics only through `headingLevel="1" | ... | "6"`, which derives role and level together. Application code uses `font-body` or `font-heading`, never platform default family names or raw `fontFamily` values. Headings use `leading-heading` and `tracking-heading`; text must still scale and wrap.

Do not load fonts independently in screens, stories, or primitives. The shared CSS import is the web/Storybook font boundary, so stories never silently fall back to a system font.

## Imperative Theme Mirror

`THEME` mirrors only the CSS values required by navigation and vendor props. Keep `Colors` compatibility aliases synchronized, and resolve nullable appearance once:

```ts
import type { ColorSchemeName } from "react-native";

export type AppColorScheme = "dark" | "light";

export function resolveAppColorScheme(
  colorScheme: ColorSchemeName,
): AppColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}
```

The navigation provider uses:

```tsx
const colorScheme = resolveAppColorScheme(useColorScheme());

<ThemeProvider value={NAV_THEME[colorScheme]}>{children}</ThemeProvider>;
```

`NAV_THEME` maps navigation background, border, card, notification, primary, and text to the corresponding `THEME` roles. Never hard-code a navigation, toast, sheet, camera overlay, or vendor input color.

## Class Composition

Keep the shared helper:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges conditional classes and resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Owned components accept `className` and place it after base/CVA/state classes through `cn` so callers can resolve ordinary utility conflicts. CVA owns only finite product variants and sizes.

## Canonical Button Matrix

`Button` keeps shadcn composition—`Pressable`, `TextClassContext`, explicit compound children, and CVA—while expressing Fifteen's visual contract.

Actions:

- `primary`: primary base/foreground for solid, primary border/base text for outline/link;
- `tertiary`: tertiary base/foreground for solid, tertiary border/emphasis for outline/link;
- `negative`: destructive base/foreground for solid, destructive border/base text for outline/link.

Sizes:

| Size             | Height    | Horizontal padding |
| ---------------- | --------- | ------------------ |
| `xs`             | 32        | 14 (`px-3.5`)      |
| `sm`             | 36        | 16 (`px-4`)        |
| `default` / `md` | 40        | 20 (`px-5`)        |
| `lg`             | 44        | 24 (`px-6`)        |
| `xl`             | 48        | 28 (`px-7`)        |
| `icon`           | 40 square | 0                  |

The core action variants are `solid`, `outline`, and `link`; outline uses a two-point border. Preserve existing shadcn compatibility variants such as `default`, `destructive`, `secondary`, and `ghost` when callers use them. Historical aliases may normalize into the canonical variants, but do not expose a Gluestack recipe or `tva` surface.

All button actions are pill-shaped with `rounded-full`. Text sizes progress from `text-xs` through `text-xl`; icon sizes are 14, 16, 18, 20, and 24 points for `xs`, `sm`, `md`/default, `lg`, and `xl` respectively, while icon-only buttons use 20. Compound exports may include text, icon, spinner, and group helpers. Busy/disabled semantics remain native, and decorative child icons do not duplicate the accessible name.

## Focused Native Primitives

Use the installed `@rn-primitives` 1.5.2 family for native state and interaction:

- `@rn-primitives/checkbox`;
- `@rn-primitives/label`;
- `@rn-primitives/progress`;
- `@rn-primitives/radio-group`;
- `@rn-primitives/switch`;
- compatible `@rn-primitives/slot` for as-child composition.

Local components own design tokens, sizes, indicators, form-control integration, and accessibility details. Checkbox, radio items, progress, and switches require localized `accessibilityLabel` values; switch also requires a localized `valueLabel`. Checkbox remains standalone and exports its finite label-size recipe for caller-owned visible copy rather than adopting a Gluestack compound label. Do not reimplement checked, indeterminate, roving selection, thumb, or progress state machines with generic `Pressable` views. Inspect installed public types before composing; React Native Reusables conventions inform the shape but installed packages define the actual API.

## Typed Third-Party Interop

Use NativeWind v5 `styled()` only when a third-party native component does not forward `className`. Map only verified style props.

### Camera and safe area

```tsx
const CameraView = styled(ExpoCameraView, {
  className: "style",
});

const SafeAreaView = styled(NativeSafeAreaView, {
  className: "style",
});
```

These are shared, typed adapters in `src/components/ui/CameraView.tsx` and `SafeAreaView.tsx`. Preserve vendor refs and supported props without widening to `any`.

### Phone number input

`PhoneNumberInput` wraps `rn-international-phone-number` as a controlled component. It may use imperative style objects because the vendor requires them, but every color comes from `THEME[useTheme().dark ? "dark" : "light"]`. The wrapper owns formatting/vendor normalization; the feature form owns validation, copy, submission, and business rules.

### Other vendors

```tsx
const StyledVendor = styled(TypedVendorAdapter, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
```

Name each supported target explicitly. Do not wrap application-owned components with `styled()`; fix their `className` forwarding instead. Do not use `StyleSheet.create()` as a NativeWind bridge.

## Icon Paint Channels

Keep the Starter Lucide adapter narrow: map CSS height and width to Lucide's `size` through the `style` target. Do not add speculative color/fill/stroke mappings. The owning primitive provides its semantic text class, and the inspected Lucide surface consumes it through the existing adapter.

For another icon library, inspect its installed types and implementation. Reproduce only verified component-specific paint channels; never copy a generic icon mapping across libraries.

## Toast and Overlay Styling

`Toast.tsx` owns `toastConfig` and the imperative `useToast` surface. Toast actions are `error`, `info`, `muted`, `success`, and `warning`; surfaces use the corresponding semantic soft/border/foreground roles and the shared `rounded-2xl`/shadow language.

Mount exactly one host in the application provider tree and one in the isolated Storybook provider tree. Bottom-sheet backgrounds, handles, and other imperative overlay props resolve from `THEME` through `useTheme()`, which consumes the shared `NAV_THEME` provider. Presentation components use NativeWind utilities for owned inner views.

## Storybook Theme Bridge

Storybook imports `global.css` because Expo Router's app entry is bypassed. Its background toolbar maps light/dark choices to `NAV_THEME`, while background values come from `THEME`. Imperative components read that provider with `useTheme()`. On native, also apply the selection through `Appearance.setColorScheme` and restore the previous value or `"unspecified"` so NativeWind follows it. React Native Web does not implement that setter: set and restore `data-color-scheme` on `document.documentElement` instead.

Do not invent a Storybook-only palette or stylesheet. See [storybook-blueprint.md](storybook-blueprint.md).

## Invariants

- NativeWind v5 utilities are the default for owned React Native UI.
- Tailwind v4 semantic tokens live only in `global.css`.
- The Fifteen-derived palette is expressed as role tokens, not raw component colors.
- Poppins, the radius scale, and 24-point screen spacing are shared foundations.
- Every colored family provides the surface/border/foreground roles its variants consume in light and dark.
- Automatic dark applies only without an explicit root data attribute; Storybook web light/dark uses `data-color-scheme` and native uses `Appearance`.
- `THEME`, `Colors`, and `NAV_THEME` mirror only imperative CSS roles and stay synchronized.
- Existing local shadcn-style primitives and CVA recipes are extended before another component system is introduced.
- `@rn-primitives` owns interactive state; local wrappers own the visual contract.
- Typed `styled()` adapters remain local to incompatible vendors and map exact verified props.

## Anti-Patterns

- Adding Gluestack, `tva`, a Gluestack provider, or copied Gluestack token scales.
- Adding Tailwind v3 configuration, a parallel JavaScript palette, or story-only theme values.
- Raw colors or repeated arbitrary radii/type/spacing values in routes, feature components, stories, or owned primitives.
- Treating `primary` as a generic status color instead of using destructive/success/warning/info roles.
- Using one foreground token indiscriminately on both solid and soft surfaces without contrast review.
- Hand-building conflicting class strings instead of `cn` and CVA.
- Wrapping owned components with `styled()`, guessing a vendor target, or exposing an untyped vendor surface.
- Reimplementing focused native control behavior with generic views.
- Loading Poppins independently per screen or falling back silently to another design-system font.

## Validation Checklist

- [ ] `global.css` keeps import order, `@theme inline` aliases, light root values, guarded automatic dark overrides, and the identical explicit dark selector.
- [ ] Each new role has light/dark values and the required soft/border/foreground counterparts.
- [ ] Every imperatively consumed value is synchronized in `THEME` and applicable compatibility/navigation exports.
- [ ] Poppins weights are registered through Expo and typography uses `font-body`/`font-heading`.
- [ ] A Storybook-enabled web export contains all eight files under its `fonts` assets and reports no unresolved/local-resource CSS warning.
- [ ] Screen framing uses `px-screen` and reusable components use the shared radius scale.
- [ ] Button actions, variants, sizes, text/icon colors, disabled, and busy states remain coherent.
- [ ] Focused controls compose installed `@rn-primitives` packages rather than recreating state.
- [ ] Owned components forward `className`; vendor adapters are typed and map verified props.
- [ ] Light/dark surfaces, status contrast, navigation, overlays, Storybook backgrounds, and imperative vendor props were reviewed.
- [ ] Typecheck, relevant lint, targeted Oxfmt, and changed Storybook stories pass.

## Independent Forward Validation

When this blueprint changes, run an isolated generation scenario from a realistic UI request and this skill. Do not give the evaluator the current app implementation, an intended diff, or textual expectations. Evaluate semantic-token reuse, light/dark behavior, Poppins/radius/spacing foundations, local CVA ownership, focused native primitives, typed interop, accessibility, and story coverage. For font/theme infrastructure, require a web export containing all eight versioned Poppins assets with no unresolved/local-resource CSS warning, verify explicit web light/dark through the restored root data attribute, and verify native appearance restoration separately. Make only corrections supported by observable gaps.
