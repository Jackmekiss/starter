import { Stack } from "expo-router";

/**
 * Navigation shell for unauthenticated account access screens.
 */
function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default AuthLayout;
