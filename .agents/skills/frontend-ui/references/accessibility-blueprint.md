# Frozen Blueprint: Accessible React Native Presentation

> Blueprint version: `1.3.0`

Use this reference while implementing or auditing routes, components, forms, overlays, dynamic feedback, images, or custom gestures for VoiceOver, TalkBack, React Native Web, Appium, and XCUITest. Accessibility is part of each owning component; it is not a separate visual system.

Accepted, non-superseded repository decisions remain normative. Accessibility work preserves the requested experience and existing visible design unless the user explicitly authorizes a visual or interaction change.

## Placeholder Contract

Angle-bracket names are deliberate placeholders:

- **<context>** and **<feature>**: the bounded context and presentation flow.
- **<control_action>**: the action a control performs, such as close_dialog or save_profile.
- **<label_key>**, **<hint_key>**, and **<error_key>**: typed flat translation keys.
- **<screen>.<element>**: a stable, nonlocalized automation identifier.
- **<dialog_title_id>**, **<field_label_id>**, and **<field_error_id>**: unique, deterministic relation IDs within one mounted screen.

Replace every placeholder. Accessible names describe purpose or action, never an icon's shape. Test identifiers remain stable across localization and copy changes.

## Canonical Tree and Ownership

```text
src/
├── app/
│   └── <route>/index.tsx                              [required when in scope] screen heading and route states
├── components/
│   ├── <context>/
│   │   └── <feature>.tsx                              [required when in scope] feature labels, state, errors
│   └── ui/
│       ├── Button.tsx                                 [required baseline] base button role and press semantics
│       ├── Input.tsx                                  [required baseline] forwards native/ARIA field props
│       ├── Text.tsx                                   [required baseline] heading roles and levels
│       ├── Icon.tsx                                   [required baseline] visual icon; caller decides decoration
│       └── BottomSheetModal.tsx                       [conditional] shared overlay semantics
├── hooks/
│   └── localization/useTranslation.ts                 [required for localized accessible copy]
└── translations/
    ├── en.json                                        [required for every new accessible string]
    └── fr.json                                        [required for every new accessible string]

<existing-e2e-root>/
└── <feature>.accessibility.<platform>                  [conditional] only when a harness exists or is requested
```

There is no required central accessibility helper or parallel accessibility component tree. Shared primitives own invariant semantics; feature call sites own purpose-specific names, hints, values, states, relationships, and any test IDs required by an existing automation contract. Routes own screen-level headings, loading/empty/error gates, and navigation meaning.

Do not invent an Appium, Detox, or XCUITest directory or runner merely for a component change. The Starter currently has no discovered e2e command; do not add an automation harness to this Starter.

## Preserve the UI

An accessibility-only change must not alter layout, spacing, typography, colors, icon size, variants, navigation, keyboard behavior, focus timing, gesture thresholds, submission behavior, or visible error placement unless that change is explicitly requested.

Semantic props, relationships, localized nonvisual copy, and nonoverlapping **hitSlop** are normally nonvisual. Treat focus movement, modal dismissal, gesture alternatives, and announcement timing as behavior: add or change them only when required by the requested accessible behavior and validate them on the affected platform.

## Canonical Native and ARIA Use

Freeze the exact semantic combinations already established by the Starter. React Native aliases can feed the same native property, so do not duplicate every native prop with an ARIA alias.

