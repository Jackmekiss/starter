# Forms and Errors Blueprint

> Blueprint version: `1.3.0`

Use this frozen blueprint for controlled React Native forms, client validation, RTK Query mutation submission, typed presentation error resolution, and accessible field/submission feedback. The concrete login skeleton matches Starter's current primitives and contracts; adapt its names and rules rather than generating a parallel form system.

## Placeholders

- `<context>` / `<Context>`: bounded context, for example `auth` / `Auth`
- `<group>`: Expo Router route group containing the form screen
- `<feature>` / `<Feature>`: form action, for example `login` / `Login`
- `<Field>` / `<field>`: controlled field name
- `<FIELD>`: uppercase constant stem for a field's accessibility IDs
- `<action>` / `<verb-entity>`: kebab-case core use-case folder and file
- `<Payload>`: public application payload accepted by the use case
- `<VerbEntity>`: generated mutation hook stem
- `resolve<Context>ErrorMessage`: stable bounded-context presentation resolver
- `<translation-key>`: typed key added to every supported catalog

For a new form, replace all placeholders, define exact field values/defaults, and add every referenced translation key. Do not copy validation rules whose business meaning does not match the requested flow.

## Canonical Path Ownership

```text
src/
├── app/(<group>)/<feature>.tsx                     # keyboard/safe-area frame + form placement
├── components/
│   ├── <context>/<feature>-form.tsx                # RHF fields, local rules, submit, root error
│   └── ui/
│       ├── Button.tsx                              # press semantics + disabled styling
│       ├── Input.tsx                               # forwardRef controlled text input
│       ├── Textarea.tsx                            # conditional multiline input
│       └── Text.tsx                                # labels, headings, alert copy
├── app-runtime/app-runtime.ts                      # public generated mutation hook
├── hooks/localization/useTranslation.ts            # typed translation hook
└── translations/{en,fr,...}.json                    # all user-visible form/error copy

core/<context>/
├── apis/types.ts                                   # canonical action payload
├── use-cases/<action>/<verb-entity>.ts             # mutation behavior + durable update
├── gateways/<context>-gateway.ts                   # fallible business port
├── domain/<context>-error.ts                       # typed context failure union
└── adapters/presentation/<context>-error-message.ts # unknown failure -> safe localized copy
```

Ownership is deliberate:

- The route owns keyboard-aware scrolling, safe areas, title/copy, and form placement.
- The form owns React Hook Form values, default values, field validation messages, masks/presentation parsing, submission state, and root submission copy.
- The generated mutation hook owns transient pending/rejected metadata.
- The use case/gateway owns the business action and durable Redux update through `onQueryStarted`.
- The presentation resolver owns safe mapping from typed context failures to localized copy.
- The domain owns canonical business validation/invariants; the form may still reject obviously incomplete or malformed presentation input before submission.

Generated hooks always import from `@/app-runtime/app-runtime`. A form may directly import its stable core presentation resolver. It never imports `@/app-runtime/runtime/**`, a gateway, API instance, slice action, store, infrastructure error mapper, or SDK/HTTP error type.

## Required and Conditional Files

For every real controlled mutation form, require:

- a dedicated `src/components/<context>/<feature>-form.tsx`;
- a named values interface and complete `defaultValues`;
- `useForm` plus `Controller` for controlled React Native inputs;
- the generated mutation hook exported by `src/app-runtime/app-runtime.ts`;
- `.unwrap()` in the async submit handler;
- `catch (error)` with `error` kept as `unknown`;
- `resolve<Context>ErrorMessage(...)` with an explicit safe localized fallback;
- `setError("root", { message })` for submission/server copy;
- visible labels, stable label/error IDs, invalid/description semantics, live error announcements, and accurate busy/disabled state;
- translation keys in every supported locale.

Add only when needed:

- `Textarea` or another existing controlled primitive for a non-text field;
- `useWatch` when one field's mounted presentation genuinely depends on another;
- local input masking/parsing helpers beside the form;
- a context presentation resolver when the context has fallible UI actions;
- an action option on the resolver when one stable error needs different copy by flow;
- a field-level server error only when the typed domain contract identifies that exact field safely;
- focus management beyond React Hook Form's first-invalid-field behavior when a modal, async step, or platform control requires it;
- a success announcement when completion does not navigate or otherwise make success clear;
- a confirmation sheet/dialog for a destructive action.

If the mutation hook or typed error resolver does not exist, implement that prerequisite with `frontend-core`. Do not call a gateway directly or inspect infrastructure failures in the form.

## Form State Contract

