# Frozen Blueprint: React Native Storybook

> Blueprint version: `1.0.3`

Use this reference when installing, configuring, extending, or validating Storybook for Starter. Direct Storybook is a presentation-only entry point for the same local components, CSS tokens, fonts, themes, localization, and overlay hosts used by the application. Starter also supports an explicit Fifteen-style in-app development route selected with `EXPO_PUBLIC_STORYBOOK_ENABLED=true`.

Follow the installed Storybook types and the official React Native Storybook entry-point-swapping workflow. The pinned versions below form one known-compatible set for Starter's Expo 57 / React Native 0.86 baseline; update them only as one tested compatibility decision.

## Canonical Tree

```text
.rnstorybook/
├── index.tsx                    # alternate Storybook view entry
├── storybook-root.tsx            # reusable Storybook UI for both launch modes
├── main.ts                     # story discovery + device addons
├── preview.tsx                 # presentation-only decorators and globals
└── storybook.requires.ts       # generated, tracked, never hand-edited

src/components/
└── **/*.stories.tsx            # co-located presentation stories

src/app/storybook.tsx            # development-only in-app Storybook route

metro.config.js                 # withStorybook(withNativewind(config))
package.json                    # Storybook scripts and compatible versions
tsconfig.json                   # includes .rnstorybook for typecheck
.oxlintrc.json                  # ignores generated registry only
.oxfmtrc.json                   # ignores generated registry only
eslint.config.mjs               # ignores generated registry only
```

Discover only `../src/components/**/*.stories.?(ts|tsx)` by default. Broaden this glob only when a different presentation-owned directory truly contains stories.

## Compatible Package Set

Pin this set together:

| Package                                  | Version  |
| ---------------------------------------- | -------- |
| `storybook`                              | `10.4.6` |
| `@storybook/react-native`                | `10.4.7` |
| `@storybook/addon-ondevice-actions`      | `10.4.7` |
| `@storybook/addon-ondevice-controls`     | `10.4.7` |
| `@react-native-community/datetimepicker` | `9.1.0`  |
| `@react-native-community/slider`         | `5.2.0`  |

The community date/slider packages satisfy native controls used by the on-device addons and must remain Expo-compatible. Do not add an addon that has no demonstrated story workflow.

## Launch Modes

The application keeps its normal Expo Router entry. `@storybook/react-native/withStorybook` swaps the Metro entry when `STORYBOOK_ENABLED=true` for the isolated direct mode.

Preserve the existing Metro configuration, then compose wrappers in this order:

```js
const { withStorybook } = require("@storybook/react-native/withStorybook");

const nativewindConfig = withNativewind(config);

module.exports = withStorybook(nativewindConfig, {
  configPath: "./.rnstorybook",
});
```

Keep `.rnstorybook/index.tsx` limited to `registerRootComponent(StorybookRoot)`. It must import its reusable root from `storybook-root.tsx`, never the Expo route.

For the accepted Fifteen-style in-app mode, `pnpm run storybook:in-app` sets `EXPO_PUBLIC_STORYBOOK_ENABLED=true`. A guarded root `storybook` screen then renders `.rnstorybook/storybook-root.tsx`, and Home renders a localized floating launcher with `testID="home.storybook"`. This route is unavailable without the flag. The mode deliberately includes Storybook with the application bundle, so it is development-only and cannot be described as isolated.

## Scripts

`package.json` owns:

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true expo start",
    "storybook:android": "STORYBOOK_ENABLED=true expo start --android",
    "storybook:generate": "sb-rn-get-stories --config-path ./.rnstorybook",
    "storybook:in-app": "EXPO_PUBLIC_STORYBOOK_ENABLED=true expo start",
    "storybook:ios": "STORYBOOK_ENABLED=true expo start --ios"
  }
}
```

Run registry generation whenever a story is added, removed, renamed, or its discovery glob changes. Track the generated registry so a fresh checkout can typecheck and launch without requiring an undocumented pre-step.

## Story Discovery

`.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["../src/components/**/*.stories.?(ts|tsx)"],
  deviceAddons: [
    "@storybook/addon-ondevice-actions",
    "@storybook/addon-ondevice-controls",
  ],
  features: {
    ondeviceBackgrounds: true,
  },
};

export default main;
```

Use the on-device backgrounds feature as the theme selector. Do not add a second custom toolbar for the same light/dark responsibility.

## Reusable Root and Alternate Entry

`.rnstorybook/storybook-root.tsx` owns `view.getStorybookUI(...)`; `.rnstorybook/index.tsx` registers that root:

```tsx
import { registerRootComponent } from "expo";

import StorybookRoot from "./storybook-root";

registerRootComponent(StorybookRoot);
```

AsyncStorage persists the on-device Storybook selection. Because this swapped file is a custom Expo entry point, it must call Expo's `registerRootComponent`: that helper registers `main` natively and runs the React Native Web application against the exported `#root`. A bare `export default` belongs to the in-app integration mode, and `AppRegistry.registerComponent` alone leaves a static Expo web export blank. This entry must not import Expo Router, `RootAppProviders`, Redux, the store, persistor, APIs, gateways, listeners, or `app-runtime`.

