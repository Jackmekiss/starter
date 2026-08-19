---
name: accessibility
description: "Audit and improve semantic accessibility in this React Native and Expo repository. Use for accessibility, a11y, VoiceOver, TalkBack, Appium native-tap, XCUITest element exposure, missing labels or roles, inaccessible form controls, control states, and screen-reader announcements. Preserve the existing visual layout and interaction behavior unless the user explicitly requests visual or behavioral changes."
---

# Accessibility

Improve the native accessibility tree without changing the visible design.

## Scope

Prefer semantic React Native properties:

- `accessibilityLabel` for controls whose visible content does not provide a clear accessible name
- `accessibilityRole` matching the action
- `accessibilityState` for `disabled`, `selected`, `checked`, `expanded`, and `busy`
- `accessibilityLiveRegion` and `accessibilityRole="alert"` for dynamic errors or important feedback
- `accessible` and `importantForAccessibility` to remove decorative or duplicated content from the accessibility tree
- `accessibilityHint` only when the result of an action is not clear from its label

Keep accessible copy in the repository's existing translation system. Label icon-only controls by their action rather than the icon's appearance.

## Preserve the UI

Do not change layout, typography, color, icon size, visual variants, focus timing, keyboard behavior, navigation, submission behavior, component structure, or visible error placement unless explicitly requested.

`hitSlop` may enlarge a touch target without changing visual size when it will not overlap nearby controls.

## Workflow

1. Inspect the shared UI primitive before changing individual call sites.
2. Audit interactive elements, inputs, dynamic messages, images, overlays, maps, and custom gesture controls in scope.
3. Apply the smallest semantic change that fixes the accessibility tree.
4. Search for equivalent instances of the same defect.
5. Remove unrelated visual, focus, or behavior changes from the final diff.

For Appium iOS native-tap failures, expose a button with `accessibilityRole="button"` rather than as `XCUIElementTypeOther`. Coordinate taps are an automation fallback, not a substitute for correct semantics.

## Validation

- Confirm controls have accurate roles, names, and states.
- Confirm dynamic errors are announced without duplication.
- Confirm the final diff contains no unrequested visual changes.
- Run targeted formatting and TypeScript checks, then relevant existing tests.
- Do not add component-only tests; repository tests belong to use-cases.
- Do not launch Expo unless explicitly requested.
