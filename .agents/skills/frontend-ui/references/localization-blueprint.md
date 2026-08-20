# Frozen Blueprint: Localization and Presentation Copy

> Blueprint version: `1.0.0`

Use this reference when adding or changing user-visible copy, locales, translation runtime wiring, accessibility wording, validation messages, or presentation-error resolution. This is the canonical Starter shape for bundled i18next catalogs.

Accepted, non-superseded repository decisions remain normative. If generated code conflicts with an accepted decision, correct the generated code; do not silently weaken this blueprint to match implementation output.

## Placeholder Contract

Angle-bracket names are deliberate placeholders:

- **<context>**: the bounded context, such as auth or subscription.
- **<flow>**: a user flow or screen area, such as login or password_reset.
- **<element_or_message>**: a field, action, state, or sentence purpose.
- **<English copy>** and **<French copy>**: complete, product-approved sentences in the named language.
- **<ACTION_CODE>**: a stable bounded-context application error code, never a backend message.

Replace all placeholders in both catalogs and source. Do not leave placeholder copy, infer product wording from an exception, or translate one language by copying the other.

## Canonical Tree and Ownership

```text
src/
├── app-runtime/
│   └── root-app-providers.tsx                         [required] mounts LocalizationProvider once
├── hooks/
│   └── localization/
│       └── useTranslation.ts                          [required] app-facing typed hook
├── localization/
│   ├── i18n.ts                                        [required] resources, fallback, initialization
│   ├── localization-provider.tsx                      [required] device-locale synchronization
│   └── types.ts                                       [required] locale and source-catalog key types
├── translations/
│   ├── en.json                                        [required] complete English catalog
│   └── fr.json                                        [required] complete French source catalog
└── types/
    └── i18next.d.ts                                   [required] react-i18next key augmentation

core/
└── <context>/
    └── adapters/
        └── presentation/
            └── <context>-error-message.ts             [conditional] context-owned safe copy resolver

src/components/<context>/<feature>.tsx                 [conditional] consumes t; owns UI fallback copy
```

Catalogs own human-readable copy. **src/localization/** owns locale mechanics only. The root runtime owns provider composition. A bounded context's stable presentation adapter owns the mapping from typed application failures to translation keys; it does not own translations or React state.

Do not move i18next into **core/domain**, a Redux slice, an RTK Query API, or a concrete gateway. Do not add locale-specific component branches.

## Translation-Key Contract

Keys are flat JSON properties. Use double underscores between hierarchy segments and snake_case words inside each segment:

```text
<context>__<flow>__<element_or_message>
auth__login__email_label
auth__login__error__invalid_credentials
common__error__rate_limited
subscription__restore__error__no_active_purchase
```

The structural pattern is:

```text
^[a-z0-9]+(?:_[a-z0-9]+)*(?:__[a-z0-9]+(?:_[a-z0-9]+)*)+$
```

Use a complete semantic key, not copy text, an index, a backend code, or a component filename. Keep related action errors under the action segment. Put genuinely reusable technical messages under **common\_\_error**; do not make business errors generic merely to reuse wording.

## Catalog Skeletons

Merge new keys into both existing files in the same change. These are valid JSON addition templates; replace every value and manually preserve the same key set.

### src/translations/en.json

```json
{
  "<context>__<flow>__title": "<English title>",
  "<context>__<flow>__description": "<English description>",
  "<context>__<flow>__<element_or_message>_label": "<English label>",
  "<context>__<flow>__<element_or_message>_placeholder": "<English placeholder>",
  "<context>__<flow>__<element_or_message>_required": "<English validation sentence>",
  "<context>__<flow>__submit": "<English action>",
  "<context>__<flow>__submitting": "<English in-progress action>",
  "<context>__<flow>__error__unexpected": "<English safe fallback>",
  "<context>__<flow>__error__<action_code>": "<English mapped error>"
}
```

### src/translations/fr.json

```json
{
  "<context>__<flow>__title": "<French title>",
  "<context>__<flow>__description": "<French description>",
  "<context>__<flow>__<element_or_message>_label": "<French label>",
  "<context>__<flow>__<element_or_message>_placeholder": "<French placeholder>",
  "<context>__<flow>__<element_or_message>_required": "<French validation sentence>",
  "<context>__<flow>__submit": "<French action>",
  "<context>__<flow>__submitting": "<French in-progress action>",
  "<context>__<flow>__error__unexpected": "<French safe fallback>",
  "<context>__<flow>__error__<action_code>": "<French mapped error>"
}
```

JSON cannot contain comments. The examples above are templates, not literal keys to commit. Keep complete sentences together so translators can control grammar. Use i18next interpolation for values and plural rules for counts; do not concatenate translated fragments.

## Required Runtime Skeleton

### src/localization/types.ts

French is the Starter's fallback and typed source catalog. Keep the current type surface exactly:

```ts
import type fr from "@/translations/fr.json";

/** Locale bundled with the application. */
export type AppLocale = "en" | "fr";

