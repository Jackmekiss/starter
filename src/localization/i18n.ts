import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/translations/en.json";
import fr from "@/translations/fr.json";

import type { AppLocale } from "@/localization/types";

export const DEFAULT_LOCALE: AppLocale = "fr";
const DEFAULT_NAMESPACE = "translation";

export const translationResources = {
  en: {
    [DEFAULT_NAMESPACE]: en,
  },
  fr: {
    [DEFAULT_NAMESPACE]: fr,
  },
} as const;

/** Checks whether a language code is supported by the bundled catalogs. */
export function isAppLocale(languageCode: string): languageCode is AppLocale {
  return languageCode in translationResources;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    defaultNS: DEFAULT_NAMESPACE,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}",
    },
    lng: DEFAULT_LOCALE,
    resources: translationResources,
  });
}

export { i18n };
