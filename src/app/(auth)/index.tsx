import * as React from "react";
import { View } from "react-native";

import { LoginForm } from "@/components/auth/login-form";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

/**
 * Initial authentication route rendered before concrete auth forms are added.
 */
export default function AuthIndexScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center px-6">
      <View className="gap-8 self-stretch">
        <View className="gap-3">
          <Text variant="h1">{t("auth__welcome__title")}</Text>
          <Text className="text-center" variant="muted">
            {t("auth__welcome__description")}
          </Text>
        </View>
        <LoginForm />
      </View>
    </View>
  );
}
