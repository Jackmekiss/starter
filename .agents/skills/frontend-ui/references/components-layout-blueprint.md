# Components and Layout Blueprint

> Blueprint version: `1.0.0`

Use this frozen blueprint to split screen sections, feature components, and local UI primitives and to compose them with React Native, NativeWind v5, Tailwind CSS v4 tokens, and CVA. The code blocks are adaptation skeletons, not generator input or copyable assets.

## Placeholders

- `<context>` / `<Context>`: bounded context that owns the feature vocabulary
- `<group>`: Expo Router route group containing the screen
- `<feature>` / `<Feature>`: cohesive screen block or interaction
- `<entity>` / `<Entity>`: business entity rendered by a feature component
- `<Primitive>`: generic local primitive such as `Surface` or `Badge`
- `<variant>`: closed visual variant with a product-defined semantic meaning
- `<VerbEntity>`: generated query/mutation hook stem
- `<translation-key>`: typed key added to every locale catalog

Replace all placeholders before implementation. Reuse the closest existing primitive or feature component before adding another file.

## Canonical Path Ownership

```text
src/
├── app/(<group>)/<feature>.tsx                   # screen framing + section order
├── components/
│   ├── <context>/
│   │   ├── <feature>-section.tsx                # cohesive feature read/action block
│   │   ├── <entity>-card.tsx                    # explicit feature display props
│   │   ├── <feature>-form.tsx                   # form interaction owner
│   │   └── <feature>-header.tsx                 # conditional feature header
│   ├── ui/
│   │   ├── Button.tsx                           # generic press primitive + CVA
│   │   ├── Input.tsx                            # generic single-line control
│   │   ├── Text.tsx                             # typography + heading semantics
│   │   ├── Icon.tsx                             # third-party icon style adapter
│   │   └── <Primitive>.tsx                      # conditional generic primitive
│   └── ux/                                      # reusable platform interaction affordance
├── lib/cn.ts                                    # clsx + tailwind-merge helper
├── global.css                                   # Tailwind v4 semantic design tokens
└── constants/theme.ts                           # imperative/native theme colors

core/<context>/adapters/selectors/**             # stable durable reads
src/app-runtime/app-runtime.ts                    # public generated-hook/appMode facade
```

The layers have different permissions:

| Layer                     | May know business vocabulary | May use selector/router |              May call generated hook | Receives layout placement from parent |
| ------------------------- | ---------------------------: | ----------------------: | -----------------------------------: | ------------------------------------: |
| Route screen              |                          Yes |                     Yes |                 Yes, for screen gate |                                   N/A |
| Feature section           |                          Yes |                     Yes | At most one relevant hook by default |                                   Yes |
| Feature card/row          |                Yes, narrowly |             Normally no |                                   No |                                   Yes |
| `components/ui` primitive |                           No |                      No |                                   No |                                   Yes |
| Core selector/use case    |                          Yes |            No UI/router |                        No React hook |                          No UI layout |

Feature code may directly import stable core selectors and presentation error resolvers. Generated query/mutation hooks and any `appMode` access always import from `@/app-runtime/app-runtime`; no component imports `@/app-runtime/runtime/**`, a gateway, API instance, slice action, or store.

## Required and Conditional Files

For a composed feature screen, require:

- the owning route screen;
- one feature section when a visual block has cohesive reads/actions beyond simple props;
- existing `Text`, `Button`, `Input`, `Icon`, or other shared primitives required by the design;
- `src/lib/cn.ts` for conditional/overridable class merging;
- semantic Tailwind v4 tokens for every theme-aware color;
- the public facade export for each generated hook the screen or section consumes.

Add only when needed:

- an `<entity>-card.tsx` or row when rendering repeats or has an independent responsibility;
- a new `components/ui/<Primitive>.tsx` after two callers or a clear design-system responsibility justifies it;
- CVA when a reusable component has a closed variant/size/state matrix;
- a local NativeWind `styled()` adapter when a third-party native component does not forward `className`;
- `Platform.select()` for behavior or utilities that genuinely differ by platform;
- `StyleSheet` or an imperative theme value only when NativeWind cannot express a required native style prop;
- `FlatList`/`SectionList` for virtualized or materially large collections;
- local `useState` for mounted interaction mechanics such as expanded/open/selected display state.

