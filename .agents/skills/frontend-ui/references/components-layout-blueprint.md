# Components and Layout Blueprint

> Blueprint version: `1.7.0`

Use this frozen blueprint when composing Starter screens, feature sections, or shared UI primitives. Starter uses gluestack-ui v5 as its sole component-system vocabulary, with NativeWind v5, Tailwind CSS v4, semantic tokens, React Native layout primitives, and locally adapted state helpers.

The code blocks are adaptation skeletons. Replace placeholders, inspect installed public types, and preserve the nearest established public contract when extending an existing component.

## Placeholders

- `<context>` / `<Context>`: bounded context that owns feature vocabulary
- `<group>`: Expo Router group containing a screen
- `<feature>` / `<Feature>`: cohesive screen block or interaction
- `<entity>` / `<Entity>`: business entity rendered by a feature component
- `<Primitive>`: business-agnostic PascalCase design-system component
- `<variant>` / `<size>`: finite, product-defined CVA option
- `<semantic-token>`: reusable visual role, never a raw hue or feature name

## Canonical Tree

```text
src/
├── app/(<group>)/<feature>.tsx
├── components/
│   ├── <context>/
│   │   ├── <feature>-section.tsx
│   │   ├── <entity>-card.tsx
│   │   └── <feature>-form.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Badge.tsx
│       ├── BottomSheetModal.tsx
│       ├── Button.tsx
│       ├── CameraView.tsx
│       ├── Checkbox.tsx
│       ├── FormControl.tsx
│       ├── Icon.tsx
│       ├── Input.tsx
│       ├── Link.tsx
│       ├── PhoneNumberInput.tsx
│       ├── Progress.tsx
│       ├── Radio.tsx
│       ├── SafeAreaView.tsx
│       ├── ScreenHeader.tsx
│       ├── Switch.tsx
│       ├── Text.tsx
│       ├── Textarea.tsx
│       ├── Toast.tsx
│       ├── <Primitive>.tsx
│       └── <Primitive>.stories.tsx
├── constants/theme.ts
├── global.css
└── lib/cn.ts

core/<context>/adapters/selectors/**
src/app-runtime/app-runtime.ts
```

These component families are Starter's canonical local design-system surface. Use `Textarea`, never the historical `TextArea` spelling. Keep stories next to primitives and route Storybook-specific work through [storybook-blueprint.md](storybook-blueprint.md).

## Ownership

| Layer                  | Business vocabulary | Global selector/router | Generated hook                       | External placement |
| ---------------------- | ------------------- | ---------------------- | ------------------------------------ | ------------------ |
| Route screen           | Yes                 | Yes                    | Screen-level gate only               | Owns it            |
| Feature section        | Yes                 | Yes                    | At most one relevant hook by default | Receives it        |
| Feature card/row       | Narrowly            | Normally no            | No                                   | Receives it        |
| `components/ui`        | No                  | No                     | No                                   | Receives it        |
| Core selector/use case | Yes                 | No UI/router           | No React hook                        | No UI layout       |

Generated query and mutation hooks import from `@/app-runtime/app-runtime`. A UI primitive never imports a context entity, selector, translation key, router, gateway, API instance, slice, store, or runtime internal.

## Required and Conditional Files

For a composed screen, require:

- the owning lowercase Expo Router route;
- one feature section when a block owns cohesive reads or actions;
- existing shared primitives before new abstractions;
- semantic CSS tokens for every theme-aware role;
- the runtime-facade export for each generated hook consumed by presentation code;
- typed localization keys for user-visible copy.

For a new shared primitive, require:

- `src/components/ui/<Primitive>.tsx` with a PascalCase export and filename;
- a prop-driven, business-agnostic contract;
- `className` composition through `cn`;
- CVA only when variants or sizes form a finite reusable matrix;
- accurate native semantics and states;
- a co-located `<Primitive>.stories.tsx` covering meaningful states.

Add a primitive only after reuse or a clear design-system responsibility justifies it. A one-screen visual fragment stays in its feature folder.

## Canonical Family Contracts

