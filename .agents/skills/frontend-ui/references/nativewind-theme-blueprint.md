# Frozen Blueprint: NativeWind, Theme, Variants, and Interop

> Blueprint version: `1.0.0`

Use this reference when changing styling infrastructure, theme tokens, shared visual primitives, CVA variants, icons, or third-party native components. This is the canonical Starter shape for React Native, NativeWind v5, and Tailwind CSS v4. Preserve it unless an accepted repository decision explicitly replaces it.

Accepted, non-superseded repository decisions remain normative. If generated code conflicts with an accepted decision, correct the generated code; do not rewrite this blueprint around incidental implementation output.

## Placeholder Contract

Angle-bracket names are deliberate placeholders:

- **<semantic-token>**: a product-level visual role such as warning, success, or scrim; never a raw feature color.
- **<Primitive>**: a shared primitive's PascalCase component and filename stem.
- **<ThirdPartyComponent>** and **<exact-native-style-prop>**: a vendor component and the precise prop it consumes.
- **<variant>** and **<size>**: a finite CVA option backed by named utilities.

Replace every placeholder, delete unused branches, and preserve the surrounding ownership and data flow. No placeholder may remain in application source.

## Canonical Tree and Ownership

```text
src/
├── app/
│   └── _layout.tsx                         [required] imports global.css exactly once
├── app-runtime/
│   └── root-app-providers.tsx              [required] selects NAV_THEME from useColorScheme
├── components/
│   └── ui/
│       ├── Button.tsx                      [required baseline] owns button CVA and base role
│       ├── Icon.tsx                        [required baseline] owns Lucide prop mapping
│       ├── Input.tsx                       [required baseline] owns control visuals
│       ├── Text.tsx                        [required baseline] owns typography variants
│       ├── <Primitive>.tsx                 [conditional] only for a reusable missing primitive
│       └── <VendorWrapper>.tsx             [conditional] shared third-party interop wrapper
├── constants/
│   └── theme.ts                            [required] imperative colors and NAV_THEME mirror
├── global.css                              [required] CSS-first tokens and utilities
└── lib/
    └── cn.ts                               [required] conditional class merge helper
```

Feature components under **src/components/<context>/** may select primitive variants and arrange layout. They do not own a second token palette, typography system, or button/input implementation. A one-use typed vendor adapter may remain beside its route or feature; a reused adapter belongs in **src/components/ui/**.

Do not add **tailwind.config.js** for theme values. Tailwind v4 configuration is CSS-first in **src/global.css**.

## Required Theme Skeleton

### src/global.css

Keep the import order, semantic aliases, root values, and dark override shape. Add a token only when it represents a reusable semantic decision, then mirror any value needed by imperative native APIs in **src/constants/theme.ts**.

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

@theme inline {
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-background: var(--background);
  --color-border: var(--border);
  --color-canvas: var(--canvas);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-foreground: var(--foreground);
  --color-input: var(--input);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-ring: var(--ring);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --radius-base: var(--radius);
  --radius-lg: var(--radius);
  --radius-md: var(--radius);
  --radius-sm: var(--radius);
  --spacing-screen: 1rem;
}

@utility border-hairline {
  border-width: hairlineWidth();
}

:root {
  --accent: hsl(0 0% 97%);
  --accent-foreground: hsl(0 0% 20.5%);
  --background: hsl(0 0% 100%);
  --border: hsl(0 0% 92.2%);
  --canvas: hsl(0 0% 97%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(0 0% 14.5%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98.5%);
  --foreground: hsl(0 0% 14.5%);
  --input: hsl(0 0% 92.2%);
  --muted: hsl(0 0% 97%);
  --muted-foreground: hsl(0 0% 55.6%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 14.5%);
  --primary: hsl(0 0% 20.5%);
  --primary-foreground: hsl(0 0% 98.5%);
  --radius: 0.625rem;
  --ring: hsl(0 0% 70.8%);
  --secondary: hsl(0 0% 97%);
  --secondary-foreground: hsl(0 0% 20.5%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --accent: hsl(0 0% 26.9%);
    --accent-foreground: hsl(0 0% 98.5%);
    --background: hsl(0 0% 20.5%);
    --border: hsl(0 0% 26.9%);
    --canvas: hsl(0 0% 14.5%);
    --card: hsl(0 0% 14.5%);
    --card-foreground: hsl(0 0% 98.5%);
    --destructive: hsl(0 62.8% 50.6%);
    --destructive-foreground: hsl(0 0% 98.5%);
    --foreground: hsl(0 0% 98.5%);
    --input: hsl(0 0% 26.9%);
    --muted: hsl(0 0% 26.9%);
    --muted-foreground: hsl(0 0% 70.8%);
    --popover: hsl(0 0% 14.5%);
    --popover-foreground: hsl(0 0% 98.5%);
    --primary: hsl(0 0% 98.5%);
    --primary-foreground: hsl(0 0% 20.5%);
    --ring: hsl(0 0% 55.6%);
    --secondary: hsl(0 0% 26.9%);
    --secondary-foreground: hsl(0 0% 98.5%);
  }
}
```

The **@theme inline** aliases are semantic utility contracts: **bg-background**, **text-foreground**, **border-border**, **text-muted-foreground**, and similar classes resolve through the active root variables. Keep paired foreground tokens for surfaces that display content.

### src/constants/theme.ts

Native navigation and third-party APIs that require concrete values cannot consume CSS utilities. Mirror only that imperative surface here. Keep names and values synchronized with **src/global.css**.

```ts
import { DarkTheme, DefaultTheme } from "expo-router/react-navigation";

import type { ColorSchemeName } from "react-native";

/** Color schemes supported by the Starter design tokens. */
export type AppColorScheme = "dark" | "light";

