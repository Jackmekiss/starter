# AGENTS.md

Repository guidance is intentionally minimal.
Detailed frontend conventions live in local skills under `.agents/skills/`.
Product guidance for Starter lives in `docs/ai/product-memory.md`.

Available skills:

- `architecture`: frontend philosophy, frontend-first architecture, bounded contexts, repo structure, layer ownership, feature workflow, and UI/business/infrastructure boundaries
- `ui-conventions`: screens, routes, components, navigation, UI data flow, RTK Query usage from screens, styling with NativeWind, layout and spacing rules, forms, JSX extraction, and presentational ownership
- `domain-layer`: domain models, use-cases, gateways, adapters, selectors, context APIs, DTO placement, runtime state, and how Redux or RTK-related business state should be organized under `core/`
- `coding-standards`: naming, TypeScript conventions, file splitting, refactoring rules, review checklist, and final repository guardrails
- `resume-project`: restart after time away by reading project memory, git state, and continuation context before editing
- `checkpoint`: update current state, handoff, worklog, active plans, and relevant durable memory before stopping
- `update-project-memory`: classify new durable context and update the most specific memory file
- `create-plan`: create an executable `plans/<feature-slug>.md` for multi-step, risky, or multi-session work

Use the matching skill when the task needs deeper guidance.
Codex may also activate these skills automatically when the request matches their descriptions.

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
- Keep memory files concise, versioned, and free of secrets.
- Use `Unknown` rather than inventing missing facts.
- Do not mix product memory with current task state.