| Family           | Implementation shape                                                                                              | Starter-specific contract                                                                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alert            | compound container, icon, title, description, action                                                              | `error`, `info`, `muted`, `success`, `warning` tones; `outline` and softly filled `solid` treatments                                                                                     |
| Badge            | compact compound label/icon                                                                                       | `primary` plus status tones; `outline`/`solid`; `sm`/`md`/`lg`; pill radius                                                                                                              |
| BottomSheet      | Gorhom adapter with `persistent`, `nonModal`, and `modal` variants plus backward-compatible modal/content exports | persistent sheets lock all drag/dismiss gestures; non-modal sheets keep background interaction; modal sheets isolate it; localized content/backdrop/handle labels are encoded by variant |
| Button           | `Pressable` + text context + CVA                                                                                  | `primary`/`tertiary`/`negative` actions; solid/outline/link plus compatibility variants; `xs` through `xl` and icon                                                                      |
| CameraView       | styled Expo Camera adapter                                                                                        | maps `className` to the vendor `style` prop                                                                                                                                              |
| Checkbox         | standalone `@rn-primitives/checkbox` root + indicator                                                             | localized control label; checked/indeterminate/invalid/disabled; `sm`/`md`/`lg`; caller-owned visible label                                                                              |
| FormControl      | label primitive + local context                                                                                   | label, input, description, message; input requires a localized native name; IDs and field states remain connected                                                                        |
| Icon             | typed Lucide adapter                                                                                              | owning primitive supplies color/size; height/width map to Lucide `size` only                                                                                                             |
| Input            | controlled native input                                                                                           | rounded/outline/underlined treatments; `sm` through `xl`; form-control state can be inherited                                                                                            |
| Link             | `Pressable` or native link semantics                                                                              | primary, underlined, bold, disabled-aware                                                                                                                                                |
| Menu             | gluestack `createMenu` compound collection                                                                        | Render-prop trigger, placement/offset, disabled keys, `sm`/`md`, modal portal, and 150 ms motion                                                                                         |
| PhoneNumberInput | typed vendor wrapper                                                                                              | controlled international value; localized input/country-button labels and language; imperative theme props                                                                               |
| Progress         | `@rn-primitives/progress` root + indicator                                                                        | localized control label plus optional visible value; `xs` through `2xl` track sizes                                                                                                      |
| Radio            | `@rn-primitives/radio-group` root/item/indicator                                                                  | each item has a localized control label; checked/invalid/disabled; `sm`/`md`/`lg`                                                                                                        |
| SafeAreaView     | styled safe-area-context adapter                                                                                  | maps `className` to `style`                                                                                                                                                              |
| ScreenHeader     | local composition                                                                                                 | centered wrapping title without truncation; `headingLevel="1"`; localized back label; `px-screen`                                                                                        |
| Switch           | controlled React Native `Switch`                                                                                  | native platform animation; `sm`/`md`/`lg`; checked, invalid, disabled; localized label and `valueLabel` required                                                                         |
| Text             | native text + variant context                                                                                     | explicit Poppins face per weight; `h1`-`h4` own semantics, visual `heading` uses optional `headingLevel`                                                                                 |
| Textarea         | multiline input                                                                                                   | same state/variant language as Input; content-driven minimum height                                                                                                                      |
| Toast            | local animated provider, surface, and hook                                                                        | stacked status feedback; `outline`/`solid`; title/description/action/close; live-region semantics                                                                                        |

The catalog defines responsibilities, not permission to fork APIs. Inspect the existing component before changing names or aliases, and keep current callers source-compatible unless an accepted decision authorizes a migration.

### Shared interaction motion

Preserve the canonical interaction motion when extending a local primitive. `Button`
uses `transition-colors duration-150 ease-out` on its root, text, and icon. Do not add a press-scale
animation or unresolved alpha shadow utilities. In particular, combining an animated NativeWind button with
`shadow-black/5` can make Reanimated receive an unresolved alpha shadow color and crash with an
invalid `#NaN...0d` value. `Input` uses the same cross-platform color transition on its frame and
icon; unlike the affected Button, it does not carry an alpha shadow utility.

Keep `Menu` as the canonical gluestack primitive:
its root is the styled animated `ScrollView` supplied to `createMenu`, with
`ZoomIn.duration(150)` and `FadeOut.duration(150)`, `shadow-sm`, and a `gap-2` content container.
Keep the render-prop `trigger` API, direct `MenuItem` children, collection keys, disabled keys,
placement, offset, modal portal, focus management, and dismissal behavior owned by gluestack.

### Button spinner motion

`ButtonSpinner` owns loader-presence motion for every button while preserving its existing
`ActivityIndicator` prop contract. Conditional mounting animates opacity, scale, occupied width,
and gap compensation for 200 milliseconds on Reanimated's UI thread: entrance uses
`ease-out-back`, and exit uses `ease-in-back` while opacity eases inward.

