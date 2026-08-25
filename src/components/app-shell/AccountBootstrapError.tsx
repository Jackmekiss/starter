import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

/** Retry contract used when a session exists without resolvable Account state. */
interface AccountBootstrapErrorProps {
  /** Prevents duplicate retries while Account is being retrieved. */
  isRetrying: boolean;
  /** Starts a fresh Account retrieval attempt. */
  onRetry(): void;
}

/** Blocks business routes until Account-owned onboarding state is known. */
export function AccountBootstrapError({
  isRetrying,
  onRetry,
}: AccountBootstrapErrorProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-canvas flex-1 items-center justify-center gap-6 px-6">
      <View className="max-w-md gap-2">
        <Text accessibilityRole="header" className="text-center" variant="h2">
          {t("account__bootstrap__error__title")}
        </Text>
        <Text className="text-center" variant="muted">
          {t("account__bootstrap__error__description")}
        </Text>
      </View>
      <Button
        accessibilityState={{ busy: isRetrying, disabled: isRetrying }}
        disabled={isRetrying}
        onPress={onRetry}
      >
        <Text>
          {isRetrying
            ? t("account__bootstrap__retrying")
            : t("account__bootstrap__retry")}
        </Text>
      </Button>
    </View>
  );
}