| Meaning              | Canonical Starter props                                                                                     | Rule                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessible name      | **accessibilityLabel**                                                                                      | Prefer visible text when it already names the control; icon-only controls receive this localized label. Do not also add **aria-label** by default. |
| Visible field label  | **accessibilityLabel**, **accessibilityLabelledBy** to **nativeID**, and **aria-labelledby** to the same ID | This is the current LoginForm cross-platform relation pattern.                                                                                     |
| Field error          | **accessibilityHint**, conditional **aria-describedby** to error **nativeID**, and **aria-invalid**         | Remove all conditional values when the error clears.                                                                                               |
| Button role          | **accessibilityRole="button"**                                                                              | The shared Button does not duplicate **role="button"**.                                                                                            |
| Button state         | functional **disabled** plus **accessibilityState**                                                         | Do not duplicate with **aria-busy** or **aria-disabled** without an inspected web need.                                                            |
| Heading              | **role="heading"** plus **aria-level**                                                                      | This is the current shared Text pattern because heading levels are web semantics.                                                                  |
| Dynamic error        | **accessibilityRole="alert"** plus **accessibilityLiveRegion="polite"**                                     | Do not also add **role="alert"** or **aria-live** by default.                                                                                      |
| Decorative duplicate | **accessible={false}**, plus native hiding props when required                                              | Add **aria-hidden** only after verifying a concrete web exposure defect.                                                                           |
| Modal surface        | native modal isolation, label relations, and dismissal props supported by the installed overlay             | Add **role="dialog"** or **aria-modal** only after inspecting the rendered web component and need.                                                 |
| Custom range         | **accessibilityRole="adjustable"**, **accessibilityValue**, and **accessibilityActions**                    | Add web slider ARIA only when the concrete web implementation requires it.                                                                         |

When a concrete React Native Web audit proves an ARIA counterpart is necessary, add only that counterpart, keep its value consistent with the native semantic source, and record the platform reason in review. Do not impose generic paired aliases across primitives.

## Shared Primitive Semantics

### Buttons

The shared button owns the invariant role and forwards caller semantics to its underlying `Pressable`. This is the exact semantic fragment; keep the surrounding `TextClassContext` and CVA implementation from `Button.tsx` unchanged:

```tsx
<Pressable
  accessibilityRole="button"
  className={cn(
    props.disabled && "opacity-50",
    buttonVariants({ variant, size }),
    className,
  )}
  {...props}
/>
```

Call sites own state and action-specific naming. Visible, unambiguous button text supplies the name; do not repeat it unless a platform needs an explicit fallback.

Icon-only control skeleton:

```tsx
const accessibilityLabel = t("profile__edit__close_label");

<Button
  accessibilityLabel={accessibilityLabel}
  accessibilityState={{ busy: isClosing, disabled: isClosing }}
  disabled={isClosing}
  hitSlop={8}
  onPress={handleClose}
  size="icon"
  variant="ghost"
>
  <Icon accessible={false} as={X} importantForAccessibility="no" />
</Button>;
```

Use an **accessibilityHint** and matching localized copy only when the outcome is not clear from the action label. Loading state does not change an action's identity; expose **busy** and **disabled** instead of renaming it to a vague status.

Add `testID="<screen>.<control_action>"` to the `Button` only when an existing or requested native automation contract needs a stable identifier. Starter does not add test IDs to ordinary controls by default.

### Headings

The shared **Text** primitive maps heading variants to web heading roles and levels, as in the current Starter:

```tsx
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

<Component
  role={variant ? ROLE[variant] : undefined}
  aria-level={variant ? ARIA_LEVEL[variant] : undefined}
  {...props}
/>;
```

Use one meaningful level-one heading per screen when the design has a screen title. Keep the visual variant and semantic level aligned; do not choose a heading variant only for font size.

## Forms and Errors

Fields need a visible label, a programmatic name, invalid state, a conditional error relationship, and an announced error. Keep stable IDs outside the component render.