| Concern                                   | Owner                | Canonical mechanism                       |
| ----------------------------------------- | -------------------- | ----------------------------------------- |
| Field values/touched/dirty/client errors  | form component       | React Hook Form                           |
| Pending/rejected mutation lifecycle       | RTK Query            | mutation result metadata                  |
| Submission message for mounted form       | form component       | `errors.root` via `setError("root", ...)` |
| Durable entity/session/entitlement change | bounded context      | use-case `onQueryStarted` -> Redux        |
| Stable business error meaning             | bounded context      | typed context error                       |
| Localized safe error copy                 | presentation adapter | `resolve<Context>ErrorMessage`            |
| Open help, reveal password, current step  | owning form          | local component state                     |

Never mirror form values into Redux, copy mutation loading/error into a slice, or set durable state manually after `.unwrap()`. A successful use case owns the durable update.

## Canonical React Hook Form Skeleton

This concrete Starter login form is a coherent baseline: it uses current primitives, existing typed translation keys, the public hook facade, and the auth presentation resolver.

```tsx
// src/components/auth/login-form.tsx
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useLoginMutation } from "@/app-runtime/app-runtime";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";
import { resolveAuthErrorMessage } from "@core/auth/adapters/presentation/auth-error-message";

/** Values owned by the email and password login form. */
interface LoginFormValues {
  /** Account email entered by the user. */
  email: string;
  /** Password entered by the user. */
  password: string;
}

const EMAIL_LABEL_ID = "login-email-label";
const EMAIL_ERROR_ID = "login-email-error";
const PASSWORD_LABEL_ID = "login-password-label";
const PASSWORD_ERROR_ID = "login-password-error";

/** Submits the login use-case and presents safe localized failures. */
export function LoginForm() {
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /** Submits canonical credentials through the auth context API. */
  async function handleSubmitLogin(values: LoginFormValues) {
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap();
    } catch (error) {
      setError("root", {
        message: resolveAuthErrorMessage(error, t, {
          action: "login",
          fallbackMessage: t("auth__login__error__unexpected"),
        }),
      });
    }
  }

  /** Runs form validation before dispatching the login mutation. */
  function handlePressLogin() {
    handleSubmit(handleSubmitLogin)();
  }

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="email"
        rules={{
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("auth__login__email_invalid"),
          },
          required: t("auth__login__email_required"),
        }}
        render={({ field: { onBlur, onChange, ref, value } }) => (
          <View className="gap-2">
            <Text nativeID={EMAIL_LABEL_ID} variant="small">
              {t("auth__login__email_label")}
            </Text>
            <Input
              ref={ref}
              aria-describedby={
                errors.email?.message ? EMAIL_ERROR_ID : undefined
              }
              aria-invalid={Boolean(errors.email)}
              aria-labelledby={EMAIL_LABEL_ID}
              accessibilityHint={errors.email?.message}
              accessibilityLabel={t("auth__login__email_label")}
              accessibilityLabelledBy={EMAIL_LABEL_ID}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!isLoading}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("auth__login__email_placeholder")}
              textContentType="emailAddress"
              value={value}
            />
            {errors.email?.message ? (
              <Text
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                className="text-destructive"
                nativeID={EMAIL_ERROR_ID}
                variant="muted"
              >
                {errors.email.message}
              </Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: t("auth__login__password_required") }}
        render={({ field: { onBlur, onChange, ref, value } }) => (
          <View className="gap-2">
            <Text nativeID={PASSWORD_LABEL_ID} variant="small">
              {t("auth__login__password_label")}
            </Text>
            <Input
              ref={ref}
              aria-describedby={
                errors.password?.message ? PASSWORD_ERROR_ID : undefined
              }
              aria-invalid={Boolean(errors.password)}
              aria-labelledby={PASSWORD_LABEL_ID}
              accessibilityHint={errors.password?.message}
              accessibilityLabel={t("auth__login__password_label")}
              accessibilityLabelledBy={PASSWORD_LABEL_ID}
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect={false}
              editable={!isLoading}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("auth__login__password_placeholder")}
              secureTextEntry
              textContentType="password"
              value={value}
            />
            {errors.password?.message ? (
              <Text
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                className="text-destructive"
                nativeID={PASSWORD_ERROR_ID}
                variant="muted"
              >
                {errors.password.message}
              </Text>
            ) : null}
          </View>
        )}
      />

      {errors.root?.message ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="text-destructive"
          variant="muted"
        >
          {errors.root.message}
        </Text>
      ) : null}

      <Button
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
        disabled={isLoading}
        onPress={handlePressLogin}
      >
        <Text>
          {isLoading ? t("auth__login__submitting") : t("auth__login__submit")}
        </Text>
      </Button>
    </View>
  );
}
```

