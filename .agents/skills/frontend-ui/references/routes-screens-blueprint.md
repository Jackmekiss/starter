# Routes and Screens Blueprint

> Blueprint version: `1.0.1`

Use this frozen blueprint for Expo Router files, route groups, root providers, protected navigation, screen-level requests, and screen composition. Adapt the Markdown skeletons; do not install or generate a second router structure.

## Placeholders

- `<group>` / `<Group>`: URL-less route group and its PascalCase component stem
- `<feature>` / `<Feature>`: route and screen name
- `<context>` / `<Context>`: owning bounded context
- `<verbEntity>` / `<VerbEntity>`: generated query hook stem
- `<param>`: route parameter such as `accountId`
- `<translation-key>`: typed key present in every locale catalog

Replace every placeholder, route name, import, and translation key together. Route filenames remain lowercase; existing shared primitive filenames retain the Starter's current casing.

## Canonical Path Ownership

```text
src/
├── app/
│   ├── _layout.tsx                    # Expo entry; global shell only
│   ├── (auth)/
│   │   ├── _layout.tsx                # unauthenticated Stack
│   │   └── index.tsx                  # sign-in entry screen
│   ├── (on-boarding)/
│   │   ├── _layout.tsx                # onboarding Stack
│   │   └── index.tsx                  # onboarding entry screen
│   └── (tabs)/
│       ├── _layout.tsx                # authenticated Tabs
│       ├── index.tsx                  # default-tab Redirect
│       └── (home)/
│           ├── _layout.tsx            # home Stack
│           ├── index.tsx              # home screen
│           └── <feature>.tsx           # conditional sibling screen
├── app-runtime/
│   ├── app-runtime.ts                 # public generated hooks and appMode
│   ├── root-app-providers.tsx         # Redux, safe area, gestures, persistence, i18n, theme
│   └── root-navigator.tsx             # protected route-group selection
├── hooks/app-shell/
│   └── useAppReadiness.ts             # splash dismissal after bootstrap
└── components/<context>/              # screen sections/forms; no route files
```

Ownership rules:

- `src/app/_layout.tsx` composes the already-built root providers and navigator. It does not create gateways, APIs, or a store.
- A group `_layout.tsx` declares only that group's `Stack` or `Tabs` and screen options.
- A route screen owns route params, whole-screen loading/error/empty gates, navigation, safe-area/scroll framing, and major section order.
- Feature sections and forms live under `src/components/<context>/`; they do not become route files just to avoid props.
- `src/app-runtime/root-navigator.tsx` is the one durable auth/onboarding route guard. As internal composition, it may import the owning context runtime directly. Screens do not reproduce its guards with effects and redirects.

## Required and Conditional Files

The canonical Starter shell requires:

- `src/app/_layout.tsx`;
- `src/app-runtime/root-app-providers.tsx`;
- `src/app-runtime/root-navigator.tsx`;
- `src/hooks/app-shell/useAppReadiness.ts`;
- one `_layout.tsx` for each mounted route group;
- one `index.tsx` entry route for each group;
- a public facade export in `src/app-runtime/app-runtime.ts` for every generated hook a screen consumes.

Add only when needed:

- `<feature>.tsx` for a named static route;
- `[<param>].tsx` for a required dynamic segment;
- `[...<param>].tsx` for a deliberate catch-all;
- another nested route group when it changes navigator or organizational behavior, not merely file tidiness;
- a modal group/screen when navigation presentation must be modal;
- `+not-found.tsx` when the product defines an in-app unknown-route experience;
- `src/components/ui/ScreenLoadingState.tsx`, `ScreenErrorState.tsx`, or `ScreenEmptyState.tsx` only after repeated state presentation justifies reusable primitives.

Do not add a route registry, custom navigator wrapper, or parallel navigation service around Expo Router. If a required generated hook is absent from `@/app-runtime/app-runtime`, make that facade export a `frontend-core` prerequisite instead of importing `@/app-runtime/runtime/**`.