/** Resolves nullable or unspecified system appearance to a supported scheme. */
export function resolveAppColorScheme(
  colorScheme: ColorSchemeName,
): AppColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}

const tintColorLight = "hsl(0 0% 20.5%)";
const tintColorDark = "hsl(0 0% 98.5%)";

export const Colors = {
  light: {
    text: "hsl(0 0% 14.5%)",
    background: "hsl(0 0% 100%)",
    canvas: "hsl(0 0% 97%)",
    card: "hsl(0 0% 100%)",
    tint: tintColorLight,
    icon: "hsl(0 0% 55.6%)",
    tabIconDefault: "hsl(0 0% 55.6%)",
    tabIconSelected: tintColorLight,
    accent: "hsl(0 0% 97%)",
    border: "hsl(0 0% 92.2%)",
  },
  dark: {
    text: "hsl(0 0% 98.5%)",
    background: "hsl(0 0% 20.5%)",
    canvas: "hsl(0 0% 14.5%)",
    card: "hsl(0 0% 14.5%)",
    tint: tintColorDark,
    icon: "hsl(0 0% 70.8%)",
    tabIconDefault: "hsl(0 0% 55.6%)",
    tabIconSelected: tintColorDark,
    accent: "hsl(0 0% 26.9%)",
    border: "hsl(0 0% 26.9%)",
  },
};

export const THEME = {
  light: {
    canvas: "hsl(0 0% 97%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 14.5%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(0 0% 14.5%)",
    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(0 0% 14.5%)",
    primary: "hsl(0 0% 20.5%)",
    primaryForeground: "hsl(0 0% 98.5%)",
    secondary: "hsl(0 0% 97%)",
    secondaryForeground: "hsl(0 0% 20.5%)",
    muted: "hsl(0 0% 97%)",
    mutedForeground: "hsl(0 0% 55.6%)",
    accent: "hsl(0 0% 97%)",
    accentForeground: "hsl(0 0% 20.5%)",
    destructive: "hsl(0 84.2% 60.2%)",
    border: "hsl(0 0% 92.2%)",
    input: "hsl(0 0% 92.2%)",
    ring: "hsl(0 0% 70.8%)",
    radius: "0.625rem",
  },
  dark: {
    canvas: "hsl(0 0% 14.5%)",
    background: "hsl(0 0% 20.5%)",
    foreground: "hsl(0 0% 98.5%)",
    card: "hsl(0 0% 14.5%)",
    cardForeground: "hsl(0 0% 98.5%)",
    popover: "hsl(0 0% 14.5%)",
    popoverForeground: "hsl(0 0% 98.5%)",
    primary: "hsl(0 0% 98.5%)",
    primaryForeground: "hsl(0 0% 20.5%)",
    secondary: "hsl(0 0% 26.9%)",
    secondaryForeground: "hsl(0 0% 98.5%)",
    muted: "hsl(0 0% 26.9%)",
    mutedForeground: "hsl(0 0% 70.8%)",
    accent: "hsl(0 0% 26.9%)",
    accentForeground: "hsl(0 0% 98.5%)",
    destructive: "hsl(0 62.8% 50.6%)",
    border: "hsl(0 0% 26.9%)",
    input: "hsl(0 0% 26.9%)",
    ring: "hsl(0 0% 55.6%)",
    radius: "0.625rem",
  },
};

