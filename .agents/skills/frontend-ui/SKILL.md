---
name: frontend-ui
description: "Implement, refactor, document, add Storybook stories for, or audit Starter's Expo and React Native presentation layer: Expo Router screens, the local gluestack-ui v5 design system, Storybook on device, runtime-facade consumption, forms and typed errors, localization, NativeWind v5/Tailwind v4, themes, third-party interop, and native accessibility. Do not use for backend work or core-only bounded-context, gateway, adapter, Redux, or RTK Query API design."
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

1. Inspect the owning route, component, existing UI primitives and stories, runtime facade, translations, and theme tokens.
2. Read [ownership-data-flow.md](references/ownership-data-flow.md) to decide screen, section, primitive, and core ownership.
3. Read only the references required by the task:
   - routes or screen orchestration: [routes-screens-blueprint.md](references/routes-screens-blueprint.md)
   - components, primitives, or layout: [components-layout-blueprint.md](references/components-layout-blueprint.md)
   - forms or mutation errors: [forms-errors-blueprint.md](references/forms-errors-blueprint.md)
   - NativeWind, CVA, theme, or third-party interop: [nativewind-theme-blueprint.md](references/nativewind-theme-blueprint.md)
   - translation runtime or copy: [localization-blueprint.md](references/localization-blueprint.md)
   - accessibility or native automation semantics: [accessibility-blueprint.md](references/accessibility-blueprint.md)
   - Storybook configuration, stories, provider isolation, or visual review: [storybook-blueprint.md](references/storybook-blueprint.md)
4. Reuse the runtime facade and existing primitives before adding new presentation infrastructure.
5. Keep the change as local as its responsibility allows; use `frontend-core` only when business behavior or runtime core wiring must change.
6. Validate semantics, presentation states, typing, lint, and formatting.

## Non-Negotiable Boundaries

- In `src/app/**` and `src/components/**`, import generated query and mutation hooks from `@/app-runtime/app-runtime`, not from runtime internals, concrete adapters, or core API internals. Internal `src/app-runtime/**` composition may import its owning runtime module directly.
- Keep routes and screens focused on routing, loading/error gates, and section composition.
- Preserve Expo Router reserved names and lowercase route filenames; name feature files and folders in kebab-case, shared primitive files in PascalCase, and hooks in camelCase with a `use` prefix.
- Keep generic primitives prop-driven; feature sections may own simple selectors, local navigation, formatting, and interaction state.
- Use `react-hook-form` with `Controller` for real controlled forms.
- Consume mutations with `.unwrap()` and pass unknown failures to the bounded context's presentation resolver.
- Preserve Starter's local gluestack-ui v5 design system: Poppins, 24-point screen spacing, semantic brand/status tokens, shared radii, canonical component APIs, and the gluestack Menu.
- Select Poppins weights through the explicit `font-body-*` face utilities frozen in the theme
  blueprint; generic weight utilities do not select custom font files reliably on native.
- Use gluestack-ui v5 as the sole component-system vocabulary. Treat React Native layout primitives and focused `@rn-primitives` as implementation details, not a second design system; keep reusable stateful controls behind locally owned component APIs. Preserve the canonical `Menu` implementation built with `@gluestack-ui/core/menu/creator` and `tva`, with `OverlayProvider` mounted in both application and Storybook roots.
- Use NativeWind v5 utility classes and Tailwind v4 tokens; use a local `styled()` adapter for incompatible third-party native components.
- Keep direct Storybook presentation-only through the official React Native entry-point swap. The accepted `EXPO_PUBLIC_STORYBOOK_ENABLED=true` in-app development mode may expose the guarded `/storybook` route and its Home launcher; it intentionally trades normal-bundle isolation for in-app navigation and must never be enabled for production builds. Stories do not import the Redux store, persistor, gateways, or runtime internals.
- Keep accessible names, roles, states, announcements, and automation exposure accurate without duplicating the accessibility tree.
- Keep user-visible copy in typed translation catalogs; never display raw backend or exception messages.
- Do not add automated tests or test-only infrastructure.
- Treat accepted, non-superseded decisions as normative.

## Scope Boundary

This skill owns `src/app/**`, `src/components/**`, `.rnstorybook/**`, presentation hooks, localization, translations, theme constants, CSS, and presentation-only Storybook wiring in package/Metro/TypeScript/tooling configuration. `src/app/_layout.tsx` is presentation-owned unless a change also alters API, gateway, middleware, or store composition; then use `frontend-core` first.

## Validation

- Exercise loading, empty, success, failure, disabled, and retry states affected by the change.
- Verify light/dark behavior when theme tokens or imperative colors change.
- Exercise changed primitives in Storybook across meaningful variants, sizes, disabled/invalid/busy states, long copy, and light/dark backgrounds; regenerate the tracked Storybook registry after story discovery changes.
- Verify accessibility semantics and that accessibility-only diffs contain no unrequested visual changes.
- Run `pnpm run typecheck` and relevant lint. For Storybook infrastructure changes, also generate the registry and perform a Storybook-enabled export or equivalent isolated bundle check. Require `pnpm exec oxfmt <changed-files> --check` for every modified file, then run global `pnpm run format:check` as a regression check; distinguish unrelated baseline failures and do not rewrite out-of-scope docs to make it green.
