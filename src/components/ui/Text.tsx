import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Text as RNText, type Role } from "react-native";

import { cn } from "@/lib/cn";

const textVariants = cva(
  cn(
    "text-body-foreground font-body text-base font-normal",
    Platform.select({ web: "select-text" }),
  ),
  {
    variants: {
      variant: {
        default: "",
        body: "font-body",
        heading: "font-heading leading-heading tracking-heading font-extrabold",
        h1: cn(
          "font-heading leading-heading tracking-heading text-center text-4xl font-extrabold",
          Platform.select({ web: "scroll-m-20 text-balance" }),
        ),
        h2: cn(
          "font-heading leading-heading tracking-heading border-border border-b pb-2 text-3xl font-extrabold",
          Platform.select({ web: "scroll-m-20 first:mt-0" }),
        ),
        h3: cn(
          "font-heading leading-heading tracking-heading text-2xl font-extrabold",
          Platform.select({ web: "scroll-m-20" }),
        ),
        h4: cn(
          "font-heading leading-heading tracking-heading text-xl font-extrabold",
          Platform.select({ web: "scroll-m-20" }),
        ),
        p: "mt-3 leading-7 sm:mt-6",
        blockquote: "mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6",
        code: "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        lead: "text-muted-foreground text-xl",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-muted-foreground text-sm",
      },
      size: {
        "2xs": "text-[10px] leading-4",
        xs: "text-xs leading-4",
        sm: "text-sm leading-5",
        md: "text-base leading-6",
        lg: "text-lg leading-7",
        xl: "text-xl leading-7",
        "2xl": "text-2xl leading-8",
        "3xl": "text-3xl leading-9",
        "4xl": "text-4xl leading-10",
        "5xl": "text-5xl leading-[3rem]",
        "6xl": "text-6xl leading-[3.75rem]",
      },
      weight: {
        thin: "font-thin",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },
      treatment: {
        truncate: "truncate",
        underline: "underline",
        strike: "line-through",
        italic: "italic",
        highlight: "bg-warning-soft",
        subscript: "text-xs align-sub",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/** Variant props supported by the shared text primitive. */
type TextVariantProps = VariantProps<typeof textVariants>;

/** Named sizes supported by the shared typography primitive. */
type TextSize = NonNullable<TextVariantProps["size"]>;

/** Named text styles mapped to typography and accessibility roles. */
type TextVariant = NonNullable<TextVariantProps["variant"]>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const HEADING_SIZE: Record<TextSize, TextSize> = {
  "2xs": "sm",
  xs: "sm",
  sm: "md",
  md: "lg",
  lg: "xl",
  xl: "2xl",
  "2xl": "3xl",
  "3xl": "4xl",
  "4xl": "5xl",
  "5xl": "6xl",
  "6xl": "6xl",
};

/** Props accepted by the shared typography primitive. */
type TextProps = React.ComponentProps<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
    /** Explicit semantic level when a visual heading represents document structure. */
    headingLevel?: "1" | "2" | "3" | "4" | "5" | "6";
  };

/** Cross-platform Poppins text primitive with semantic shadcn variants. */
function Text({
  asChild = false,
  className,
  headingLevel,
  size,
  treatment,
  variant = "default",
  weight,
  ...props
}: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  const resolvedSize =
    variant === "heading" ? HEADING_SIZE[size ?? "lg"] : size;

  return (
    <Component
      aria-level={headingLevel ?? (variant ? ARIA_LEVEL[variant] : undefined)}
      className={cn(
        textVariants({ size: resolvedSize, treatment, variant, weight }),
        textClass,
        className,
      )}
      role={headingLevel ? "heading" : variant ? ROLE[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
export type { TextProps, TextVariantProps };
