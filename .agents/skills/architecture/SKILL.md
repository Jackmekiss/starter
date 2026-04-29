---
name: architecture
description: Use when deciding how to structure frontend code in this repository: where code belongs across app/, components/, and core/, how to define or refactor bounded contexts, how to apply frontend-first architecture, and how to preserve UI, business, and infrastructure boundaries. Do not use for styling-only, JSX cleanup-only, or naming-only tasks.
---

# Architecture

Use this skill when the task is about structure, ownership, or architectural direction.

## Goals

- Place code in the right layer.
- Keep business meaning explicit.
- Preserve bounded contexts and clean boundaries.
- Build features from domain to UI, not the reverse.

## Workflow

1. Read [philosophy.md](references/philosophy.md) to align on the repository's architectural mindset.
2. Read [repo-structure.md](references/repo-structure.md) to decide ownership between `app/`, `components/`, and `core/`.
3. Read [feature-workflow.md](references/feature-workflow.md) when creating or refactoring a feature end to end.
4. Produce a concrete placement decision: target layer, target bounded context, and what must stay out of scope for that layer.

## Decision rules

- `app/` orchestrates routes, screens, and navigation.
- `components/` renders presentational UI blocks.
- `core/` owns domain models, business actions, data contracts, and state rules.
- Prefer bounded contexts over generic shared buckets.
- Optimize for long-term domain clarity over short-term screen convenience.

## Do not use this skill for

- NativeWind or layout work with no structural question.
- Pure component extraction or screen markup cleanup.
- Naming-only, typing-only, or review-only requests.
