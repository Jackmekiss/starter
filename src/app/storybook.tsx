import { Redirect } from "expo-router";

import type { ComponentType } from "react";

const STORYBOOK_ROUTE_ENABLED =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

/** Lazily includes Storybook only in the explicit in-app development mode. */
const StorybookRoot: ComponentType | null = STORYBOOK_ROUTE_ENABLED
  ? require("../../.rnstorybook/storybook-root").default
  : null;

/** Renders the in-app Storybook route selected from the development Home screen. */
export default function StorybookScreen() {
  if (StorybookRoot === null) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return <StorybookRoot />;
}
