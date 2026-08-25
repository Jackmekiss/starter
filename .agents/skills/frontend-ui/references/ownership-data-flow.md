# UI Ownership and Data Flow

> Blueprint version: `1.0.1`

This is the frozen ownership contract for Starter's Expo presentation layer. Use it before deciding whether code belongs in a route, a feature section, a local primitive, or a frontend bounded context. The examples are Markdown skeletons to adapt in place; they are not generators or assets.

## Placeholders

- `<context>` / `<Context>`: bounded context, for example `auth` / `Auth`
- `<feature>` / `<Feature>`: user-facing capability, for example `account` / `Account`
- `<entity>` / `<Entity>`: durable business concept owned by the context
- `<action>`: kebab-case core use-case folder
- `<verbEntity>` / `<VerbEntity>`: use-case and generated hook stem
- `<group>`: Expo Router route group without the parentheses, for example `tabs`
- `<Primitive>`: business-agnostic local UI primitive
- `<translation-key>`: typed key added to every supported translation catalog

Replace every placeholder consistently before copying a skeleton. Preserve the nearest complete Starter implementation when it is more specific than this blueprint.

## Canonical Ownership Tree

```text
src/
├── app/
│   ├── _layout.tsx                              # root route shell only
│   └── (<group>)/
│       ├── _layout.tsx                          # navigator declaration
│       └── <feature>.tsx                        # screen gates + composition
├── components/
│   ├── <context>/
│   │   ├── <feature>-section.tsx                # feature-local read/action block
│   │   ├── <feature>-form.tsx                   # ephemeral form state + submit
│   │   └── <entity>-card.tsx                    # prop-driven feature rendering
│   └── ui/
│       └── <Primitive>.tsx                      # generic prop-driven primitive
├── hooks/
│   ├── app-shell/                               # presentation lifecycle hooks
│   └── localization/                            # typed UI-facing i18n hook
└── app-runtime/
    ├── app-runtime.ts                           # public generated-hook/appMode facade
    ├── root-app-providers.tsx                   # global provider composition
    ├── root-navigator.tsx                       # durable-state route guards
    └── runtime/<context>-runtime.ts             # API/gateway composition; not UI

core/<context>/
├── domain/                                      # entities, invariants, durable slice
├── gateways/                                    # domain-oriented external port
├── use-cases/<action>/                          # RTK Query endpoint builder
├── adapters/
│   ├── selectors/<context>-selectors.ts         # stable durable-state reads
│   └── presentation/<context>-error-message.ts  # safe localized error mapping
└── apis/                                        # public action payloads + API options
```

Path ownership is strict:

| Concern                                                    | Owner                                 | Allowed dependencies                                                                                  |
| ---------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Route name, params, navigator, redirect, whole-screen gate | `src/app/**`                          | runtime facade, stable selectors, feature components, UI primitives                                   |
| Global providers and protected route selection             | `src/app-runtime/root-*.tsx`          | owning runtime modules, stable selectors, app-shell hooks                                             |
| One cohesive feature block                                 | `src/components/<context>/**`         | at most one relevant runtime hook, stable selectors/presentation adapters, router, UI primitives      |
| Reusable form interaction                                  | `src/components/<context>/*-form.tsx` | React Hook Form, one or more action hooks required by that form, presentation resolver, UI primitives |
| Generic visual/interaction building block                  | `src/components/ui/**`                | React Native, NativeWind, CVA, `cn`, other UI primitives                                              |
| Durable business truth or shared business read model       | `core/<context>/**`                   | the owning context and shared core contracts                                                          |
| Gateway/API/store construction and generated hook creation | `src/app-runtime/runtime/**`          | concrete core adapters and runtime configuration                                                      |

`src/app/**` and `src/components/**` never instantiate a gateway, call a gateway directly, create an RTK Query API, configure Redux, or import `src/app-runtime/runtime/**`. In those presentation paths, generated query/mutation hooks and any `appMode` access always come from `@/app-runtime/app-runtime`. Stable selectors and presentation error resolvers are deliberate read/presentation adapters and may be imported from `core/<context>/adapters/selectors/**` and `core/<context>/adapters/presentation/**`. Internal `src/app-runtime/**` composition may import its owning runtime module directly.

## Required and Conditional Files

For a screen that reads durable server-backed state, require:

- one route file under `src/app/**`;
- the generated query hook exported by `src/app-runtime/app-runtime.ts`;
- the owning RTK Query use case, gateway, and runtime wiring in `core/<context>/**` and `src/app-runtime/runtime/**`;
- an owning durable slice and stable selector when the result must survive the screen or drive another flow;
- localized loading, empty, error, and success copy used by the screen or section.

Add only when the responsibility exists:

- `src/components/<context>/<feature>-section.tsx` when a visual block owns cohesive reads, actions, or local navigation;
- `src/components/<context>/<feature>-form.tsx` for a real controlled form;
- `src/components/<context>/<entity>-card.tsx` when repeated feature rendering deserves a prop-driven component;
- `src/components/ui/<Primitive>.tsx` only when the primitive is business-agnostic and reused;
- `core/<context>/adapters/presentation/*` when fallible UI actions need safe localized error copy;
- a shared core read model only when it has stable business meaning across multiple consumers;
- a screen-local `useState` value for mounted display mechanics such as an expanded row, active step, or open sheet.

If a required generated hook is not exported from `@/app-runtime/app-runtime`, stop the UI slice and add that export through `frontend-core`; do not bypass the facade with a runtime-internal import.

## Ownership Decision

Use the first matching answer:

1. Does the value survive unmounting, synchronize with a server/SDK, drive routing or entitlement, or represent durable product truth? Put it in the owning `core/<context>/domain` state and expose a selector.
2. Does the behavior decide a business action, call an external capability, or update durable state? Put it in a core use case behind a gateway.
3. Does the code choose a route, gate a whole screen, or arrange major sections? Keep it in the route screen.
4. Does one feature block own the read, retry, formatting, or local navigation? Keep it in a feature section. It may call one relevant generated hook when the screen does not already own that request.
5. Is it a real form's field, validation, submit, or submission-message state? Keep it in the form component.
6. Is it reusable visual behavior with explicit props and no business vocabulary? Put it in `src/components/ui/`.
7. Is it temporary display state used by one mounted component? Keep it local to that component.

Do not create a screen model, Redux field, or core abstraction merely to move props one level.

## Canonical Data Flow

```text
route screen or owning feature section
  -> generated hook from @/app-runtime/app-runtime
  -> RTK Query endpoint builder in core/<context>/use-cases
  -> injected domain-oriented gateway
  -> typed Result converted to RTK Query fulfillment/rejection
  -> onQueryStarted awaits queryFulfilled
  -> owning context action updates Redux durable state
  -> stable selector derives the read
  -> route or feature section renders through prop-driven components
```

The hook owns request lifecycle (`isLoading`, `isFetching`, `isError`, retry, mutation loading). Redux owns durable product truth. Local component state owns ephemeral interaction mechanics. Never copy the same server result, loading flag, or transient request error into all three.

### Screen-owned request skeleton

Use this shape when the request gates most of the screen. The section reads the successfully hydrated durable state; it does not call the same hook again.

```tsx
// src/app/(<group>)/<feature>.tsx
import { use<VerbEntity>Query } from "@/app-runtime/app-runtime";
import { <Feature>Section } from "@/components/<context>/<feature>-section";
import { ScreenErrorState } from "@/components/ui/ScreenErrorState";
import { ScreenLoadingState } from "@/components/ui/ScreenLoadingState";
import { useTranslation } from "@/hooks/localization/useTranslation";

/** Gates and composes the <feature> screen. */
export default function <Feature>Screen() {
  const { t } = useTranslation();
  const { isError, isLoading, refetch } = use<VerbEntity>Query();

  /** Retries the screen-owned request. */
  function handleRetry() {
    void refetch();
  }

  if (isLoading) {
    return <ScreenLoadingState message={t("<translation-key>")} />;
  }

  if (isError) {
    return (
      <ScreenErrorState
        message={t("<translation-key>")}
        onRetry={handleRetry}
        retryLabel={t("<translation-key>")}
      />
    );
  }

  return <<Feature>Section />;
}
```

```tsx
// src/components/<context>/<feature>-section.tsx
import { View } from "react-native";

import { <Entity>Card } from "@/components/<context>/<entity>-card";
import { Text } from "@/components/ui/Text";
import { useSelector } from "@/hooks/redux-hooks";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { selectCurrent<Entity> } from "@core/<context>/adapters/selectors/<context>-selectors";

/** Renders the durable <entity> state owned by this feature block. */
export function <Feature>Section() {
  const { t } = useTranslation();
  const entity = useSelector(selectCurrent<Entity>);

  if (entity === null) {
    return (
      <View accessibilityLiveRegion="polite" className="gap-2">
        <Text variant="h2">{t("<translation-key>")}</Text>
        <Text variant="muted">{t("<translation-key>")}</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Text variant="h2">{t("<translation-key>")}</Text>
      <<Entity>Card entity={entity} />
    </View>
  );
}
```