```tsx
import { Controller } from "react-hook-form";
import { View } from "react-native";

import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

const EMAIL_LABEL_ID = "login-email-label";
const EMAIL_ERROR_ID = "login-email-error";

<Controller
  control={control}
  name="email"
  rules={{
    required: t("auth__login__email_required"),
  }}
  render={({ field: { onBlur, onChange, ref, value } }) => {
    const message = errors.email?.message;
    const label = t("auth__login__email_label");

    return (
      <View className="gap-2">
        <Text nativeID={EMAIL_LABEL_ID} variant="small">
          {label}
        </Text>
        <Input
          ref={ref}
          accessibilityHint={message}
          accessibilityLabel={label}
          accessibilityLabelledBy={EMAIL_LABEL_ID}
          aria-describedby={message ? EMAIL_ERROR_ID : undefined}
          aria-invalid={Boolean(message)}
          aria-labelledby={EMAIL_LABEL_ID}
          autoComplete="email"
          editable={!isLoading}
          keyboardType="email-address"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
        />
        {message ? (
          <Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            className="text-destructive"
            nativeID={EMAIL_ERROR_ID}
            variant="muted"
          >
            {message}
          </Text>
        ) : null}
      </View>
    );
  }}
/>;
```

For a submission or form-root failure, keep the localized copy in **setError("root", ...)** and render one live alert:

```tsx
{
  errors.root?.message ? (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="text-destructive"
      variant="muted"
    >
      {errors.root.message}
    </Text>
  ) : null;
}
```

Rules:

- Use the same localized error string for visible text and the native field hint; **aria-describedby** points to the visible error on web.
- Remove invalid state, hint, description relation, and error node when the error clears.
- Announce the newly mounted error once. Do not also call an imperative announcement API for the same update unless platform testing proves the live region is insufficient.
- Root errors describe the failed action; field errors describe that field. Do not attach the root error as every field's hint.
- Never announce or display raw exceptions, backend messages, HTTP details, or stable error codes.

## Decorative and Duplicate Elements

Hide a purely decorative or repeated visual from every relevant accessibility surface:

```tsx
<Image
  accessibilityElementsHidden
  accessible={false}
  importantForAccessibility="no"
  source={decorativeSource}
/>
```

For an icon beside visible text inside one control, hide the icon and let the text name the parent control. For a meaningful standalone image, do the opposite: keep it exposed with a localized label and the correct image role.

Do not set **accessible={true}** on a layout container merely to make it discoverable; that can flatten useful descendants into one inaccessible group. Do not hide content just to make a test selector easier.

## Touch Targets and hitSlop

Keep established visual control dimensions. When a compact control needs a larger target, add **hitSlop** to the semantic **Pressable** without moving or resizing it:

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={label}
  hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
  onPress={handlePress}
/>
```

Verify expanded targets do not overlap adjacent controls or intercept scroll/gesture regions. A large wrapper is not a substitute if Appium or XCUITest still sees the actual action as a generic descendant.

## Overlays, Dialogs, and Bottom Sheets

Prefer the overlay library's verified accessibility and focus behavior. The shared wrapper owns modal semantics and dismissal wiring; the feature supplies localized title and action labels.

Dialog surface fragment:

```tsx
const title = t("profile__delete__dialog_title");

<View
  accessibilityLabel={title}
  accessibilityLabelledBy={DIALOG_TITLE_ID}
  accessibilityViewIsModal
  aria-labelledby={DIALOG_TITLE_ID}
  onAccessibilityEscape={handleDismiss}
>
  <Text nativeID={DIALOG_TITLE_ID} variant="h2">
    {title}
  </Text>
  {children}
</View>;
```

Do not set **accessible={true}** on the dialog surface; its title, content, and controls must remain independently navigable.

Hide the background sibling while the overlay is open:

```tsx
<View
  accessibilityElementsHidden={isOpen}
  importantForAccessibility={isOpen ? "no-hide-descendants" : "auto"}
>
  {screenContent}
