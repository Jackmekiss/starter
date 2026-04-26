# AGENTS.md

Repository guidance is intentionally minimal.
Detailed frontend conventions live in local skills under `.agents/skills/`.
Product guidance for Starter lives in `docs/product-agent-brief.md`.

Available skills:

- `architecture`: frontend philosophy, frontend-first architecture, bounded contexts, repo structure, layer ownership, feature workflow, and UI/business/infrastructure boundaries
- `ui-conventions`: screens, routes, components, navigation, UI data flow, RTK Query usage from screens, styling with NativeWind, layout and spacing rules, forms, JSX extraction, and presentational ownership
- `domain-layer`: domain models, use-cases, gateways, adapters, selectors, context APIs, DTO placement, runtime state, and how Redux or RTK-related business state should be organized under `core/`
- `coding-standards`: naming, TypeScript conventions, file splitting, refactoring rules, review checklist, and final repository guardrails

Use the matching skill when the task needs deeper guidance.
Codex may also activate these skills automatically when the request matches their descriptions.

Before making product, UX, copy, or feature-scope decisions, read `docs/product-agent-brief.md`.

Always-on repository rules:

- Prefer obvious code over smart code.
- Do not put domain logic directly inside screens.
- Do not leak UI state into domain models.
- A bounded context should own durable product truth; the UI should own temporary interaction mechanics.