The owning `Button` keeps its real size-dependent flex gap. While the spinner width is closed,
`ButtonSpinner` offsets that gap with a negative trailing margin; it releases the compensation as
the width opens and restores it while exiting. This moves adjacent text continuously without
replacing the button's normal gap contract. A spinner used alone receives no compensation and
remains centered. The animation must not change the button height, touch target, or disabled
semantics. Apply `ReduceMotion.System` to every timing animation. Keep one interactive Button story
that mounts and unmounts the spinner, plus an icon-sized spinner-only example.

## Layout Contract

- Screens own safe-area and scroll framing, whole-screen gates, route parameters, major section order, `px-screen`, and sibling `gap`.
- `--spacing-screen` is 1.5rem (24 points). Use `px-screen` rather than repeating `px-6` in reusable screen chrome.
- Sections own internal block layout and their own local loading/error/empty state when it does not gate siblings.
- Cards and rows render explicit presentation-ready props and never fetch or dispatch durable state.
- Children own borders, internal padding, intrinsic minimum size, and content alignment; parents own external placement.
- Prefer flex, gap, named spacing, and content-driven sizing. Do not use page-specific margins, negative offsets, percentage widths, or absolute positioning inside reusable children.
- Use `FlatList` or `SectionList` for materially large collections.
- Allow text to wrap and scale. Avoid fixed heights around localized or user-generated content.

### Screen skeleton

```tsx
import { View } from "react-native";

import { SafeAreaView } from "@/components/ui/SafeAreaView";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

/** Composes the <feature> screen without owning component internals. */
export default function <Feature>Screen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScreenHeader
        backAccessibilityLabel="<localized-label>"
        title="<localized-title>"
      />
      <View className="flex-1 gap-6 px-screen py-4">
        <<Feature>SummarySection />
        <<Feature>ActionsSection />
      </View>
    </SafeAreaView>
  );
}
```

## Shared Primitive Pattern

Finite variants use semantic tokens and preserve caller overrides:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";

import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

