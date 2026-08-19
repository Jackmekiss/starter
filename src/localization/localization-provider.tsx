import { useEffect } from "react";
import { useLocales } from "expo-localization";
import { I18nextProvider } from "react-i18next";

import { DEFAULT_LOCALE, i18n, isAppLocale } from "@/localization/i18n";

import type { AppLocale } from "@/localization/types";
import type { PropsWithChildren } from "react";

/** Resolves a supported locale from the device language. */
function resolveAppLocale(languageCode: string | null): AppLocale {
  return languageCode && isAppLocale(languageCode)
    ? languageCode
    : DEFAULT_LOCALE;
}

/** Provides bundled translations and synchronizes i18next with the device locale. */
export function LocalizationProvider({ children }: PropsWithChildren) {
  const locales = useLocales();
  const locale = resolveAppLocale(locales[0]?.languageCode ?? null);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
