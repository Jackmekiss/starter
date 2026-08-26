import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, Pressable, TextInput, View } from "react-native";

import { Icon, type IconProps } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const inputFrameVariants = cva(
  "flex-row items-center gap-2 overflow-hidden transition-colors duration-150 ease-out web:hover:border-control-border-strong web:focus-within:border-control-border-focus",
  {
    variants: {
      variant: {
        rounded: "border-control-border bg-muted rounded-full border px-4",
        outline: "border-control-border bg-background rounded-lg border px-3",
        underlined: "border-control-border rounded-none border-b px-0",
      },
      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-11",
        xl: "h-12",
      },
      invalid: {
        true: "border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "rounded",
      size: "md",
      invalid: false,
    },
  },
);

/** Closed shape and size variants supported by input frames. */
type InputVariantProps = VariantProps<typeof inputFrameVariants>;

/** Visual and interaction state inherited inside an InputGroup. */
interface InputContextValue {
  disabled: boolean;
  invalid: boolean;
  size: NonNullable<InputVariantProps["size"]>;
  variant: NonNullable<InputVariantProps["variant"]>;
  withinGroup: boolean;
}

const InputContext = React.createContext<InputContextValue>({
  disabled: false,
  invalid: false,
  size: "md",
  variant: "rounded",
  withinGroup: false,
});

/** Props accepted by the shared single-line input. */
type InputProps = Omit<React.ComponentProps<typeof TextInput>, "size"> &
  InputVariantProps & {
    /** Reports validation state to web accessibility APIs. */
    "aria-invalid"?: boolean;
    invalid?: boolean;
  };

/** Single-line input supporting Fifteen shapes through a shadcn API. */
const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      "aria-invalid": ariaInvalid,
      className,
      editable,
      invalid,
      placeholderClassName,
      size,
      style,
      variant,
      ...props
    },
    ref,
  ) => {
    const group = React.useContext(InputContext);
    const resolvedSize = size ?? group.size;
    const resolvedVariant = variant ?? group.variant;
    const isDisabled = editable === false || group.disabled;
    const isInvalid = invalid ?? (group.invalid || ariaInvalid === true);

    return (
      <TextInput
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "text-secondary-foreground font-body min-w-0 w-full py-1 text-sm leading-5",
          !group.withinGroup &&
            inputFrameVariants({
              invalid: isInvalid,
              size: resolvedSize,
              variant: resolvedVariant,
            }),
          group.withinGroup && "h-full bg-transparent px-0",
          isDisabled &&
            cn(
              "opacity-40",
              Platform.select({
                web: "disabled:pointer-events-none disabled:cursor-not-allowed",
              }),
            ),
          Platform.select({
            web: cn(
              "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow]",
              "hover:border-control-border-strong focus-visible:border-control-border-focus focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
            ),
          }),
          className,
        )}
        editable={!isDisabled}
        placeholderClassName={cn("text-body-foreground", placeholderClassName)}
        style={[{ includeFontPadding: false }, style]}
        textAlignVertical="center"
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

/** Props accepted by a compound input frame. */
type InputGroupProps = React.ComponentProps<typeof View> &
  InputVariantProps & {
    disabled?: boolean;
    invalid?: boolean;
  };

/** Compound input frame for leading or trailing interactive slots. */
function InputGroup({
  children,
  className,
  disabled = false,
  invalid = false,
  size = "md",
  variant = "rounded",
  ...props
}: InputGroupProps) {
  const resolvedSize = size ?? "md";
  const resolvedVariant = variant ?? "rounded";
  const contextValue = React.useMemo(
    () => ({
      disabled,
      invalid,
      size: resolvedSize,
      variant: resolvedVariant,
      withinGroup: true,
    }),
    [disabled, invalid, resolvedSize, resolvedVariant],
  );

  return (
    <InputContext.Provider value={contextValue}>
      <View
        aria-invalid={invalid || undefined}
        className={cn(
          inputFrameVariants({
            invalid,
            size: resolvedSize,
            variant: resolvedVariant,
          }),
          disabled && "opacity-40",
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </InputContext.Provider>
  );
}

/** Leading or trailing press target inside an InputGroup. */
function InputSlot({
  className,
  disabled,
  hitSlop = 8,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const context = React.useContext(InputContext);
  return (
    <Pressable
      className={cn("items-center justify-center", className)}
      disabled={disabled ?? context.disabled}
      hitSlop={hitSlop}
      {...props}
    />
  );
}

/** Lucide icon sized for the current input group. */
function InputIcon({ className, size, ...props }: IconProps) {
  const context = React.useContext(InputContext);
  const resolvedSize =
    size ?? (context.size === "sm" ? 16 : context.size === "xl" ? 20 : 18);
  return (
    <Icon
      className={cn(
        "text-muted-foreground transition-colors duration-150 ease-out",
        className,
      )}
      size={resolvedSize}
      {...props}
    />
  );
}

export { Input, InputGroup, InputIcon, InputSlot, inputFrameVariants };
export type { InputGroupProps, InputProps, InputVariantProps };