`Controller`'s `render` callback is the required binding boundary; avoid additional inline event closures inside its JSX. Forward the field `ref` so React Hook Form can focus invalid inputs. Keep canonical submission transformations, such as trimming an email, in the submit boundary without rewriting the user's field on every keystroke.

## Generic Field Skeleton

For additional fields, preserve the same label/control/error association:

```tsx
const <FIELD>_LABEL_ID = "<feature>-<field>-label";
const <FIELD>_ERROR_ID = "<feature>-<field>-error";

<Controller
  control={control}
  name="<field>"
  rules={{ required: t("<translation-key>") }}
  render={({ field: { onBlur, onChange, ref, value } }) => (
    <View className="gap-2">
      <Text nativeID={<FIELD>_LABEL_ID} variant="small">
        {t("<translation-key>")}
      </Text>
      <Input
        ref={ref}
        aria-describedby={errors.<field>?.message ? <FIELD>_ERROR_ID : undefined}
        aria-invalid={Boolean(errors.<field>)}
        aria-labelledby={<FIELD>_LABEL_ID}
        accessibilityHint={errors.<field>?.message}
        accessibilityLabel={t("<translation-key>")}
        accessibilityLabelledBy={<FIELD>_LABEL_ID}
        editable={!isLoading}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
      />
      {errors.<field>?.message ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          className="text-destructive"
          nativeID={<FIELD>_ERROR_ID}
          variant="muted"
        >
          {errors.<field>.message}
        </Text>
      ) : null}
    </View>
  )}
/>
```

IDs must be unique within the mounted screen. Verify both web ARIA and native labelled-by behavior; keep `accessibilityLabel` as the native fallback when the visible-label association is not consistently announced.

## Mutation Submission Contract

The canonical mutation sequence is:

```text
press submit
  -> handleSubmit validates local fields
  -> generated mutation hook receives canonical payload
  -> .unwrap() resolves success or throws unknown rejection
  -> use case calls injected gateway
  -> onQueryStarted awaits queryFulfilled and updates durable Redux state
  -> success UI follows selector/navigation state
  -> failure passes unknown to resolve<Context>ErrorMessage
  -> setError("root", { message }) exposes localized submission feedback
```

Use this minimal submit skeleton:

```tsx
const [<verbEntity>, { isLoading }] = use<VerbEntity>Mutation();

/** Submits canonical <feature> values through the context mutation. */
async function handleSubmit<Feature>(values: <Feature>FormValues) {
  try {
    await <verbEntity>(to<Payload>(values)).unwrap();
  } catch (error) {
    setError("root", {
      message: resolve<Context>ErrorMessage(error, t, {
        action: "<feature>",
        fallbackMessage: t("<translation-key>"),
      }),
    });
  }
}
```

Keep `error` unknown. Do not cast to the context error, because RTK Query, middleware, programmer faults, and unexpected values can still reach the catch boundary. The resolver must safely narrow.

## Presentation Error Resolver Contract

The resolver is a stable core presentation adapter, not form logic. It receives `unknown`, a typed i18next function, and flow options with an explicit fallback. It may map:

- stable context business codes to context-specific translation keys;
- reusable technical kinds such as network, timeout, rate-limited, and unavailable to common safe keys;
- action-sensitive codes only when the caller supplies the matching action;
- everything unknown, unauthenticated, forbidden, or unexpected to the caller's safe fallback unless accepted behavior says otherwise.

Its public shape is:

```ts
import type { TFunction } from "i18next";

/** Presentation context required to resolve the rejected <feature> action. */
interface Resolve<Context>ErrorMessageOptions {
  /** Context action that rejected. */
  action?: "<feature>";
  /** Safe localized copy for unknown or unmapped failures. */
  fallbackMessage: string;
}

/** Resolves an unknown context rejection into safe localized copy. */
export function resolve<Context>ErrorMessage(
  error: unknown,
  resolveMessage: TFunction,
  options: Resolve<Context>ErrorMessageOptions,
): string;
```

Add or change the resolver with `frontend-core` when the domain error contract changes. Never display `error.message`, HTTP status text, raw backend copy, an SDK exception, stack output, or a stringified unknown value.

## Field, Root, and Query Errors

- Use field errors for local required/format/length rules tied to one visible control.
- Use `errors.root` for mutation, server, or form-wide rejection copy.
- Set a server error on a specific field only when a stable typed business code identifies that field and the requested UX calls for it.
- A query owner renders query failure outside React Hook Form, resolves it through the same context presentation adapter when error-specific copy is useful, and keeps retry local to the failed request.
- Do not persist transient mutation/query errors in Redux just to select them into the UI.
- Do not conflate an empty successful result with a request failure.

