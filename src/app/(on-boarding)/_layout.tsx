import { Stack } from "expo-router";

/**
 * Navigation shell for onboarding completion screens.
 */
function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default OnboardingLayout;
