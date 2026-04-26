import { Stack } from "expo-router";

function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default OnboardingLayout;
