import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, TextInput } from "react-native";

import { cn } from "@/lib/cn";

const textareaVariants = cva(
  "text-secondary-foreground border-control-subtle bg-background font-body flex min-h-[100px] w-full flex-row rounded-lg border px-3 py-2 shadow-sm shadow-black/5",
  {
    variants: {
      size: {
        sm: "text-sm leading-5",
        md: "text-base leading-6",
        lg: "text-lg leading-7",
        xl: "text-xl leading-7",
      },
      invalid: {
        true: "border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

/** Closed size and state variants supported by Textarea. */
type TextareaVariantProps = VariantProps<typeof textareaVariants>;
/** Props accepted by the shared multiline input. */
type TextareaProps = Omit<React.ComponentProps<typeof TextInput>, "size"> &
  TextareaVariantProps & {
    /** Reports validation state to web accessibility APIs. */
    "aria-invalid"?: boolean;
    invalid?: boolean;
  };

/** Multiline text input with Fifteen sizing and shadcn field semantics. */
const Textarea = React.forwardRef<TextInput, TextareaProps>(
  (
    {
      "aria-invalid": ariaInvalid,
      className,
      invalid,
      multiline = true,
      numberOfLines = Platform.select({ web: 4, native: 6 }),
      placeholderClassName,
      size = "md",
      ...props
    },
    ref,
  ) => {
    const isInvalid = invalid ?? ariaInvalid === true;

    return (
      <TextInput
        ref={ref}
        aria-invalid={isInvalid || undefined}
        className={cn(
          textareaVariants({ invalid: isInvalid, size }),
          Platform.select({
            web: "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed",
          }),
          props.editable === false && "bg-muted opacity-40",
          className,
        )}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderClassName={cn("text-body-foreground", placeholderClassName)}
        textAlignVertical="top"
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
export type { TextareaProps, TextareaVariantProps };
