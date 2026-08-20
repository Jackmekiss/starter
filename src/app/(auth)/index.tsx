import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginForm } from "@/components/auth/login-form";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

/**
 * Initial authentication route rendered before concrete auth forms are added.
 */
export default function AuthIndexScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "bottom", "left", "right"]}
    >
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
});