Do not add a generic primitive solely to shorten one JSX expression, and do not promote feature-specific variants into the global UI layer.

## Component Boundary Rules

### Screen

The screen owns safe-area/scroll framing, whole-screen states, route params, navigation shared by several sections, and major section order. It should read like an outline, not contain card internals or business transformations.

```tsx
return (
  <SafeAreaView className="bg-background flex-1">
    <View className="flex-1 gap-6 px-6 py-4">
      <<Feature>Header />
      <<Feature>SummarySection />
      <<Feature>ActionsSection />
    </View>
  </SafeAreaView>
);
```

The parent owns `gap`, page padding, columns, and placement. Sections do not add page-specific top/left margins to position themselves.

### Feature section

A section may own one relevant query/mutation, stable selectors, block-local formatting, retry, local navigation, and ephemeral interaction state. It handles its own loading/error/empty states only when those states do not gate sibling sections.

Use direct explicit values rather than a broad `screenModel` or `data` prop. Keep shared business derivation in a core selector; keep localized display formatting in the section or card that renders it.

### Feature card or row

A card/row is normally prop-driven. It may understand its narrow feature vocabulary, but it does not fetch, select global state, dispatch slice actions, or decide cross-screen behavior. Prefer props such as `title`, `subtitle`, `status`, `selected`, `disabled`, and `onPress` over `payload`, `config`, or a screen-wide model.

### Generic local primitive

A `components/ui` primitive is business-agnostic and prop-driven. It provides visual variants, platform semantics, and `className` composition. It does not contain translation keys, router calls, selectors, generated hooks, or product decisions.

## Prop-Driven Primitive Skeleton

Use CVA for a finite reusable visual matrix and preserve caller overrides through `cn`:

```tsx
// src/components/ui/Surface.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { View } from "react-native";

import { cn } from "@/lib/cn";

import type { ComponentProps } from "react";

const surfaceVariants = cva("border-border rounded-lg border", {
  variants: {
    tone: {
      default: "bg-card",
      muted: "bg-muted",
      destructive: "bg-destructive/10 border-destructive/30",
    },
    padding: {
      none: "",
      sm: "p-3",
      default: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    tone: "default",
    padding: "default",
  },
});

/** Props accepted by the shared surface primitive. */
type SurfaceProps = ComponentProps<typeof View> &
  VariantProps<typeof surfaceVariants>;

/** Business-agnostic themed container with closed visual variants. */
export function Surface({ className, padding, tone, ...props }: SurfaceProps) {
  return (
    <View
      className={cn(surfaceVariants({ padding, tone }), className)}
      {...props}
    />
  );
}

export { surfaceVariants };
export type { SurfaceProps };
```

Do not give a generic surface a default accessibility role: a visual container is not automatically a button, group, summary, or alert. The feature caller supplies semantics only when the content has that meaning.

## Prop-Driven Feature Component Skeleton

Keep the component explicit and accessible without letting it own global behavior:

```tsx
// src/components/<context>/<entity>-card.tsx
import { View } from "react-native";

import { Text } from "@/components/ui/Text";

/** Presentation-ready values rendered by one <entity> card. */
interface <Entity>CardProps {
  /** Primary <entity> label. */
  title: string;
  /** Supporting <entity> copy. */
  description: string;
  /** Optional localized status. */
  statusLabel?: string;
}

/** Renders one <entity> summary from presentation-ready values. */
export function <Entity>Card({
  description,
  statusLabel,
  title,
}: <Entity>CardProps) {
  return (
    <View className="border-border bg-card gap-2 rounded-lg border p-4">
      <Text variant="h3">{title}</Text>
      <Text variant="muted">{description}</Text>
      {statusLabel ? <Text variant="small">{statusLabel}</Text> : null}
    </View>
  );
}
```