## Presentation-Only Preview

`preview.tsx` imports `@/global.css` because the Expo Router layout is bypassed. Its provider tree contains only presentation requirements:

```text
SafeAreaProvider
└── GestureHandlerRootView (flex: 1)
    └── LocalizationProvider
        └── ThemeProvider(NAV_THEME[colorScheme])
            └── BottomSheetModalProvider
                └── ToastProvider
                    └── themed story canvas
```

Do not mount Redux, `PersistGate`, runtime listeners, gateways, APIs, or a fake business runtime. A component that cannot render without those dependencies belongs in a feature/integration harness or must receive presentation-ready props.

### Theme and background bridge

Map Storybook's background global to `"light" | "dark"` and select `NAV_THEME[colorScheme]`. Imperatively styled adapters consume that provider through `useTheme()`. Native also sets/restores `Appearance` so NativeWind follows the selection; web sets/restores `data-color-scheme` on `document.documentElement` because React Native Web does not implement `Appearance.setColorScheme`.

```tsx
import { ThemeProvider } from "expo-router/react-navigation";
import { useEffect } from "react";
import { Appearance, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
import { BottomSheetModalProvider } from "@/components/ui/BottomSheetModal";
import { ToastProvider } from "@/components/ui/Toast";
import { NAV_THEME, THEME } from "@/constants/theme";
import { LocalizationProvider } from "@/localization/localization-provider";

import type { Preview } from "@storybook/react-native";
import type { PropsWithChildren } from "react";
import type { AppColorScheme } from "@/constants/theme";

interface StorybookProvidersProps extends PropsWithChildren {
  colorScheme: AppColorScheme;
}

function resolveStorybookColorScheme(backgrounds: unknown): AppColorScheme {
  if (
    backgrounds === null ||
    typeof backgrounds !== "object" ||
    !("value" in backgrounds)
  ) {
    return "light";
  }

  return backgrounds.value === "dark" ? "dark" : "light";
}

function StorybookProviders({
  children,
  colorScheme,
}: StorybookProvidersProps) {
  useEffect(() => {
    if (Platform.OS === "web") {
      const root = globalThis.document?.documentElement;
      const previousColorScheme = root?.getAttribute("data-color-scheme");
      root?.setAttribute("data-color-scheme", colorScheme);

      return () => {
        if (previousColorScheme === null) {
          root?.removeAttribute("data-color-scheme");
          return;
        }

        root?.setAttribute("data-color-scheme", previousColorScheme);
      };
    }

    const previousColorScheme = Appearance.getColorScheme() ?? "unspecified";
    Appearance.setColorScheme(colorScheme);

    return () => {
      Appearance.setColorScheme(previousColorScheme);
    };
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <LocalizationProvider>
          <ThemeProvider value={NAV_THEME[colorScheme]}>
            <BottomSheetModalProvider>
              <ToastProvider>
                <View className="bg-background flex-1 p-6">{children}</View>
              </ToastProvider>
            </BottomSheetModalProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <StorybookProviders
        colorScheme={resolveStorybookColorScheme(context.globals.backgrounds)}
      >
        <Story />
      </StorybookProviders>
    ),
  ],
  initialGlobals: {
    backgrounds: { value: "light" },
  },
  parameters: {
    backgrounds: {
      options: {
        dark: { name: "Dark", value: THEME.dark.background },
        light: { name: "Light", value: THEME.light.background },
      },
    },
  },
};

export default preview;
```

Keep the preview focused. Localization and theme must remain ancestors of the local bottom-sheet provider because Gorhom's host re-renders stored portal nodes at the provider boundary instead of preserving contexts mounted below it. Add another provider only when a shared presentation primitive genuinely requires it and the application also mounts the corresponding provider.

The preview's `@/global.css` import loads Starter's eight face-specific Poppins `@font-face` declarations from the versioned `/fonts/Poppins-*.ttf` public assets. Native registration points the Expo font plugin at those same PostScript-named files. Do not create a Storybook-only font loader or font mapping, and do not reference font URLs inside `node_modules` from CSS.

## Story Anatomy

Stories are component contracts, not screenshots of a feature screen. Co-locate them beside the shared primitive:

```tsx
import { View } from "react-native";

import { <Primitive> } from "@/components/ui/<Primitive>";
import { Text } from "@/components/ui/Text";

import type { Meta, StoryObj } from "@storybook/react-native";

const meta = {
  title: "UI/<Primitive>",
  component: <Primitive>,
  args: {
    children: <Text><representative-copy></Text>,
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-md">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof <Primitive>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <View className="gap-3">
      {/* Render the finite meaningful variants with representative content. */}
    </View>
  ),
};
```

Use args/controls for public scalar props. Use a small local story harness with `useState` when the component is controlled; do not weaken the production API for Storybook.

### Coverage

Cover observable contracts rather than every Cartesian-product permutation:

