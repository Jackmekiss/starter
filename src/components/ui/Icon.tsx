import { Svg } from "@gluestack-ui/core/icon/creator";
/* eslint-disable react/prop-types */
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { styled } from "nativewind";
import React from "react";
import { G } from "react-native-svg";

import { cn } from "@/lib/cn";

import type { IPrimitiveIcon as PrimitiveIconProps } from "@gluestack-ui/core/icon/creator";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import type { LucideIcon, LucideProps } from "lucide-react-native";

const AppPrimitiveIcon = React.forwardRef<
  React.ComponentRef<typeof Svg>,
  PrimitiveIconProps
>(
  (
    {
      as: IconComponent,
      classNameColor,
      color,
      fill,
      height,
      size,
      stroke,
      style,
      width,
      ...props
    },
    ref,
  ) => {
    const resolvedColor = color ?? classNameColor;
    const styleObject = Array.isArray(style) ? style[0] : style;
    const resolvedHeight =
      height ??
      (typeof size === "number" ? size : undefined) ??
      styleObject?.height;
    const resolvedWidth =
      width ??
      (typeof size === "number" ? size : undefined) ??
      styleObject?.width;

    if (IconComponent) {
      return (
        <IconComponent
          ref={ref}
          {...props}
          color={resolvedColor}
          fill={fill}
          height={resolvedHeight}
          stroke={stroke}
          style={style}
          width={resolvedWidth}
        />
      );
    }

    return (
      <Svg
        ref={ref}
        {...props}
        color={resolvedColor}
        fill={fill}
        height={resolvedHeight}
        stroke={stroke}
        style={style}
        width={resolvedWidth}
      />
    );
  },
);

const StyledPrimitiveIcon = styled(AppPrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleMapping: {
      fill: "fill",
      color: "classNameColor",
      stroke: "stroke",
    },
  },
});

/** Gluestack icon primitive used by local design-system components. */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const UiIcon = StyledPrimitiveIcon as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof AppPrimitiveIcon> &
    React.RefAttributes<React.ComponentRef<typeof Svg>>
>;

const createdIconStyle = tva({
  base: "pointer-events-none",
  variants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
});

/** Paint strategy used by one local icon definition. */
type IconColorMode = "fill" | "stroke";

/** Parameters accepted by the local icon factory. */
interface AppIconParameters {
  colorMode?: IconColorMode;
  path: React.ReactNode;
  viewBox: string;
}

/** Props accepted by an icon created with the local factory. */
type CreatedIconProps = React.ComponentPropsWithoutRef<typeof Svg> &
  VariantProps<typeof createdIconStyle>;

/** Creates a themed SVG icon using gluestack paint semantics. */
function createIcon({ colorMode = "fill", path, viewBox }: AppIconParameters) {
  return React.forwardRef<React.ComponentRef<typeof Svg>>(
    (
      {
        className,
        color,
        fill,
        size,
        stroke,
        ...incomingProps
      }: CreatedIconProps,
      ref,
    ) => {
      const resolvedColor =
        (fill !== "none" ? fill : undefined) ??
        (stroke !== "none" ? stroke : undefined) ??
        color;

      return (
        <Svg
          ref={ref}
          {...incomingProps}
          className={createdIconStyle({ size, class: className })}
          viewBox={viewBox}
        >
          <G
            fill={colorMode === "fill" ? resolvedColor : "none"}
            stroke={colorMode === "stroke" ? resolvedColor : "none"}
          >
            {path}
          </G>
        </Svg>
      );
    },
  );
}

/**
 * Props accepted by the shared Lucide icon wrapper.
 */
type IconProps = LucideProps & {
  as: LucideIcon;
};

/** NativeWind interop target that forwards class styles to Lucide props. */
function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

const StyledIcon = styled(IconImpl, {
  className: {
    target: "style",
    nativeStyleMapping: {
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
    <StyledIcon
      as={IconComponent}
      className={cn("text-foreground", className)}
      size={size}
      {...props}
    />
  );
}

export { createIcon, Icon, UiIcon };
export type { IconProps };