export const NAV_THEME: Record<AppColorScheme, typeof DefaultTheme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
```

`Colors` is part of the current complete Starter file for specialized compatibility aliases. Do not introduce another palette: keep every member synchronized with `THEME`, and prefer `THEME[colorScheme]` for new imperative integrations.

### Root wiring

**src/app/\_layout.tsx** imports CSS once, before application components:

```tsx
import "@/global.css";
```

**src/app-runtime/root-app-providers.tsx** owns the system-scheme bridge. Keep the current provider order; this is the relevant fragment:

```tsx
import { ThemeProvider } from "expo-router/react-navigation";
import { useColorScheme } from "react-native";

import { NAV_THEME, resolveAppColorScheme } from "@/constants/theme";

const colorScheme = resolveAppColorScheme(useColorScheme());

<ThemeProvider value={NAV_THEME[colorScheme]}>{children}</ThemeProvider>;
```

Use this same resolved key for imperative colors:

```tsx
const colorScheme = resolveAppColorScheme(useColorScheme());
const theme = THEME[colorScheme];

<ThirdPartyComponent backgroundStyle={{ backgroundColor: theme.background }} />;
```

The final inline object is acceptable because the vendor requires an imperative style prop. It is not a substitute for styling application-owned React Native views with NativeWind.

## Class Composition and CVA

### src/lib/cn.ts

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Use **cn** for base classes, conditional states, platform additions, CVA output, and caller overrides. Forward **className** last so the caller can intentionally resolve ordinary Tailwind conflicts.

### Local primitive skeleton

Keep finite visual choices in CVA and interaction semantics on the underlying React Native control:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable } from "react-native";

import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

const controlVariants = cva(
  "flex-row items-center justify-center rounded-md border",
  {
    variants: {
      size: {
        default: "h-10 px-4",
        icon: "h-10 w-10",
        sm: "h-9 px-3",
      },
      variant: {
        default: "border-primary bg-primary",
        outline: "border-border bg-background",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

/** Props supported by the shared control primitive. */
type ControlProps = ComponentProps<typeof Pressable> &
  VariantProps<typeof controlVariants>;

/** Pressable control primitive with shared visual variants. */
export function Control({
  className,
  disabled,
  size,
  variant,
  ...props
}: ControlProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        controlVariants({ size, variant }),
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
```

Extend an existing local primitive before making a screen-local variant system. Parent layout owns external spacing; a reusable primitive owns only its internal layout and visual states.

## Typed Third-Party Interop

Use NativeWind v5 **styled()** only when a third-party native component does not forward class props. First create a narrow typed adapter that exposes exactly the supported native props, then map each class prop to the exact style prop expected by the vendor.

```tsx
import { styled } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import type { ScrollViewProps } from "react-native";

/** Minimal surface exposed by the local NativeWind adapter. */
type KeyboardAwareScrollViewAdapterProps = Pick<
  ScrollViewProps,
  | "children"
  | "contentContainerStyle"
  | "keyboardDismissMode"
  | "keyboardShouldPersistTaps"
  | "showsVerticalScrollIndicator"
  | "style"
> & {
  bottomOffset?: number;
};

/** Forwards supported scroll props to the third-party keyboard-aware view. */
function KeyboardAwareScrollViewAdapter(
  props: KeyboardAwareScrollViewAdapterProps,
) {
  return <KeyboardAwareScrollView {...props} />;
}

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollViewAdapter, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
```

A vendor-specific secondary target remains explicit:

```tsx
const StyledBottomSheetModal = styled(BottomSheetModalComponent, {
  backgroundClassName: "backgroundStyle",
});
```

Do not use **styled()** around application-owned components merely to avoid forwarding **className**. Fix the owned component. Do not use **StyleSheet.create()** as a className bridge.

## Icon Paint Channels

Freeze the current Starter Lucide wrapper exactly: NativeWind targets **style** and maps only CSS height and width to Lucide's **size** prop. It does not add an explicit paint-property mapping.

```tsx
import { styled } from "nativewind";

import { cn } from "@/lib/cn";

import type { LucideIcon, LucideProps } from "lucide-react-native";

/**
 * Props accepted by the shared Lucide icon wrapper.
 */
type IconProps = LucideProps & {
  as: LucideIcon;
};

/** NativeWind interop target that forwards class styles to Lucide props. */
function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = styled(IconImpl, {
  className: {
    target: "style",
    nativeStyleMapping: {
      height: "size",
      width: "size",
    },
  },
});

/**
 * Themed icon primitive used by buttons, tabs, and compact controls.
 */
function Icon({
  as: IconComponent,
  className,
  size = 14,
  ...props
}: IconProps) {
  return (
    <StyledIcon
      as={IconComponent}
      className={cn("text-foreground", className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
```