- default composition;
- meaningful actions/tones/variants;
- all sizes when sizing is part of the public API;
- disabled, invalid, checked/indeterminate, busy, open, or progress states that apply;
- icon/compound composition;
- long and wrapping copy;
- interactive controlled behavior where applicable;
- light and dark through the global background control, not duplicate story files.

Camera, bottom-sheet, toast, and phone input stories may use local presentation-only harnesses and device-safe mock props. They must not request real business data. If a native capability cannot run in a web export, keep its module bundle-safe and validate the real interaction on its supported device.

## Generated Registry and Tooling Ignores

`storybook.requires.ts` is generated by `sb-rn-get-stories`. Never edit, reformat, or lint-fix it manually.

- include `.rnstorybook/**/*.ts(x)` in TypeScript so generated imports and stories remain checked;
- ignore only `.rnstorybook/storybook.requires.ts` in ESLint, Oxlint, and Oxfmt;
- keep `main.ts`, `preview.tsx`, `index.tsx`, and every story formatted and linted normally;
- regenerate after story discovery changes and review that the expected imports appear.

Do not blanket-ignore `.rnstorybook` or `*.stories.tsx`.

When dependencies are unavailable and installing them is outside the task, do not let `pnpm exec` trigger a network install. Perform a static review of the story metadata, discovery glob, imports, tokens, and forbidden boundaries; leave registry generation, typecheck, lint, and bundle validation explicitly pending. Never hand-edit the registry or claim an unavailable check passed.

## Invariants

- Direct Storybook is selected through the official Metro entry-point swap; the explicit in-app mode uses the guarded `/storybook` route.
- The swapped Expo entry calls `registerRootComponent`; it is not a component export or a bare AppRegistry registration.
- The default application mode does not expose the Storybook launcher or route. The explicit in-app development mode intentionally includes Storybook in its app bundle.
- The preview uses the real global CSS, eight versioned Poppins assets, semantic theme, localization provider, navigation theme, safe-area/gesture, the local composite bottom-sheet provider (portal plus accessibility guard), and toast config.
- The preview contains no core/runtime state or data adapters.
- Light/dark background choice drives `NAV_THEME` and `useTheme()` consumers, native `Appearance`, and the web root `data-color-scheme` attribute without leaking state after decorator cleanup.
- Stories are co-located, presentation-ready, accessible, and exercise public contracts.
- The generated registry is tracked and exempted only from format/lint tools.
- Storybook package versions move as one Expo-compatible set after validation.

## Anti-Patterns

- An unconditional Storybook route or Home launcher that bypasses `EXPO_PUBLIC_STORYBOOK_ENABLED`.
- Importing `RootAppProviders`, Redux, `PersistGate`, store, APIs, gateways, listeners, or runtime internals into Storybook.
- A Storybook-only palette, font loader, component implementation, toast surface, or localization copy.
- Calling `Appearance.setColorScheme` on web instead of using the guarded root data attribute.
- Global mocking of business infrastructure merely to render a shared primitive.
- Manual edits to `storybook.requires.ts` or blanket tooling ignores.
- Stories that assert internal class strings, duplicate every permutation, contain production business fixtures, or silently skip accessibility states.
- Adding a second UI runtime or provider only to render component stories.
- Leaving a long-running Storybook server as the only automated validation.

## Validation

After a Storybook or shared primitive change:

1. Run `pnpm run storybook:generate` and inspect the generated registry diff.
2. Run targeted Oxfmt for hand-authored changed files; the generated registry remains ignored.
3. Run repository typecheck and lint so stories and preview are compiled.
4. Build an isolated bundle without a long-running server:

   ```sh
   STORYBOOK_ENABLED=true pnpm exec expo export --platform web --output-dir <temporary-output-directory>
   ```

   Confirm the export contains all eight Poppins TTF assets under `fonts` and emitted no unresolved/local-resource CSS warning. Serve the export and verify that Storybook mounts a non-empty React root; a successful bundle alone does not prove that a swapped Expo entry was registered and executed.

5. Launch `pnpm run storybook:ios` or `pnpm run storybook:android` when the change depends on native interaction, gestures, camera permission, bottom sheets, or vendor controls.
6. Review light/dark backgrounds on web and native, including explicit light on a dark-system browser and cleanup of the root attribute/Appearance preference. Also review Poppins, token contrast, safe-area layout, actions/controls, touch interaction, accessible names/roles/states, long copy, and overlays.

A web-export limitation in a truly native capability does not justify importing app runtime state or hiding the story from typecheck. Keep the module bundle-safe, document the supported-device check, and verify it on device.

## Independent Forward Validation

When this blueprint changes, give an independent evaluator this skill and a realistic request for a new shared primitive with a story in an isolated temporary workspace. Do not supply the current app implementation, expected diff, or a prescribed story. Evaluate entry isolation, provider boundaries, co-location, story anatomy, token reuse, accessibility, registry generation, and validation behavior. If font/theme infrastructure is in scope, verify the isolated web export contains all eight Poppins assets with no unresolved/local-resource CSS warning, explicit web light/dark uses and restores the root data attribute, and native uses and restores `Appearance`. Correct only gaps demonstrated by the resulting artifact.