/** Translation key available in the source catalog. */
export type TranslationKey = keyof typeof fr;
```

Do not weaken **TranslationKey** to **string** and do not invent an additional catalog-normalization or parity type. Catalog parity remains a required authoring and review step.

### src/localization/i18n.ts

```ts
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
```

Keep one namespace until a measured catalog-size or loading need justifies another accepted design. Do not fetch a remote locale during startup unless product and offline behavior explicitly require it.

### src/localization/localization-provider.tsx

```tsx
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
```

Unsupported or unavailable device languages resolve to French. Keep locale selection deterministic; a future user preference must be an explicit product decision with defined precedence and persistence.

### src/hooks/localization/useTranslation.ts

Presentation imports this hook, not **react-i18next** directly:

```ts
import { useTranslation as useReactI18nextTranslation } from "react-i18next";

/** App-facing translation hook. */
export const useTranslation: typeof useReactI18nextTranslation =
  useReactI18nextTranslation;
```

### src/types/i18next.d.ts

```ts
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
```

### src/app-runtime/root-app-providers.tsx

Mount localization once around all presentation routes. Preserve the existing provider order:

```tsx
<PersistGate loading={null} persistor={persistor}>
  <LocalizationProvider>
    <ThemeProvider value={NAV_THEME[colorScheme]}>{children}</ThemeProvider>
  </LocalizationProvider>
</PersistGate>
```

## Presentation Consumption

Use typed keys at the point where copy is rendered:

```tsx
import { useTranslation } from "@/hooks/localization/useTranslation";

/** Renders one localized feature heading. */
export function FeatureHeading() {
  const { t } = useTranslation();

  return <Text variant="h1">{t("auth__welcome__title")}</Text>;
}
```

Visible labels, placeholders, hints, empty states, loading text, accessibility labels/actions, toast copy, validation messages, retry text, and error fallbacks all follow the same rule. Developer-only logs, stable test IDs, and non-user-facing protocol values are not translation copy.

## Localized Presentation Errors

Routes and components import generated query/mutation hooks and **appMode** only from **@/app-runtime/app-runtime**. Stable core selectors and context-owned **adapters/presentation/** resolvers are allowed there. Concrete APIs, gateways, stores, HTTP/SDK adapters, and infrastructure error mappers are not; internal `src/app-runtime/**` composition may import its owning runtime directly.

Canonical mutation call site:

```tsx
import { useLoginMutation } from "@/app-runtime/app-runtime";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { resolveAuthErrorMessage } from "@core/auth/adapters/presentation/auth-error-message";

const { t } = useTranslation();
const [login, { isLoading }] = useLoginMutation();

try {
  await login({ email, password }).unwrap();
} catch (error) {
  setError("root", {
    message: resolveAuthErrorMessage(error, t, {
      action: "login",
      fallbackMessage: t("auth__login__error__unexpected"),
    }),
  });
}
```

The caught value remains **unknown**. The resolver narrows the bounded-context error and returns only localized, user-safe copy:

```ts
import { isContextApplicationError } from "@core/shared/domain/application-error";
import { isAuthError } from "@core/auth/domain/auth-error";

import type { TFunction } from "i18next";

/** Presentation context needed when a technical error has flow-specific copy. */
interface ResolveAuthErrorMessageOptions {
  /** Authentication action that rejected. */
  action?: "login" | "oauth" | "password-reset" | "registration";
  /** Safe copy returned for unknown or unmapped failures. */
  fallbackMessage: string;
}

