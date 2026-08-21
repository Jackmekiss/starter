import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, ButtonIcon } from "@/components/ui/Button";
import { useTranslation } from "@/hooks/localization/useTranslation";

const STORYBOOK_ROUTE_ENABLED =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

/**
 * Main home screen reached after authentication and onboarding.
 */
function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  /** Opens the development-only Storybook route. */
  function handleStorybookPress() {
    router.push("/storybook");
  }

  return (
    <SafeAreaView className="bg-background flex-1" edges={["top"]}>
      <View className="flex-1 items-end px-4 pt-4">
        {STORYBOOK_ROUTE_ENABLED ? (
          <Button
            accessibilityLabel={t("home__storybook__open")}
            className="bg-background border-border size-10 rounded-full border p-0 shadow-sm"
            onPress={handleStorybookPress}
            size="icon"
            testID="home.storybook"
            variant="link"
          >
            <ButtonIcon as={BookOpen} className="text-foreground" />
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export default Home;
