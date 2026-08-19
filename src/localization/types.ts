import type fr from "@/translations/fr.json";

/** Locale bundled with the application. */
export type AppLocale = "en" | "fr";

/** Translation key available in the source catalog. */
export type TranslationKey = keyof typeof fr;