const <primitive>Variants = cva("border-border bg-card rounded-xl border", {
  variants: {
    tone: {
      default: "",
      destructive: "border-destructive-border bg-destructive-soft",
      info: "border-info-border bg-info-soft",
      success: "border-success-border bg-success-soft",
      warning: "border-warning-border bg-warning-soft",
    },
    padding: {
      none: "",
      sm: "p-3",
      default: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    padding: "default",
    tone: "default",
  },
});

type <Primitive>Props = ComponentProps<typeof View> &
  VariantProps<typeof <primitive>Variants>;

/** Business-agnostic <primitive> using Starter semantic tokens. */
export function <Primitive>({
  className,
  padding,
  tone,
  ...props
}: <Primitive>Props) {
  return (
    <View
      className={cn(<primitive>Variants({ padding, tone }), className)}
      {...props}
    />
  );
}
```

Use the readable role defined by the owning component's treatment. Status feedback distinguishes emphasis text on an outline from status foreground text on a soft fill; filled errors use `destructive-status-foreground`. A decorative container gets no default accessibility role; the caller or compound component supplies semantics only when the content is truly an alert, group, progress indicator, or control.

## Primitive Adapters

### Canonical gluestack Menu

Keep `@gluestack-ui/core` and `@gluestack-ui/utils` on their validated compatible versions, create the compound primitive
with `@gluestack-ui/core/menu/creator`, and mount `OverlayProvider` in the application and
Storybook provider trees. The immediate parent of every `MenuItem` is `Menu`; do not insert a
higher-order wrapper between them. Do not replace this runtime with another dropdown implementation
or split the render-prop trigger API into separate compound components.

The local theme may expose the narrow aliases consumed by the component
(`background-0/50/100`, `border-100/300`, `typography-900`, and `warning-500`) by mapping them to
the existing semantic theme roles. Do not copy a parallel palette.

Menu icons use the local gluestack `UiIcon` paint adapter and the canonical fill-based
`MenuCreditCardIcon`, `MenuHelpIcon`, `MenuInfoIcon`, and `MenuPathIcon` glyphs. The
`fill-typography-900` recipe is intentional for those glyphs. Do not substitute raw Lucide
stroke icons: applying the fill recipe to Lucide turns their card and circle paths into solid
blocks.

### Radix-style native primitives

For checkable controls and progress, compose the installed focused package instead of recreating state machines:

```tsx
import * as <Primitive>Primitive from "@rn-primitives/<package>";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const <primitive>Variants = cva(
  "border-border data-[disabled]:opacity-40",
  {
    variants: {
      size: {
        sm: "<named-small-classes>",
        md: "<named-medium-classes>",
        lg: "<named-large-classes>",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type <Primitive>Props = React.ComponentProps<
  typeof <Primitive>Primitive.Root
> &
  VariantProps<typeof <primitive>Variants>;

/** Native primitive preserving vendor state and Starter visuals. */
export function <Primitive>({
  className,
  size,
  ...props
}: <Primitive>Props) {
  return (
    <<Primitive>Primitive.Root
      className={cn(<primitive>Variants({ size }), className)}
      {...props}
    />
  );
}
```

Inspect the installed package's root, indicator/thumb, state props, and web/native behavior before adapting it. Do not infer a web Radix API from its name.

### Camera and safe-area adapters

Use `styled()` only because these third-party components expose an imperative `style` target:

```tsx
import { CameraView as ExpoCameraView } from "expo-camera";
import { styled } from "nativewind";
import { SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";

const CameraView = styled(ExpoCameraView, {
  className: "style",
});

const SafeAreaView = styled(NativeSafeAreaView, {
  className: "style",
});

export { CameraView, SafeAreaView };
```

Keep each adapter in its own PascalCase file with its vendor ref/prop types exported when callers need them.

### Phone input and other imperative vendor styles

When a vendor accepts style objects but not `className`, resolve the semantic mirror from the same navigation theme context mounted by the application and Storybook. This is a legitimate imperative boundary, not permission to use raw colors or `StyleSheet` for owned views.

```tsx
const theme = THEME[useTheme().dark ? "dark" : "light"];

<ThirdPartyPhoneInput
  containerStyle={{ backgroundColor: theme.background }}
  flagContainerStyle={{ backgroundColor: theme.muted }}
  phoneInputStyles={{
    color: theme.foreground,
    selectionColor: theme.primary,
  }}
/>;
```

Do not read the system appearance directly inside a vendor wrapper. Storybook web selects an explicit theme without mutating React Native Web's unavailable `Appearance.setColorScheme`; consuming `ThemeProvider` through `useTheme()` keeps imperative colors synchronized with CSS utilities and navigation on every platform.

The public wrapper remains controlled and typed. It owns vendor normalization only; feature-specific validation, country rules, copy, and submission behavior stay in the feature form.

Its public contract requires a localized phone-input `accessibilityLabel`, a localized `countryButtonAccessibilityLabel`, and the current localization `language`; do not infer these from a default locale inside the generic primitive.

## Compound Accessibility Contracts

- `ScreenHeader` requires localized back-action copy and lets its centered title wrap. Its visual `heading` text passes `headingLevel="1"`, letting `Text` derive role and level together. Do not set `numberOfLines={1}`, ellipsize, or reserve a fixed-height title box.
- The exported local `BottomSheetModalProvider` composes Gorhom's provider outside a private accessibility guard; callers never mount those pieces separately or invert their portal-critical order. Localization and theme providers remain ancestors so Gorhom's stored portal nodes receive both contexts. `BottomSheet` exposes three discriminated behaviors: `persistent` renders in-tree with its handle and every drag/dismiss gesture disabled; `nonModal` is closable, shows an accessible handle, and leaves background traversal and interaction available; `modal` renders a dismissing backdrop, hides the non-portaled sibling from web accessibility, VoiceOver, and TalkBack, and does not enable pan-down dismissal by default. Closable variants register synchronously for the single ordered Android hardware-back stack and release only after dismissal/unmount. They use `stackBehavior="replace"`, replace Gorhom's hard-coded accessible background with a decorative local background, and consume the shared theme with `useTheme()`. The legacy `BottomSheetModal` export remains source-compatible and modal. Localized content labels are always required; modal backdrop and non-modal handle labels/hints are enforced by the variant unions.
- `FormControlInput` requires a localized native `accessibilityLabel` even when the visible web label is connected by IDs. It also connects description/message IDs and invalid/disabled/required state.
- `Switch` requires a localized `accessibilityLabel` for the control and a localized spoken `valueLabel` such as the translated on/off value; do not synthesize English inside the primitive.
- `Checkbox`, `RadioGroupItem`, and `Progress` each require a localized `accessibilityLabel`; visible copy does not replace the native name contract.
- `Checkbox` remains a standalone design-system control. The caller composes its visible label and may reuse exported `checkboxLabelVariants` for the canonical `sm`/`md`/`lg` label scale. Keep label composition outside the control instead of adding a compound label anatomy.

## Toast Contract

`Toast.tsx` owns both the visual configuration used by the single root host and the imperative hook used by callers:

```ts
interface ShowToastOptions {
  action: "error" | "info" | "muted" | "success" | "warning";
  closeAccessibilityLabel: string;
  description: string;
  actionAccessibilityLabel?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  showClose?: boolean;
  duration?: number;
  title?: string;
  variant?: "outline" | "solid";
}

interface ToastController {
  close(id: string | number): void;
  closeAll(): void;
  isActive(id: string | number): boolean;
  show(options: ShowToastOptions): number;
}
```

Render `outline` feedback on `bg-background` with the action's emphasis role. Render softly filled `solid` feedback with the action's soft surface, semantic border/emphasis, and status foreground; errors use `destructive-status-foreground`. Mount one local `ToastProvider` in the application tree and one in the Storybook tree. It stacks Toasts with `gap-2`, animates each entrance and exit for 150 milliseconds, clears timers on close/unmount, and removes the fixed safe-area host when the stack becomes empty. Use one accurate alert/live-region node; do not duplicate announcements through an extra manual accessibility announcement.

## Accessibility Contract

- Semantic `Text` variants `h1` through `h4` own the matching heading role and level. The visual `heading` variant deliberately owns no implicit semantic level; composed primitives such as `ScreenHeader` pass `headingLevel` (`"1"` through `"6"`) so `Text` derives `role="heading"` and `aria-level` together. Do not pass those two native/web props independently.
- Button, checkbox, radio, switch, link, and progress semantics reflect actual state.
- Checkbox, radio items, progress, and switches require caller-supplied localized accessible names; switch also requires its localized spoken value.
- Icon-only actions require localized accessible names; decorative icons are hidden.
- Disabled, busy, invalid, selected, expanded, checked, and indeterminate states remain accurate.
- Button loader motion stays centralized in `ButtonSpinner`; screens never animate individual
  loaders or compensate for their width.
- Touch targets remain practical even when the visible control is compact.
- Status is not conveyed by color alone.
- Async updates use the narrowest live region that conveys the change.
- An accessible parent does not duplicate identical accessible descendants.

## Invariants

- Screens compose sections; sections own cohesive blocks; feature cards render explicit values; UI primitives remain generic.
- The 20 canonical families preserve one gluestack-oriented visual language; React Native layout primitives and state helpers remain implementation details rather than a competing component system.
- Every Poppins weight selects its explicit `font-body-*` family; generic `fontWeight` utilities do
  not select custom Poppins faces on native.
- Poppins, 24-point screen spacing, shared radii, semantic brand/status tokens, and light/dark values come from the central theme.
- Parent layout owns external placement; child layout owns internal spacing.
- Focused `@rn-primitives` own checkbox, radio, and progress state machines; gluestack owns Menu state, overlay, and collection behavior; local components own visual contracts.
- Third-party adapters are narrow, typed, and map only verified props.
- Every new or materially changed shared primitive has a focused Storybook story.

## Anti-Patterns

- Adding a competing design-system runtime, provider, token object, foreign variant recipe, or copied compound API alongside the local gluestack contract.
- A `components/ui` primitive importing business vocabulary, translations, router, selectors, generated hooks, or runtime infrastructure.
- Rebuilding a canonical primitive inside a feature or adding a competing palette/type scale.
- Broad props such as `data`, `payload`, `config`, or `screenModel` when explicit props define the contract.
- Raw colors, one-off arbitrary dimensions, Tailwind v3 configuration, or `StyleSheet` as a `className` workaround.
- Reimplementing checkbox/radio/switch/progress state with `Pressable` when the focused `@rn-primitives` package already owns it.
- Styling a camera, safe-area, or phone vendor without a typed adapter or imperative theme mirror.
- A story importing Redux, persistor, gateway, API, runtime internal, or feature business fixture.

## Validation Checklist

- [ ] Existing public primitive APIs remain compatible unless migration was explicitly accepted.
- [ ] The change lives at the narrowest correct screen, section, feature, or UI layer.
- [ ] Hooks use the runtime facade; durable, request, and local interaction state each have one owner.
- [ ] Generic props contain no business vocabulary and caller `className` overrides are preserved through `cn`.
- [ ] Brand/status roles use semantic tokens with soft, border, and foreground counterparts in both schemes.
- [ ] Shared and compound text uses `font-body`, `font-heading`, or the exact `font-body-*` family for
      its intended Poppins face.
- [ ] Layout uses `px-screen` at screen boundaries and remains stable with long/scaled text.
- [ ] Native roles, names, states, touch targets, focus, live regions, and hidden content are correct.
- [ ] Stories cover meaningful variants and states and follow [storybook-blueprint.md](storybook-blueprint.md).
- [ ] Typecheck, relevant lint, targeted Oxfmt, Storybook registry generation when applicable, and a Storybook-enabled bundle check pass.

## Independent Forward Validation