## Root App Layout

Keep the Expo root route small and deterministic:

```tsx
// src/app/_layout.tsx
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";

import "@/global.css";
import { RootAppProviders } from "@/app-runtime/root-app-providers";
import { RootNavigator } from "@/app-runtime/root-navigator";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
});

// Expo Router requires this export name exactly; it cannot be camelCased.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
  initialRouteName: "/(auth)/index",
};

/**
 * Root app layout that wires providers, navigation, status bar, and toasts.
 */
export default function AppLayout() {
  return (
    <KeyboardProvider
      navigationBarTranslucent
      preserveEdgeToEdge
      statusBarTranslucent
    >
      <RootAppProviders>
        <RootNavigator />
        <StatusBar />
        <Toast />
      </RootAppProviders>
    </KeyboardProvider>
  );
}
```

Module-level splash setup is an Expo lifecycle requirement, not business orchestration. Keep feature initialization out of this file.

## Root Providers

Global providers belong in one composition component. Preserve the Starter's provider ordering unless a dependency requires a documented change.

```tsx
// src/app-runtime/root-app-providers.tsx
import { ThemeProvider } from "expo-router/react-navigation";
import { type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "@/app-runtime/runtime/store-runtime";
import { BottomSheetModalProvider } from "@/components/ui/BottomSheetModal";
import { NAV_THEME, resolveAppColorScheme } from "@/constants/theme";
import { LocalizationProvider } from "@/localization/localization-provider";

/**
 * Props for the RootAppProviders component.
 */
type RootAppProvidersProps = PropsWithChildren;

/**
 * Composes global runtime providers required by every route.
 */
export function RootAppProviders({ children }: RootAppProvidersProps) {
  const colorScheme = resolveAppColorScheme(useColorScheme());

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1">
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider>
              <ThemeProvider value={NAV_THEME[colorScheme]}>
                <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
              </ThemeProvider>
            </LocalizationProvider>
          </PersistGate>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
```

`RootAppProviders` is runtime composition, so its internal store import is allowed. Keep localization and theme outside the local bottom-sheet provider: Gorhom's host renders stored portal nodes at that boundary, so providers mounted below it do not reach sheet content. Presentation routes and components still consume generated hooks only through the public facade.

## Protected Root Navigator

Route guards derive from durable selectors. Because `RootNavigator` is internal `src/app-runtime/**` composition, its bootstrap hook comes directly from the owning runtime module; the public facade rule applies to routes and components.

```tsx
// src/app-runtime/root-navigator.tsx
import { Stack } from "expo-router";

import { useRetrieveAccountQuery } from "@/app-runtime/runtime/auth-runtime";
import { useAppReadiness } from "@/hooks/app-shell/useAppReadiness";
import { useSelector } from "@/hooks/redux-hooks";
import {
  selectCurrentAccount,
  selectIsConnected,
} from "@core/auth/adapters/selectors/auth-selectors";

/**
 * Chooses the active route group from session and onboarding state.
 */
export function RootNavigator() {
  const account = useSelector(selectCurrentAccount);
  const isConnected = useSelector(selectIsConnected);
  const { isLoading: isRetrievingAccount } = useRetrieveAccountQuery(
    undefined,
    {
      skip: !isConnected,
      refetchOnMountOrArgChange: true,
    },
  );

  useAppReadiness(isRetrievingAccount);

  const shouldCompleteOnboarding =
    isConnected && account !== null && account.onboardingStatus !== "completed";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isConnected}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isConnected && !shouldCompleteOnboarding}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={isConnected && shouldCompleteOnboarding}>
        <Stack.Screen name="(on-boarding)" />
      </Stack.Protected>
    </Stack>
  );
}
```

The guards must remain mutually exclusive. Any changed bootstrap-error or unknown-account behavior is a product/navigation decision; do not invent it while adding an unrelated screen.

## Group Layouts

Declare the navigator and registered children, with no fetch or business decision:

```tsx
// src/app/(<group>)/_layout.tsx
import { Stack } from "expo-router";

/** Navigation shell for the <group> flow. */
export default function <Group>Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="<feature>" />
    </Stack>
  );
}
```

For the authenticated tab shell, use `Tabs` at the group that truly owns tab navigation. Keep the default redirect explicit:

```tsx
// src/app/(tabs)/index.tsx
import { Redirect } from "expo-router";

/** Redirects the tab root to the default home tab. */
export default function TabsIndexScreen() {
  return <Redirect href="/(tabs)/(home)" />;
}
```

Route groups do not add a URL segment. `index.tsx` is the directory's default route; `_layout.tsx` is never a screen. Keep route names aligned with the filesystem rather than duplicating them in a constant registry.

## Screen Orchestration Skeleton

Use a screen-owned query when its result gates the whole screen. Keep state copy localized and semantics explicit.

```tsx
// src/app/(<group>)/<feature>.tsx
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { use<VerbEntity>Query } from "@/app-runtime/app-runtime";
import { <Feature>Section } from "@/components/<context>/<feature>-section";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

/** Orchestrates the <feature> screen request and feature sections. */
export default function <Feature>Screen() {
  const { t } = useTranslation();
  const { isError, isLoading, refetch } = use<VerbEntity>Query();

  /** Retries the screen-owned request. */
  function handleRetry() {
    void refetch();
  }

  if (isLoading) {
    return (
      <SafeAreaView
        className="bg-background flex-1"
        edges={["top", "bottom", "left", "right"]}
      >
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole="progressbar"
          className="flex-1 items-center justify-center px-6"
        >
          <Text>{t("<translation-key>")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        className="bg-background flex-1"
        edges={["top", "bottom", "left", "right"]}
      >
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text accessibilityRole="alert" className="text-center">
            {t("<translation-key>")}
          </Text>
          <Button onPress={handleRetry}>
            <Text>{t("<translation-key>")}</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "bottom", "left", "right"]}
    >
      <View className="flex-1 gap-6 px-6 py-4">
        <Text variant="h1">{t("<translation-key>")}</Text>
        <<Feature>Section />
      </View>
    </SafeAreaView>
  );
}
```

If the screen scrolls or contains form inputs, use the existing keyboard-aware third-party adapter pattern from the auth route: define a narrow local prop adapter, map `className`/`contentContainerClassName` with NativeWind v5 `styled()`, set `keyboardShouldPersistTaps`, and preserve safe-area edges. Do not hide a keyboard/layout workaround inside a generic business section.

### Empty and refresh states

- Gate `isLoading` only for the initial request that prevents meaningful rendering.
- During background `isFetching`, preserve successful content and expose an accurate refresh state instead of replacing the screen.
- Derive empty state from the canonical selector after a successful request, not from `!data` while a request is pending.
- Keep retry next to the failed request owner.
- A section-specific request handles its own states and does not block unrelated sections.

## Dynamic Route Parameters

Expo parameters are untrusted presentation input. Normalize multiplicity in the route, then pass the canonical identifier to a public hook/use case; business validation remains in core.

```tsx
import { useLocalSearchParams } from "expo-router";

/** Resolves and renders one <feature> detail route. */
export default function <Feature>DetailScreen() {
  const params = useLocalSearchParams<{
    <param>?: string | string[];
  }>();
  const <param> = Array.isArray(params.<param>)
    ? params.<param>[0]
    : params.<param>;
  const query = use<VerbEntity>Query(
    { <param>: <param> ?? "" },
    { skip: !<param> },
  );

  // Render an accessible invalid-route state when <param> is absent,
  // then loading/error/empty/success from query and durable selectors.
}
```

Never call a hook conditionally. Do not decode transport payloads or fetch directly from a route parameter.

## Screen and Section Boundary

The screen should usually read like a short ordered outline:

```tsx
return (
  <ScreenFrame>
    <<Feature>Header />
    <<Feature>SummarySection />
    <<Feature>ActionsSection />
  </ScreenFrame>
);
```

Let a feature section call one relevant hook, selector, or local router action when that behavior is used only by the section. Keep the query in the screen when it gates several sections. Local primitives remain prop-driven and never navigate.

## Accessibility and Automation Semantics

- Give each screen one clear heading hierarchy; the shared `Text` heading variants already map roles and levels.
- Give icon-only navigation controls an explicit localized `accessibilityLabel` and accurate `accessibilityRole`.
- Expose `busy`, `disabled`, `selected`, `expanded`, and modal state when applicable.
- Announce newly rendered loading, error, and empty status without nesting duplicate accessible text under one redundant accessible parent.
- Preserve visible text as the automation-facing name when possible; add stable test identifiers only when the automation contract requires them.
- Keep hidden/inactive route content out of the accessibility tree rather than visually hiding an interactive screen.
- Respect safe areas, dynamic text, keyboard focus, and platform back behavior.

## Invariants

- Expo Router's filesystem is the route source of truth.
- The root layout composes; `RootAppProviders` provides; `RootNavigator` guards.
- Protected groups derive from durable selectors and remain mutually exclusive.
- Routes and components import generated query/mutation hooks and any `appMode` access from `@/app-runtime/app-runtime`; internal `src/app-runtime/**` composition may import its owning runtime directly.
- A route owns whole-screen states and major section order, not domain behavior or infrastructure.
- A screen or its one owning section fetches; descendants do not repeat the same orchestration.
- Loading, empty, failure, retry, background refresh, and success are distinct states.
- Navigation and status semantics remain usable with VoiceOver, TalkBack, keyboard, and native automation.

## Anti-Patterns

- Creating a gateway, RTK Query API, Redux store, or external client in `_layout.tsx` or a screen.
- Importing generated hooks from `@/app-runtime/runtime/**` or core use-case builders in `src/app/**` or `src/components/**`.
- Mirroring auth/onboarding route guards in screen effects or imperative `router.replace()` loops.
- Fetching in a group `_layout.tsx` when only one child needs the data.
- Putting feature sections in `src/app/` or route files in `src/components/`.
- Using route groups solely as visual folders while adding needless navigator layers.
- Replacing successful content with a full loading screen during every background refetch.
- Conditional hook calls after checking a route parameter.
- Large screens containing cards, forms, formatting helpers, and domain decisions inline.
- Raw user-visible strings, inaccessible icon-only controls, or stale accessibility state.

## Validation and Review Checklist

- [ ] Requested navigation behavior and accepted, non-superseded repository decisions remain normative over incidental current implementation details.
- [ ] Route and screen expectations were forward-tested independently from requested behavior and accepted decisions, never copied from the implementation output.
- [ ] Route paths, group names, `index.tsx`, and `_layout.tsx` match Expo Router conventions.
- [ ] `AppLayout`, `RootAppProviders`, and `RootNavigator` retain their separate responsibilities.
- [ ] Protected guards are mutually exclusive for disconnected, connected/onboarded, and connected/incomplete states.
- [ ] Every route/component generated-hook import uses `@/app-runtime/app-runtime`; internal root composition imports the owning runtime directly.
- [ ] The hook owner handles initial loading, background refresh, empty, error, retry, and success as applicable.
- [ ] Route params are normalized without conditional hooks or infrastructure parsing.
- [ ] The screen is primarily gates, navigation, framing, and ordered section composition.
- [ ] Safe areas, keyboard behavior, platform back behavior, and scroll containment are correct.
- [ ] Headings, control names/roles/states, live announcements, and automation exposure are accurate.
- [ ] Light/dark styling uses semantic tokens and no route-specific hard-coded palette.
- [ ] Typecheck and relevant lint pass; targeted `pnpm exec oxfmt <changed-files> --check` passes, and global `pnpm run format:check` was run with unrelated baseline failures reported rather than repaired out of scope.