</View>
```

Starter's local `BottomSheetModalProvider` composes Gorhom's provider first and a private accessibility guard second. This fixed order makes the guarded application `View` a native sibling of Gorhom's `PortalHost`; never invert or reconstruct the pair at call sites. Localization and theme providers are ancestors of the local provider so stored portal nodes receive those contexts. The guard tracks presented sheets in order, wraps the non-portaled sibling with `aria-hidden`, `accessibilityElementsHidden`, and `importantForAccessibility="no-hide-descendants"`, and restores traversal only after `onDismiss`. When the first sheet registers, it synchronously adds one Android `BackHandler` after the already-mounted router so the top sheet gets first refusal; it removes that listener when the final sheet unregisters. Every `BottomSheetModal` registers synchronously before `present()`, unregisters on dismissal/unmount, and uses `stackBehavior="replace"` so a minimized prior portal cannot remain traversable. Its custom decorative background replaces Gorhom's hard-coded English adjustable background semantics. Hardware back, the dismissing backdrop, the imperative `dismiss()`, and `onAccessibilityEscape` all converge on Gorhom dismissal before the guard is released; do not create parallel visibility state in feature code.

Also verify:

- the opening trigger and all overlay actions expose names, roles, and states, plus stable test IDs only when an automation contract requires them;
- VoiceOver focus enters useful overlay content and returns to a sensible element after dismissal when the library does not already manage it;
- TalkBack cannot traverse background siblings;
- hardware back, backdrop press, close control, and iOS accessibility escape follow the same allowed dismissal policy and restore background traversal only after dismissal completes;
- dynamic sheet positions do not strand focus or expose off-screen duplicate content.

Add a `testID` to the semantic dialog surface only when an existing or requested automation contract needs it.

Do not add a focus trap, timeout, or imperative focus call without checking the installed overlay's behavior first.

## Custom Gestures

Prefer **Pressable**, **Switch**, **TextInput**, and other semantic native controls. If a product interaction truly requires a custom pan, swipe, canvas, map marker, or composed gesture, expose an equivalent focusable action path on the same logical control.

Adjustable gesture skeleton:

```tsx
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { useTranslation } from "@/hooks/localization/useTranslation";

import type { AccessibilityActionEvent } from "react-native";

/** Props accepted by the accessible quantity adjuster. */
interface QuantityAdjusterProps {
  /** Highest allowed quantity. */
  maximum: number;
  /** Lowest allowed quantity. */
  minimum: number;
  /** Applies a quantity chosen through touch or accessibility. */
  onChange: (value: number) => void;
  /** Current quantity. */
  value: number;
}