## Keyboard and Submission Behavior

- Put the form in the route's existing keyboard-aware scroll frame when the keyboard can cover fields or the submit action.
- Set appropriate `autoComplete`, `textContentType`, `keyboardType`, capitalization, correction, and secure-entry props.
- Use `keyboardShouldPersistTaps="handled"` in the owning scroll container when taps must reach fields/actions while the keyboard is open.
- Disable editable fields and the submit action while the mutation is loading unless the accepted UX explicitly supports concurrent edits.
- Prevent duplicate submissions through mutation state; do not add a second local `isSubmitting` flag.
- Use a named press handler that invokes `handleSubmit`; on web, wire real form submit semantics as well when the route renders an HTML form boundary.
- Keep destructive confirmation separate from the mutation form and restore focus after modal/sheet dismissal.

## Accessibility Contract

- Every field has a persistent visible localized label; a placeholder is supplementary, never the only name.
- The input references the label and active error, reports invalid state, and forwards the field ref.
- Error copy is visible, localized, and announced politely as an alert without revealing raw technical detail.
- The submit control exposes `busy` and `disabled` accurately and changes visible text when work is in progress.
- Required, format, and password rules are communicated in text, not only by border color.
- Focus reaches the first invalid field and remains predictable after async errors, navigation, confirmation dialogs, and keyboard dismissal.
- Password reveal controls, picker triggers, checkboxes, and toggles expose name, role, checked/expanded state, and sufficient touch target.
- Do not make the whole form one accessible element; fields, errors, and actions must remain individually operable.

## Invariants

- Real controlled forms use `useForm` and `Controller`; field state stays local to the form.
- Every values field has a deterministic default value.
- Mutations use the public runtime-facade hook and `.unwrap()`.
- Caught failures stay `unknown` and pass through the owning context's presentation resolver.
- Submission failures use `setError("root", ...)` with safe localized fallback copy.
- Durable state changes only through the successful use case/Redux flow, not manual form dispatch.
- Field labels, invalid state, described errors, live announcements, and busy/disabled state remain synchronized.
- Domain invariants remain in core; presentation parsing and obviously incomplete input remain with the form.

## Anti-Patterns

- Several `useState` calls replacing React Hook Form in a production form.
- A form importing a runtime-internal hook, gateway, API instance, store, slice action, infrastructure mapper, or SDK/HTTP exception.
- Awaiting a mutation trigger without `.unwrap()` and then assuming `catch` handles rejection.
- Casting `catch` values to a context error or reading `error.message`, `status`, response body, or backend code in the form.
- Displaying raw exception/backend strings or using an English hard-coded fallback.
- Copying mutation pending/error state into Redux or a second local boolean.
- Setting every server rejection on a guessed field instead of `root`.
- Placeholder-only fields, errors indicated only by color, inaccessible password reveal icons, or stale busy/disabled state.
- Inline submit/business logic in JSX or a route screen owning fields after a dedicated form exists.
- Sending presentation-only formatting, confirm-password fields, or UI state through the business payload.

## Validation and Review Checklist

- [ ] Requested form/error behavior and accepted, non-superseded repository decisions remain normative; copied validation from another form does not override them.
- [ ] Values, defaults, field rules, and payload conversion match the requested action exactly.
- [ ] Every controlled native field uses `Controller`, forwards `ref`, and has one state owner.
- [ ] The generated mutation hook imports from `@/app-runtime/app-runtime` and submission uses `.unwrap()`.
- [ ] Unknown failures pass to the correct presentation resolver with action context and a localized safe fallback.
- [ ] Submission errors use `setError("root", ...)`; no transient error/loading state is duplicated in Redux.
- [ ] Success relies on the use case's durable update and the intended navigation/selector response.
- [ ] Visible labels, unique IDs, invalid/description relationships, live alerts, focus, busy, disabled, and checked/expanded semantics are accurate.
- [ ] Keyboard avoidance, return-key behavior, autofill, secure input, dismissal, and duplicate-submit prevention work on iOS and Android.
- [ ] Empty, valid, invalid, pending, success, mapped business failure, technical failure, and unknown fallback paths are exercised.
- [ ] User-visible strings exist in every locale and no raw backend/exception message is rendered.
- [ ] Light/dark error, focus, disabled, and autofill states remain legible.
- [ ] Typecheck and relevant lint pass; targeted `pnpm exec oxfmt <changed-files> --check` passes, and global `pnpm run format:check` was run with unrelated baseline failures reported rather than repaired out of scope.
