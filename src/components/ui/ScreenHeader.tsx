import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";

import { Button, ButtonIcon } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

/** Props accepted by the shared screen heading. */
interface ScreenHeaderProps extends React.ComponentProps<typeof View> {
  /** Localized accessible name for the back action. */
  backAccessibilityLabel: string;
  /** Returns to the preceding route. */
  onBack: () => void;
  /** Centered screen title. */
  title: string;
}

/** Centered screen heading with a caller-owned back action. */
function ScreenHeader({
  backAccessibilityLabel,
  className,
  onBack,
  title,
  ...props
}: ScreenHeaderProps) {
  return (
    <View className={cn("px-screen pb-4 pt-2", className)} {...props}>
      <View className="min-h-12 flex-row items-center justify-center">
        <Button
          accessibilityLabel={backAccessibilityLabel}
          action="primary"
          className="absolute left-0 z-10 size-12 px-0"
          onPress={onBack}
          size="icon"
          variant="link"
        >
          <ButtonIcon as={ArrowLeft} size={24} />
        </Button>
        <Text
          className="min-w-0 flex-1 px-12 text-center"
          headingLevel="1"
          size="sm"
          variant="heading"
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

export { ScreenHeader };
export type { ScreenHeaderProps };
