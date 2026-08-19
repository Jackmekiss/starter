import * as React from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

/**
 * Initial authentication route rendered before concrete auth forms are added.
 */
export default function AuthIndexScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <Text variant="h1">{t("auth__welcome__title")}</Text>
      <Text className="text-center" variant="muted">
        {t("auth__welcome__description")}
      </Text>
    </View>
  );
}