If the whole card is actionable, use `Pressable`/`Button` with an explicit `onPress`, accessible name, role, and state. Do not make a parent `View` accessible while also leaving duplicate accessible children unless a single grouped announcement is intentional and verified.

## Autonomous Feature Section Skeleton

This concrete Starter-shaped example demonstrates the allowed single-hook section. Use it only when the parent screen does not already own the subscription-status request.

```tsx
// src/components/subscription/subscription-status-section.tsx
import { View } from "react-native";

import { useRetrieveSubscriptionStatusQuery } from "@/app-runtime/app-runtime";
import { SubscriptionStatusCard } from "@/components/subscription/subscription-status-card";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useSelector } from "@/hooks/redux-hooks";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { resolveSubscriptionErrorMessage } from "@core/subscription/adapters/presentation/subscription-error-message";
import { selectCurrentSubscription } from "@core/subscription/adapters/selectors/subscription-selectors";

/** Retrieves and renders the current subscription block. */
export function SubscriptionStatusSection() {
  const { t } = useTranslation();
  const subscription = useSelector(selectCurrentSubscription);
  const { error, isError, isLoading, refetch } =
    useRetrieveSubscriptionStatusQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  /** Retries the section-owned subscription request. */
  function handleRetry() {
    void refetch();
  }

  if (isLoading) {
    return (
      <View accessibilityLiveRegion="polite" accessibilityRole="progressbar">
        <Text>{t("<translation-key>")}</Text>
      </View>
    );
  }

  if (isError) {
    const message = resolveSubscriptionErrorMessage(error, t, {
      fallbackMessage: t("<translation-key>"),
    });

    return (
      <View className="gap-3">
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert">
          {message}
        </Text>
        <Button onPress={handleRetry} variant="outline">
          <Text>{t("<translation-key>")}</Text>
        </Button>
      </View>
    );
  }

  if (subscription === null) {
    return (
      <View accessibilityLiveRegion="polite" className="gap-2">
        <Text variant="h2">{t("<translation-key>")}</Text>
        <Text variant="muted">{t("<translation-key>")}</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text variant="h2">{t("<translation-key>")}</Text>
      <SubscriptionStatusCard
        description={t("<translation-key>")}
        statusLabel={t("<translation-key>")}
        title={t("<translation-key>")}
      />
    </View>
  );
}
```

Replace the placeholder keys and presentation values with localized, status-specific formatting owned by this block. Do not pass the raw `error` or whole query result into the card. RTK Query owns the transient request; `onQueryStarted` hydrates Redux; the section renders the stable selector.

## Layout Contract

- Parents own page padding, sibling `gap`, grid/column calculation, alignment, and section order.
- Children own their border, internal padding, internal `gap`, content alignment, and intrinsic minimum size.
- Reusable children should not position themselves with page-specific margins, negative offsets, absolute coordinates, or percentage widths.
- Prefer `flex`, `gap`, named spacing utilities, and content-driven sizing.
- When fixed columns are required, calculate item width in the owning parent from available width, padding, and gap; pass the result as an explicit prop/style.
- Use safe-area utilities/providers at screen or overlay boundaries, not scattered compensating padding in descendants.
- Use a virtualized list for large/repeated data; put the stable key on the data item and keep row rendering extracted when it has real responsibility.
- Preserve successful content during background refresh; a layout should not jump between unrelated frames for transient metadata.

## NativeWind, Tailwind, CVA, and Interop

- Style React Native and application-owned components with `className` and semantic utilities such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, and `text-destructive`.
- Define reusable colors/scales in Tailwind v4's CSS-first theme in `src/global.css`; do not add a Tailwind v3 configuration file.
- Merge conditional classes and caller overrides with `cn()`.
- Use CVA for closed variants and sizes, not for arbitrary per-screen styling.
- Application-owned wrappers accept `className` and forward it to the underlying React Native element.
- When a third-party component ignores `className`, define the narrow adapter beside the owning screen/primitive and use NativeWind v5 `styled()` to map class props to supported style props.
- Use `Platform.select()` only for genuine platform behavior or web-only state utilities.
- Use imperative colors from `THEME` only for native props that cannot consume utility classes; resolve the app color scheme first.