The skeleton is structurally complete after replacing placeholders and adding every referenced translation key. `ScreenLoadingState` and `ScreenErrorState` are conditional local primitives: reuse an existing equivalent before creating them.

### Section-owned request

A feature section may call one relevant query or mutation hook when its loading/error state affects only that block. The screen then places the section without plumbing hook state through intermediate props. Do not call a hook in both the screen and section for the same ownership decision.

## State Placement Matrix

| State                                                      | Canonical owner             | Example                                     |
| ---------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| Session, account, entitlement, synchronized collection     | core Redux slice            | `auth.session`, `account.current`           |
| Request pending/failure/retry metadata                     | RTK Query hook              | `isLoading`, `isError`, `refetch`           |
| Form fields and client validation                          | React Hook Form in the form | email, password, field errors               |
| Submission copy for one mounted form                       | React Hook Form root error  | `setError("root", ...)`                     |
| Open sheet, focused row, expanded state, transient sort UI | local component state       | `isOpen`, `expandedId`                      |
| Stable cross-screen business derivation                    | core selector               | connected, premium, manageable subscription |
| Localized label/date/count formatting for one block        | owning section/card         | subtitle and display date                   |
| Theme and locale selection supplied globally               | provider/runtime            | localization and theme providers            |

## Invariants

- Data moves in one direction through hook, use case, gateway, RTK fulfillment, durable state, selector, and UI.
- Screens orchestrate; they do not become business services or durable stores.
- A feature section may be autonomous, but it owns only its cohesive block and at most one relevant request hook by default.
- Generic UI primitives are prop-driven, business-agnostic, and unaware of Redux, RTK Query, routing, gateways, and translation keys.
- Parent layouts own placement and inter-component spacing; children own only internal layout.
- Transient request failures remain in RTK Query; durable failure truth enters core state only when the product explicitly models it.
- User-visible copy is localized, and every state exposes accurate accessibility semantics.
- Routes/components import generated hooks and any `appMode` access from `@/app-runtime/app-runtime`; stable core selectors and presentation resolvers are the only direct core adapter reads expected there. Internal `src/app-runtime/**` composition may import its owning runtime directly.

## Anti-Patterns

- Importing `@/app-runtime/runtime/<context>-runtime`, a concrete gateway, API instance, slice action, or store into a route/component.
- Calling a gateway or `createApi()` from the UI.
- Copying query data into component state or mirroring `isLoading`/`error` in Redux.
- Putting modal visibility, input text, selected tabs, focus, or animation progress in a domain slice.
- Calling the same query hook in a screen and multiple children after the screen owns the gate.
- Passing a large `data`, `payload`, `screenModel`, or callback bundle through several layers.
- Moving visual labels, spacing, or one-block formatting into core selectors.
- Letting a generic primitive import product entities, translation keys, router hooks, or selectors.
- Displaying raw transport, SDK, backend, or exception messages.

## Validation and Review Checklist

- [ ] Requested behavior and accepted, non-superseded repository decisions remain normative; a nearby example does not silently override them.
- [ ] Behavioral review or tests were designed independently from the request and accepted decisions, not reverse-engineered from the implementation output.
- [ ] Every file is in the path owned by its responsibility.
- [ ] Every generated hook used by `src/app/**` or `src/components/**` is imported from `@/app-runtime/app-runtime`; internal runtime composition is not forced through that facade.
- [ ] No route or component constructs or imports runtime internals, gateways, APIs, or the store.
- [ ] Durable, request-lifecycle, form, and ephemeral display state each have exactly one owner.
- [ ] `onQueryStarted` updates durable Redux state only after `queryFulfilled` succeeds.
- [ ] The rendering path reads durable data through a stable selector.
- [ ] The hook is owned by either the screen or one section, without duplicate orchestration.
- [ ] Generic primitives are prop-driven and contain no business vocabulary.
- [ ] Loading, empty, success, failure, disabled, and retry states are handled where relevant.
- [ ] Visible copy is translated and accessibility roles, names, states, and live updates are accurate.
- [ ] Typecheck and relevant lint pass; targeted `pnpm exec oxfmt <changed-files> --check` passes, and global `pnpm run format:check` was run with unrelated baseline failures reported rather than repaired out of scope.