/** Resolves an authentication rejection into safe localized copy. */
export function resolveAuthErrorMessage(
  error: unknown,
  resolveMessage: TFunction,
  options: ResolveAuthErrorMessageOptions,
): string {
  if (!isAuthError(error)) return options.fallbackMessage;

  if (isContextApplicationError(error)) {
    switch (error.code) {
      case "INVALID_CREDENTIALS":
        return resolveMessage("auth__login__error__invalid_credentials");
      case "EMAIL_NOT_CONFIRMED":
        return resolveMessage("auth__login__error__email_not_confirmed");
      default:
        return options.fallbackMessage;
    }
  }

  switch (error.kind) {
    case "network":
      return resolveMessage("common__error__network");
    case "timeout":
      return resolveMessage("common__error__timeout");
    case "rate-limited":
      return resolveMessage("common__error__rate_limited");
    case "unavailable":
      return resolveMessage("common__error__unavailable");
    default:
      return options.fallbackMessage;
  }
}
```

Keep one resolver per bounded context. Map stable context codes and technical kinds, preserve action-specific meaning through an options object, and require the caller to provide a safe flow-specific fallback.

## Invariants

- **en.json** and **fr.json** contain exactly the same flat keys; French remains the fallback and typed source catalog.
- Every key uses double-underscore domain hierarchy and snake_case words within each segment.
- Presentation imports the local **useTranslation** hook and uses typed literal keys.
- Device locale changes flow through **LocalizationProvider**; unsupported locales resolve to **DEFAULT_LOCALE**.
- User-visible errors come from typed context presentation resolvers plus a localized caller fallback.
- Accessibility copy is translated through the same catalogs.
- Generated hooks and **appMode** enter routes/components through **@/app-runtime/app-runtime**; stable selectors and presentation resolvers may enter through their public core paths, while internal runtime composition may import its owning runtime directly.

## Anti-Patterns

- Nested catalog objects, dotted key paths, camelCase segments, translated source text as a key, or different key sets per locale.
- Adding, removing, or renaming a key in only one catalog, or weakening **TranslationKey** to **string**.
- Importing **react-i18next** throughout components instead of the local hook.
- Hard-coded user-visible strings in JSX, navigation options, accessibility props, validation rules, toasts, or overlays.
- Rendering **error.message**, backend copy, provider/SDK exceptions, HTTP status text, or raw stable codes.
- Translating inside domain models, gateways, use-cases, selectors, Redux state, or RTK Query endpoints.
- Concatenating translated fragments or assuming English/French word order is interchangeable.
- Guessing a translation, fallback, locale preference, or business-error meaning that product decisions do not define.

## Validation and Review Checklist

- [ ] Every added, removed, or renamed key is changed in both catalogs; a manual key-set comparison finds no difference.
- [ ] All keys match the flat double-underscore and snake_case contract.
- [ ] English and French values are complete, reviewed copy; no angle-bracket placeholder remains.
- [ ] The typed hook accepts every consumed key and rejects an unknown key.
- [ ] French is used for French, unsupported, null, and unavailable device language codes; English is used for English.
- [ ] Switching the device locale updates mounted presentation without duplicating i18next instances.
- [ ] Validation, loading, empty, retry, action, accessibility, and failure copy in scope is localized.
- [ ] Known business and technical failures resolve to safe catalog copy; unknown failures use the caller's localized fallback.
- [ ] No UI reads raw exception/backend messages or imports concrete API, store, gateway, HTTP, SDK, or infrastructure internals.
- [ ] Run typecheck and relevant lint after source changes. Targeted `pnpm exec oxfmt <changed-files> --check` must pass; run global `pnpm run format:check` and report unrelated baseline failures without editing out-of-scope docs. Exercise French, English, and unsupported locale behavior manually.

## Independent Forward Validation

When this frozen blueprint changes, run an independent generation scenario in an isolated temporary workspace. Derive the scenario and acceptance checks from the requested user behavior and accepted repository decisions: the same manually reviewed key set in both catalogs, fallback behavior, source-catalog key typing, localized accessibility copy, and safe typed-error presentation. Do not give the evaluator the current implementation, expected diff, intended answer, or previous generation output. Review observable behavior and architectural invariants, then keep only changes supported by that evidence.