## Accessibility Contract

- Reuse `Text` heading variants so heading roles and levels remain consistent.
- Reuse `Button` for button semantics; propagate `disabled`, `busy`, `selected`, `expanded`, and checked state accurately.
- Give icon-only actions a localized label and mark decorative icons inaccessible.
- Preserve a minimum practical touch target and do not rely on color alone for selection, error, or status.
- Allow text to grow and wrap; avoid fixed heights around arbitrary user-visible text.
- Announce asynchronous status/error changes with the narrowest live region that conveys the update.
- Avoid duplicate accessibility nodes created by an accessible container plus identical accessible descendants.
- Keep list position, modal focus, and hidden-content exposure correct for VoiceOver, TalkBack, Appium, and XCUITest.

## Invariants

- Screens compose sections; sections own cohesive blocks; feature cards render explicit values; UI primitives remain generic.
- A feature section calls at most one relevant generated hook by default and only when the screen does not already own it.
- Generated hooks come from `@/app-runtime/app-runtime`; stable selectors/presentation resolvers may come from their core adapter paths.
- Durable state lives in core, request lifecycle in RTK Query, and ephemeral display state locally.
- Parent layout owns external placement; child layout owns internal spacing.
- Semantic Tailwind tokens work in light and dark modes; CVA variants remain finite and named.
- Component semantics describe the actual interaction and do not duplicate the accessibility tree.

## Anti-Patterns

- A `components/ui` primitive importing a context entity, selector, translation key, router, generated hook, gateway, API, or store.
- A card fetching its own record or dispatching durable slice actions.
- The same query hook in the screen and section merely to avoid props.
- Broad props named `data`, `payload`, `config`, or `screenModel` when explicit props state the contract.
- A reusable child positioning itself with page margins, negative offsets, percentages, or arbitrary sizes.
- Rebuilding `Text`, `Button`, `Input`, or `Icon` styles inside a screen.
- Hard-coded light/dark colors, Tailwind v3 configuration, or `StyleSheet` used as a className interop workaround.
- CVA variants for one-off content values or unbounded runtime strings.
- Inline business calculations, raw backend error inspection, or navigation effects inside generic primitives.
- Touchable rows with no role/name/state, fixed-height text containers, or duplicated accessible labels.

## Validation and Review Checklist

- [ ] Requested component behavior and accepted, non-superseded repository decisions remain normative over the nearest example.
- [ ] Component expectations were forward-tested independently from requested behavior and accepted decisions, never copied from the implementation output.
- [ ] Each component is at the narrowest correct screen, section, feature, or UI-primitive layer.
- [ ] The screen owns major placement and sections own only internal layout.
- [ ] A section's hook is relevant only to that block and is not duplicated by the screen.
- [ ] Generated hooks use the runtime facade; no component constructs/imports runtime infrastructure.
- [ ] Durable, request, and ephemeral state have one owner each.
- [ ] Props are explicit; generic primitives contain no business vocabulary.
- [ ] Existing primitives/tokens are reused before new abstractions are added.
- [ ] NativeWind classes, Tailwind v4 tokens, `cn`, CVA, and third-party `styled()` interop follow their intended roles.
- [ ] Loading, empty, success, failure, disabled, selected, and retry layouts work with long/dynamic text.
- [ ] Names, roles, states, focus order, live announcements, touch targets, and hidden content are correct on native platforms.
- [ ] Light/dark rendering and iOS/Android behavior are verified.
- [ ] Typecheck and relevant lint pass; targeted `pnpm exec oxfmt <changed-files> --check` passes, and global `pnpm run format:check` was run with unrelated baseline failures reported rather than repaired out of scope.
