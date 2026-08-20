---
name: frontend-ui
description: "Implement, refactor, or audit Starter's Expo and React Native presentation layer: Expo Router routes and screens, runtime-facade consumption, feature components and shared primitives, React Hook Form, typed error presentation, i18next localization, NativeWind v5 with Tailwind CSS v4 and CVA, light/dark themes, third-party style interop, and accessibility for VoiceOver, TalkBack, Appium, or XCUITest. Do not use for backend work or core-only bounded-context, gateway, adapter, Redux, or RTK Query API design."
---

# Frontend UI

Build presentation code that consumes Starter's frontend core without redefining its business behavior.

## Source of Truth

Apply, in order:

1. The requested user experience and scope.
2. Accepted, non-superseded repository decisions.
3. Existing primitives, routes, feature components, localization, and theme code.
4. The frozen blueprints in this skill.

Preserve visible design and interaction behavior during accessibility-only work unless the user explicitly requests visual or behavioral changes.

## Workflow

1. Inspect the owning route, component, existing UI primitives, runtime facade, translations, and theme tokens.
2. Read [ownership-data-flow.md](references/ownership-data-flow.md) to decide screen, section, primitive, and core ownership.
3. Read only the references required by the task:
   - routes or screen orchestration: [routes-screens-blueprint.md](references/routes-screens-blueprint.md)
   - components, primitives, or layout: [components-layout-blueprint.md](references/components-layout-blueprint.md)
   - forms or mutation errors: [forms-errors-blueprint.md](references/forms-errors-blueprint.md)
   - NativeWind, CVA, theme, or third-party interop: [nativewind-theme-blueprint.md](references/nativewind-theme-blueprint.md)
   - translation runtime or copy: [localization-blueprint.md](references/localization-blueprint.md)
   - accessibility or native automation semantics: [accessibility-blueprint.md](references/accessibility-blueprint.md)
4. Reuse the runtime facade and existing primitives before adding new presentation infrastructure.
5. Keep the change as local as its responsibility allows; use `frontend-core` only when business behavior or runtime core wiring must change.
6. Derive any changed UI test from the requested outcome and accepted decisions before asserting rendered behavior; do not copy expectations from implementation output.
7. Validate semantics, presentation states, typing, lint, and formatting.

## Non-Negotiable Boundaries

- In `src/app/**` and `src/components/**`, import generated query and mutation hooks from `@/app-runtime/app-runtime`, not from runtime internals, concrete adapters, or core API internals. Internal `src/app-runtime/**` composition may import its owning runtime module directly.
- Keep routes and screens focused on routing, loading/error gates, and section composition.
- Preserve Expo Router reserved names and lowercase route filenames; name feature files and folders in kebab-case, shared primitive files in PascalCase, and hooks in camelCase with a `use` prefix.
- Keep generic primitives prop-driven; feature sections may own simple selectors, local navigation, formatting, and interaction state.
- Use `react-hook-form` with `Controller` for real controlled forms.
- Consume mutations with `.unwrap()` and pass unknown failures to the bounded context's presentation resolver.
- Build from React Native primitives plus Starter's local primitives and CVA; do not introduce gluestack-ui providers or components by default.
- Use NativeWind v5 utility classes and Tailwind v4 tokens; use a local `styled()` adapter for incompatible third-party native components.
- Keep accessible names, roles, states, announcements, and automation exposure accurate without duplicating the accessibility tree.
- Keep user-visible copy in typed translation catalogs; never display raw backend or exception messages.
- Treat accepted, non-superseded decisions as normative and forward tests as independent behavioral evidence, not snapshots of incidental markup or styling.

## Scope Boundary

This skill owns `src/app/**`, `src/components/**`, presentation hooks, localization, translations, theme constants, and CSS. `src/app/_layout.tsx` is presentation-owned unless a change also alters API, gateway, middleware, or store composition; then use `frontend-core` first.

## Validation

- Exercise loading, empty, success, failure, disabled, and retry states affected by the change.
- Verify light/dark behavior when theme tokens or imperative colors change.
- Verify accessibility semantics and that accessibility-only diffs contain no unrequested visual changes.
- Run `pnpm run typecheck` and relevant lint/tests. Require `pnpm exec oxfmt <changed-files> --check` for every modified file, then run global `pnpm run format:check` as a regression check; distinguish unrelated baseline failures and do not rewrite out-of-scope docs to make it green.
