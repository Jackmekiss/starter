import * as React from "react";
import { Linking, Platform, Pressable } from "react-native";

import { Text, TextClassContext } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

import type { ComponentProps, ReactNode } from "react";
import type { GestureResponderEvent } from "react-native";

/** Props accepted by the shared link primitive. */
interface LinkProps extends Omit<ComponentProps<typeof Pressable>, "children"> {
  /** Visible link content. Plain strings are wrapped in the shared Text primitive. */
  children?: ReactNode;
  /** Optional URL opened through the platform linking API. */
  href?: string;
  /** Additional classes inherited by nested shared Text nodes. */
  textClassName?: string;
}

/** Props accepted by the explicit link text compound component. */
type LinkTextProps = ComponentProps<typeof Text>;

/**
 * Accessible pressable link supporting either a URL or a caller-owned action.
 */
const Link = React.forwardRef<React.ComponentRef<typeof Pressable>, LinkProps>(
  (
    {
      accessibilityState,
      children,
      className,
      disabled,
      href,
      onPress,
      textClassName,
      ...props
    },
    ref,
  ) => {
    const isLinkDisabled = Boolean(disabled);
    const linkTextClassName = cn(
      "text-primary web:group-hover:text-primary-strong web:group-focus-visible:text-primary-strong group-active:text-primary-strong font-body-bold text-sm underline",
      textClassName,
    );

    /** Routes activation to the explicit handler or the platform URL opener. */
    function handlePress(event: GestureResponderEvent) {
      if (onPress) {
        onPress(event);
        return;
      }

      if (href) {
        Linking.openURL(href).catch(() => {});
      }
    }

    const content =
      typeof children === "string" || typeof children === "number" ? (
        <Text>{children}</Text>
      ) : (
        children
      );

    return (
      <TextClassContext.Provider value={linkTextClassName}>
        <Pressable
          ref={ref}
          accessibilityRole="link"
          accessibilityState={{
            ...accessibilityState,
            disabled: isLinkDisabled,
          }}
          className={cn(
            "group items-start",
            isLinkDisabled && "opacity-40",
            Platform.select({
              web: "cursor-pointer outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary-strong disabled:cursor-not-allowed",
            }),
            className,
          )}
          disabled={isLinkDisabled}
          onPress={onPress || href ? handlePress : undefined}
          {...props}
        >
          {content}
        </Pressable>
      </TextClassContext.Provider>
    );
  },
);

/** Text node that uses the shared link typography. */
function LinkText({ className, ...props }: LinkTextProps) {
  return (
    <Text
      className={cn(
        "text-primary web:group-hover:text-primary-strong web:group-focus-visible:text-primary-strong group-active:text-primary-strong font-body-bold text-sm underline",
        className,
      )}
      {...props}
    />
  );
}

Link.displayName = "Link";

export { Link, LinkText };
export type { LinkProps, LinkTextProps };
