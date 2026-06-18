import { Tabs } from "expo-router";

/** Tab navigator for authenticated application sections. */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
