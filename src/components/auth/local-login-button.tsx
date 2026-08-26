import * as React from "react";
import { View } from "react-native";

import { useLoginMutation } from "@/app-runtime/app-runtime";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { resolveAuthErrorMessage } from "@core/auth/adapters/presentation/auth-error-message";

/** Connects the deterministic local identity without asking for credentials. */
export function LocalLoginButton() {
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = React.useState<string>();

  /** Signs in through the configured non-real auth adapter. */
  async function handlePressLogin() {
    setErrorMessage(undefined);

    try {
      await login({
        email: "user@example.com",
        password: "password",
      }).unwrap();
    } catch (error) {
      setErrorMessage(
        resolveAuthErrorMessage(error, t, {
          action: "login",
          fallbackMessage: t("auth__login__error__unexpected"),
        }),
      );
    }
  }

  return (
    <View className="gap-3">
      {errorMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="text-destructive"
          variant="muted"
        >
          {errorMessage}
        </Text>
      ) : null}
      <Button
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
        disabled={isLoading}
        onPress={handlePressLogin}
      >
        <Text>
          {isLoading ? t("auth__login__submitting") : t("auth__login__submit")}
        </Text>
      </Button>
    </View>
  );
}
