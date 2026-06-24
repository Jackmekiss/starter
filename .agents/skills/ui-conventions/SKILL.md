---
name: ui-conventions
description: Use when creating or refactoring UI in this repository: screens, routes, components, navigation, screen data flow, styling, layout, forms, and JSX conventions. This skill covers the current UI stack and presentation rules. Do not use it for bounded-context design, use-case modeling, or naming-only reviews.
---

# UI Conventions

Use this skill when the task is primarily about screens, components, and UI composition.

## Goals

- Keep screens thin and orchestration-focused.
- Keep generic UI components presentational and composable.
- Let screen-level feature sections stay autonomous when that simplifies the UI.
- Follow the repository's runtime, styling, and layout conventions.
- Avoid UI logic leaking into the business layer.

## Workflow

1. Read [navigation.md](references/navigation.md) for route and runtime-shell conventions.
2. Read [data-flow.md](references/data-flow.md) for screen orchestration and selector ownership.
3. Read [styling.md](references/styling.md) for primitives and styling rules.
4. Read [layout.md](references/layout.md) for spacing, extraction, and component ownership rules.
5. Read [forms.md](references/forms.md) when the task touches forms or dense JSX trees.

## Decision rules

- A screen orchestrates; it does not define the domain.
- A thin screen does not need a screen-level render model just to place visual sections.
- Distinguish between generic UI primitives and screen feature sections.
- A generic UI component renders; it does not become a mini feature controller.
- A screen feature section may read simple selectors, navigate locally, and format local display data.
- Prefer parent-owned fetching and autonomous sections over screen models plus props drilling.
- Avoid prop drilling generically: screens place sections; screen feature sections own the simple reads, selectors, and handlers used only by that section; generic UI primitives stay prop-driven.
- Reuse `components/ui/` primitives before introducing new local systems.

## Do not use this skill for

- Designing a new bounded context in `core/`.
- Implementing or refactoring gateways, adapters, selectors, or APIs as the main task.
- Pure naming, TypeScript, or review-checklist work.
