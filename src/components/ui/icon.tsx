import { cssInterop } from "nativewind";

import { cn } from "../../lib/cn";

import type { LucideIcon, LucideProps } from "lucide-react-native";

/**
 * Props accepted by the shared Lucide icon wrapper.
 */
type IconProps = LucideProps & {
  as: LucideIcon;
};

/**
 * NativeWind interop target that forwards class styles to Lucide props.
 */
function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: "size",
      width: "size",
    },
  },
});

/**
 * Themed icon primitive used by buttons, tabs, and compact controls.
 */
function Icon({
  as: IconComponent,
  className,
  size = 14,
  ...props
}: IconProps) {
  return (
    <IconImpl
      as={IconComponent}
      className={cn("text-foreground", className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
