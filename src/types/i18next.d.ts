import type fr from "@/translations/fr.json";

declare module "i18next" {
  /** Project-specific i18next type configuration. */
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof fr;
    };
  }
}