/** Adjustable quantity control with equivalent accessibility actions. */
export function QuantityAdjuster({
  maximum,
  minimum,
  onChange,
  value,
}: QuantityAdjusterProps) {
  const { t } = useTranslation();

  /** Increases the current value without exceeding its maximum. */
  function handleIncrement() {
    onChange(Math.min(value + 1, maximum));
  }

  /** Decreases the current value without crossing its minimum. */
  function handleDecrement() {
    onChange(Math.max(value - 1, minimum));
  }

  /** Routes screen-reader increment and decrement actions. */
  function handleAccessibilityAction(event: AccessibilityActionEvent) {
    if (event.nativeEvent.actionName === "increment") handleIncrement();
    if (event.nativeEvent.actionName === "decrement") handleDecrement();
  }

  const label = t("cart__quantity__label");
  const valueText = t("cart__quantity__value", { count: value });

  return (
    <View
      accessible
      accessibilityActions={[
        { label: t("cart__quantity__increase"), name: "increment" },
        { label: t("cart__quantity__decrease"), name: "decrement" },
      ]}
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={{
        max: maximum,
        min: minimum,
        now: value,
        text: valueText,
      }}
      onAccessibilityAction={handleAccessibilityAction}
    >
      <Text>{valueText}</Text>
    </View>
  );
}
```

The existing gesture handler should call the same increment/decrement or activation functions. Expose selected, checked, expanded, disabled, busy, or range state whenever it changes the control's meaning. A screen-reader action must not be a different business path.

Add a stable `testID` to the adjustable `View` only when an existing or requested automation contract requires it.

For spatial content such as maps or canvases, provide a semantic list or controls for the same essential actions when individual drawn elements cannot be navigated reliably.

## Appium and XCUITest Testability

Semantics come first. Do not add `testID` by default; when an existing or requested native automation contract needs identifiers, automation should select the semantic native element:

- Put a stable, unique **testID** on the actual **Pressable**, **TextInput**, switch, adjustable view, or dialog surface, not only on a styling wrapper.
- Use business-purpose IDs such as **profile.save**, not translated labels, array indices, coordinates, CSS classes, or copy.
- Keep **accessibilityLabel** localized for users. Do not overload spoken copy with an automation token.
- Set the correct role so a button is exposed as a button rather than a generic **XCUIElementTypeOther**.
- Keep one exposed action element; nested accessible wrappers create ambiguous Appium and XCUITest matches.
- Native tap should target the element. Coordinate taps are a diagnostic fallback, not the acceptance path.
- Preserve IDs across refactors when the user-visible action remains the same.

When a harness exists, assert role/type, accessible name, enabled/selected state, stable identifier, announcement or visible error, and successful native activation. Do not treat a selector match alone as proof of accessibility.

## Invariants

- Every actionable element has a truthful role, accessible name, current state, and equivalent activation path.
- Native semantics use the current Starter combinations; ARIA aliases are added only for a concrete inspected web need.
- Every accessible string is localized through the canonical catalogs.
- Visible form labels and conditional errors are programmatically related to their fields.
- Dynamic errors and important status changes are announced once at appropriate urgency.
- Decorative or duplicate visuals are absent from the accessibility tree; meaningful content remains present.
- Overlay background content is hidden while modal content remains navigable and dismissible.
- Custom gestures expose equivalent accessibility actions and values.
- When an automation contract requires stable identifiers, they live on semantic native elements.
- Accessibility-only diffs preserve visuals and unrelated interaction behavior.

## Anti-Patterns

- Using a generic **View** with **onTouch**, a gesture detector, or a test ID instead of a semantic control when **Pressable** or another native control fits.
- Naming an icon-only button “X icon,” “chevron,” or “menu dots” instead of its localized action.
- Setting **disabled** without accessibility state, or exposing stale selected, checked, expanded, busy, or range values.
- Rendering a visual error without label/description relationships or live-region behavior.
- Combining a live region and an imperative announcement for the same change without platform evidence.
- Making an entire form, dialog, list, or card accessible as one element and flattening actionable descendants.
- Leaving decorative icons, duplicated labels, backdrops, skeletons, or off-screen overlay content exposed.
- Adding **hitSlop** that overlaps another action or placing the test ID on a nonpressable parent.
- Selecting elements by localized copy, position, or coordinates while the semantic element remains generic.
- Changing layout, copy, focus order, navigation, keyboard behavior, or gestures during an accessibility-only audit without explicit scope.

## Validation and Review Checklist

- [ ] Traverse the affected screen with VoiceOver and TalkBack in logical order.
- [ ] Every control announces an accurate localized name, role, hint only when useful, and current state/value.
- [ ] Button roles/states and alert announcements are not duplicated with generic ARIA aliases; any added ARIA prop has a verified web reason.
- [ ] Heading levels communicate screen structure without being chosen merely for appearance.
- [ ] Icon-only controls have localized action labels; decorative/duplicate icons and images are hidden.
- [ ] Every field has a visible/programmatic label, invalid state, conditional error relation, and one announced localized error.
- [ ] Root errors, loading, completion, and retry feedback have appropriate live behavior without duplicate announcements.
- [ ] Disabled, busy, selected, checked, expanded, and adjustable states match visible/runtime state.
- [ ] **hitSlop** improves compact targets without overlapping nearby controls or gestures.
- [ ] Overlays isolate background content, expose dialog content and dismissal, and manage focus sensibly on iOS and Android.
- [ ] Custom gestures have equivalent screen-reader actions and do not create a second business path.
- [ ] Appium/XCUITest can find and native-tap the semantic element by a stable ID; buttons are not generic native elements.
- [ ] The accessibility-only diff contains no unrequested visual or unrelated behavior changes.
- [ ] No angle-bracket placeholder remains.

## Independent Forward Validation
