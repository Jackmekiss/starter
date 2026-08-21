import { useTheme } from "expo-router";
import * as React from "react";
import PhoneInput, {
  getCountryByCca2,
  getCountryByPhoneNumber,
  getNationalPhoneNumber,
  type ICountry,
  type IPhoneInputRef,
  type PhoneInputProps,
} from "rn-international-phone-number";

import { THEME } from "@/constants/theme";

import type { ForwardedRef, RefObject } from "react";

const DEFAULT_COUNTRY = "FR";

/** Props accepted by the controlled international phone field. */
interface PhoneNumberInputProps {
  /** Accessible name announced for the editable phone field. */
  accessibilityLabel: string;
  /** Accessible name announced for the country selector button. */
  countryButtonAccessibilityLabel: string;
  /** Focuses the editable phone field when it mounts. */
  autoFocus?: boolean;
  /** Initial country used when value contains no international prefix. */
  defaultCountry?: PhoneInputProps["defaultCountry"];
  disabled?: boolean;
  invalid?: boolean;
  /** Language used by the country selector. */
  language: NonNullable<PhoneInputProps["language"]>;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

/** Resolves the country encoded in a value or the caller's default market. */
function resolveInitialCountry(
  value: string,
  defaultCountry: PhoneInputProps["defaultCountry"],
): ICountry | null {
  if (value) {
    return (
      getCountryByPhoneNumber(value) ??
      getCountryByCca2(defaultCountry ?? DEFAULT_COUNTRY) ??
      null
    );
  }

  return getCountryByCca2(defaultCountry ?? DEFAULT_COUNTRY) ?? null;
}

/** Converts the national display value into the international stored value. */
function toInternationalPhoneNumber(
  phoneNumber: string,
  country: ICountry | null,
): string {
  if (!country) {
    return "";
  }

  const digits = phoneNumber.replace(/\D/g, "");
  return digits ? `${country.idd.root}${digits}` : "";
}

/** Preserves the local focus target and the caller's forwarded ref. */
function assignPhoneInputRef(
  instance: IPhoneInputRef | null,
  localRef: RefObject<IPhoneInputRef | null>,
  forwardedRef: ForwardedRef<IPhoneInputRef>,
) {
  localRef.current = instance;

  if (typeof forwardedRef === "function") {
    forwardedRef(instance);
  } else if (forwardedRef !== null) {
    forwardedRef.current = instance;
  }
}

/** Controlled international phone field isolated from store and localization. */
const PhoneNumberInput = React.forwardRef<
  IPhoneInputRef,
  PhoneNumberInputProps
>(
  (
    {
      accessibilityLabel,
      autoFocus = false,
      countryButtonAccessibilityLabel,
      defaultCountry = DEFAULT_COUNTRY,
      disabled = false,
      invalid = false,
      language,
      onValueChange,
      placeholder = "",
      value,
    },
    ref,
  ) => {
    const theme = THEME[useTheme().dark ? "dark" : "light"];
    const phoneInputRef = React.useRef<IPhoneInputRef | null>(null);
    const [selectedCountry, setSelectedCountry] =
      React.useState<ICountry | null>(() =>
        resolveInitialCountry(value, defaultCountry),
      );
    const nationalValue = value ? getNationalPhoneNumber(value) : "";
    const countryFromValue = value ? getCountryByPhoneNumber(value) : undefined;
    const country = countryFromValue ?? selectedCountry;
    const phoneInputStyles = React.useMemo(
      () =>
        ({
          container: {
            height: 40,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: invalid
              ? theme.destructive
              : theme.controlBorderStrong,
            backgroundColor: theme.secondary,
            overflow: "hidden",
            paddingLeft: 0,
            paddingRight: 16,
            opacity: disabled ? 0.4 : 1,
          },
          flagContainer: {
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 0,
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
          },
          flag: {
            fontSize: 14,
            lineHeight: 20,
          },
          divider: {
            width: 1,
            height: 14,
            backgroundColor: theme.divider,
            marginHorizontal: 0,
          },
          callingCode: {
            fontFamily: "Poppins",
            fontSize: 14,
            fontWeight: "600",
            color: theme.secondaryForeground,
            lineHeight: 20,
          },
          caret: {
            display: "none",
          },
          input: {
            fontFamily: "Poppins",
            fontSize: 14,
            lineHeight: 20,
            color: theme.secondaryForeground,
            paddingHorizontal: 6,
            paddingVertical: 0,
          },
        }) satisfies NonNullable<PhoneInputProps["phoneInputStyles"]>,
      [disabled, invalid, theme],
    );

    React.useEffect(() => {
      if (autoFocus) {
        phoneInputRef.current?.focus();
      }
    }, [autoFocus]);

    /** Synchronizes the internal focus target and caller ref. */
    function handleRef(instance: IPhoneInputRef | null) {
      assignPhoneInputRef(instance, phoneInputRef, ref);
    }

    /** Stores phone edits as international values. */
    function handleChangePhoneNumber(phoneNumber: string) {
      onValueChange(toInternationalPhoneNumber(phoneNumber, country));
    }

    /** Rewrites the current national number against the selected country. */
    function handleChangeCountry(nextCountry: ICountry) {
      setSelectedCountry(nextCountry);
      onValueChange(toInternationalPhoneNumber(nationalValue, nextCountry));
    }

    return (
      <PhoneInput
        ref={handleRef}
        accessibilityLabelCountriesButton={countryButtonAccessibilityLabel}
        accessibilityLabelPhoneInput={accessibilityLabel}
        aria-invalid={invalid || undefined}
        autoCapitalize="none"
        autoComplete="tel"
        autoCorrect={false}
        country={country}
        defaultCountry={defaultCountry}
        disabled={disabled}
        isFullScreen
        keyboardType="phone-pad"
        language={language}
        onChangeCountry={handleChangeCountry}
        onChangePhoneNumber={handleChangePhoneNumber}
        phoneInputPlaceholderTextColor={theme.bodyForeground}
        phoneInputSelectionColor={theme.primary}
        phoneInputStyles={phoneInputStyles}
        placeholder={placeholder}
        placeholderType="text"
        textContentType="telephoneNumber"
        value={nationalValue}
      />
    );
  },
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
export type { PhoneNumberInputProps };