For a different icon API, inspect the installed component's public types and implementation before adding interop. Only when that inspected component truly requires a secondary **fill**, **stroke**, or other paint prop may a local wrapper reproduce its exact configuration:

```tsx
const StyledVendorIcon = styled(InspectedVendorIconAdapter, {
  className: {
    target: "<inspected-style-target>",
    nativeStyleMapping: {
      "<inspected-style-channel>": "<inspected-vendor-paint-prop>",
    },
  },
});
```

- Keep the Starter Lucide **text-foreground** class and height/width-to-size mapping as shown; do not add **color**, **fill**, or **stroke** mappings speculatively.
- For another library, use the utility and mapping that its inspected paint channel actually consumes.
- Reproduce a verified component-specific mapping; do not impose a generic fill/stroke adapter across icon libraries.
- Remove the conditional placeholder adapter entirely when the component already accepts NativeWind classes correctly.
- Keep icon size inherited from the owning primitive when that primitive already defines it.

## Invariants

- NativeWind v5 utility classes are the default for owned React Native UI.
- Tailwind v4 tokens and custom utilities live in **src/global.css**; semantic names describe roles, not hues or screens.
- Light values live in **:root** and automatic dark values override them under **prefers-color-scheme: dark**.
- **THEME** and **NAV_THEME** mirror CSS tokens needed by imperative APIs.
- **resolveAppColorScheme(useColorScheme())** is the single nullable-scheme normalization pattern.
- Existing local primitives and CVA variants are extended before new component systems are introduced.
- Owned components accept and forward **className**. Typed **styled()** adapters are local to incompatible third-party components and name every mapped prop.
- Raw colors and arbitrary dimensions do not appear in routes or feature components.

## Anti-Patterns

- Adding Tailwind v3 configuration, a parallel JavaScript token object, or gluestack-ui provider/component conventions.
- Hard-coding light values in a screen, navigation option, toast, overlay, or icon.
- Using conditional raw colors instead of semantic light/dark tokens.
- Repeating arbitrary utilities such as custom hex colors, widths, radii, type sizes, tracking, or line heights instead of promoting a token.
- Building class strings manually, allowing **undefined** fragments, or concatenating conflicting variants instead of using **cn** and CVA.
- Wrapping an owned component with **styled()**, mapping a class prop to a guessed vendor target, or exposing the vendor's entire untyped prop surface.
- Using **StyleSheet** to make NativeWind work on a third-party component.
- Adding speculative **color**, **fill**, or **stroke** mappings without inspecting the vendor, or copying one icon library's mapping into another.

## Validation and Review Checklist

- [ ] The final diff uses only the canonical owners above; no screen-local palette or primitive system was added.
- [ ] **src/global.css** keeps its import order, **@theme inline** aliases, root values, and dark overrides.
- [ ] Every new semantic token has both light and dark values and a paired foreground where content needs one.
- [ ] Every token consumed imperatively is synchronized in **THEME** and, when applicable, **NAV_THEME** or the existing **Colors** compatibility export.
- [ ] The app imports **global.css** once and navigation selects **NAV_THEME[resolveAppColorScheme(useColorScheme())]**.
- [ ] CVA owns finite variants; **cn** composes base, state, platform, and caller classes.
- [ ] Owned components forward **className**; each third-party adapter is typed and maps to exact native props.
- [ ] The Starter Lucide wrapper maps only height/width to size; any other icon paint mapping reproduces an inspected vendor requirement exactly.
- [ ] Light and dark surfaces, text, borders, focus rings, disabled states, destructive states, navigation chrome, and overlays were reviewed.
- [ ] No unresolved angle-bracket placeholder remains.
- [ ] Run typecheck and relevant lint after source changes. Targeted `pnpm exec oxfmt <changed-files> --check` must pass; run global `pnpm run format:check` and report unrelated baseline failures without editing out-of-scope docs. For this reference alone, inspect Markdown and verify the file/link scope.

## Independent Forward Validation

When this frozen blueprint changes, run an independent generation scenario in an isolated temporary workspace. Derive the prompt and acceptance checks from requested visual behavior and accepted repository decisions: CSS-first semantic tokens, synchronized imperative theme values, current system-scheme navigation, CVA/local primitive ownership, and inspected third-party interop. Do not give the evaluator the current implementation, expected diff, intended answer, or previous generation output. Review light/dark behavior and architectural invariants, not textual similarity to this reference.
