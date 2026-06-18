import { Redirect } from "expo-router";

/**
 * Redirects the tab root to the default home tab.
 */
function Index() {
  return <Redirect href="/(tabs)/(home)" />;
}

export default Index;
