import * as React from "react";
import { Platform, View } from "react-native";
import { styled } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginForm } from "@/components/auth/login-form";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

import type { ScrollViewProps } from "react-native";

/** Minimal surface exposed by the local NativeWind adapter. */
type KeyboardAwareScrollViewAdapterProps = Pick<
  ScrollViewProps,
  | "children"
  | "contentContainerStyle"
  | "keyboardDismissMode"
  | "keyboardShouldPersistTaps"
  | "showsVerticalScrollIndicator"
  | "style"
> & {
  bottomOffset?: number;
};

/** Forwards supported scroll props to the third-party keyboard-aware view. */
function KeyboardAwareScrollViewAdapter(
  props: KeyboardAwareScrollViewAdapterProps,
) {
  return <KeyboardAwareScrollView {...props} />;
}

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollViewAdapter, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

/**
 * Initial authentication route rendered before concrete auth forms are added.
 */
export default function AuthIndexScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView
      className="bg-background flex-1"
      edges={["top", "bottom", "left", "right"]}
    >
      <StyledKeyboardAwareScrollView
        bottomOffset={24}
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
      </StyledKeyboardAwareScrollView>
    </SafeAreaView>
  );
}
