# AGENTS.md

Repository guidance is intentionally minimal.
Detailed Expo/frontend conventions live in local skills under `.agents/skills/`.
Product guidance for Starter lives in `docs/ai/product-memory.md`.

Available skills:

- `accessibility`: React Native accessibility semantics, labels, roles, control states, announcements, invisible touch-target improvements with `hitSlop`, and Appium/XCUITest element exposure without visual changes
- `frontend-architecture`: Expo/frontend philosophy, frontend-first architecture, client bounded contexts, repo structure, layer ownership, feature workflow, and UI/business/infrastructure boundaries
- `frontend-ui-conventions`: Expo screens, routes, components, navigation, UI data flow, RTK Query usage and error consumption, localized domain-error presentation, styling with NativeWind, layout and spacing rules, forms, JSX extraction, and presentational ownership
- `frontend-domain-layer`: frontend domain models, use-cases, gateways, adapters, selectors, context APIs, DTO placement, runtime state, typed application errors, Result contracts, and how Redux or RTK-related business state should be organized under frontend `core/`
- `frontend-coding-standards`: naming, TypeScript conventions, file splitting, refactoring rules, application-error boundary audits, review checklist, and final frontend repository guardrails
- `resume-project`: restart after time away by reading project memory, git state, and continuation context before editing
- `checkpoint`: update current state, handoff, worklog, active plans, and relevant durable memory before stopping
- `update-project-memory`: classify new durable context and update the most specific memory file
- `create-plan`: create an executable `plans/<feature-slug>.md` for multi-step, risky, or multi-session work
- `initialize-project-memory`: reset project-instance memory when this starter becomes a new project

Use the matching skill when the task needs deeper guidance.
Codex may also activate these skills automatically when the request matches their descriptions.

The `frontend-*` skills are for the Expo app and frontend business core only. They are not backend/server standards.

Before making product, UX, copy, or feature-scope decisions, read `docs/ai/product-memory.md`, `docs/ai/user-flows.md`, and `docs/ai/OPEN_QUESTIONS.md`.

Always-on repository rules:

- Prefer obvious code over smart code.
- Do not put domain logic directly inside screens.
- Do not leak UI state into domain models.
- A bounded context should own durable product truth; the UI should own temporary interaction mechanics.

## Project memory and continuity

- This repo uses `docs/ai/` as the source of truth for project memory.
- At the start of any non-trivial task, read:
  - `docs/ai/INDEX.md`
  - `docs/ai/product-memory.md`
  - `docs/ai/architecture-map.md`
  - `docs/ai/technical-memory.md`
  - `docs/ai/CURRENT.md`
  - `docs/ai/HANDOFF.md`
- If an active plan is referenced, read it.
- If debugging, read `docs/ai/FAILED_ATTEMPTS.md`.
- If changing user-facing behavior, also read:
  - `docs/ai/user-flows.md`
  - `docs/ai/domain-glossary.md`
- If changing data/API behavior, also read:
  - `docs/ai/data-model.md`
  - `docs/ai/api-contracts.md`
- Before stopping, compacting context, or handing off, run the checkpoint procedure.
- When durable context is discovered, update the correct project memory file.
- When this starter becomes a new project, use `initialize project memory for <project name>`.
- Keep memory files concise, versioned, and free of secrets.
- Use `Unknown` rather than inventing missing facts.
- Do not mix product memory with current task state.
