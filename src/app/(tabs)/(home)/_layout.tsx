import { Stack } from "expo-router";

/**
 * Stack shell for the main home tab.
 */
export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
