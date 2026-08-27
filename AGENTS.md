# AGENTS.md

Repository guidance is intentionally minimal.
Detailed frontend conventions live in local skills under `.agents/skills/`.
Product guidance for Starter lives in `docs/ai/product-memory.md`.

Available skills:

- `begin-project`: convert Starter into a named product by renaming app identifiers, selecting and removing example bounded contexts, initializing memory, and validating the resulting repository
- `frontend-core`: Starter's frontend DDD and Clean Architecture conventions for bounded contexts under `core/`, RTK Query use-cases, Redux-owned durable state, gateways, adapters, typed errors, and `src/app-runtime/` composition
- `frontend-ui`: Starter's Expo Router routes, screens, components, forms, runtime-hook consumption, localization, NativeWind styling, themes, accessibility semantics, and accessibility audits
- `project-memory`: resume work, checkpoint an interruption, remember durable context, or initialize project memory through four explicit modes
- `create-plan`: create an executable `plans/<feature-slug>.md` for multi-step, risky, or multi-session work

Use the matching skill when the task needs deeper guidance.
Codex may also activate these skills automatically when the request matches their descriptions.
For a vertical slice that changes both business behavior and presentation, apply `frontend-core` before `frontend-ui`.

The `frontend-*` skills are for the Expo app and frontend business core only. They are not backend/server standards.

Before making product, UX, copy, or feature-scope decisions, read `docs/ai/product-memory.md`, `docs/ai/user-flows.md`, and `docs/ai/OPEN_QUESTIONS.md`.

Always-on repository rules:

- Prefer obvious code over smart code.
- Treat the versioned Starter blueprints as the default shape for new frontend code.
- Do not put domain logic directly inside screens.
- Do not leak UI state into domain models.
- A bounded context should own durable product truth; the UI should own temporary interaction mechanics.

## Proportional native validation

- Default to targeted formatting, lint, and typecheck for ordinary changes. This repository intentionally has no automated tests.
- Build native iOS/Android bundles when a change affects Metro, Reanimated, Storybook, native configuration, or a native dependency.
- Launch an iOS or Android simulator only when the user explicitly asks, before a release, or when the behavior cannot be validated reliably without a device runtime.
- Do not launch simulators routinely after every UI change; explain when an exceptional native check is necessary.
- Do not run automatic Web validation for this Expo Starter. A future Web application will be owned separately.

## Project memory and continuity

- This repo uses `docs/ai/` as the source of truth for project memory.
- At the start of non-trivial work, read `docs/ai/INDEX.md` and `docs/ai/CURRENT.md`.
- Read `docs/ai/HANDOFF.md` only when `CURRENT.md` reports interrupted work.
- Load product, architecture, technical, flow, data, API, or testing memory only when the task needs it.
- If an active plan is referenced, read it.
- If debugging, read `docs/ai/FAILED_ATTEMPTS.md`.
- If changing user-facing behavior, also read:
  - `docs/ai/user-flows.md`
  - `docs/ai/domain-glossary.md`
- If changing data/API behavior, also read:
  - `docs/ai/data-model.md`
  - `docs/ai/api-contracts.md`
- Before stopping with meaningful unfinished work, use `project-memory` in Checkpoint mode.
- When durable context is discovered, use `project-memory` in Remember mode.
- When this starter becomes a new project, use `begin-project`; it delegates the memory reset to `project-memory` Initialize mode.
- Keep memory files concise, versioned, and free of secrets.
- Use `Unknown` rather than inventing missing facts.
- Do not mix product memory with current task state.
- Never copy branch, commit, dirty state, or changed-file lists into project memory; inspect Git directly.
