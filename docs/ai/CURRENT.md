# Current Project State

Last updated: 2026-07-04

## Current Branch

`master`

## Current Focus

Initialize a lightweight, repo-versioned continuity system for humans and fresh Codex sessions. No application source code is part of this change.

## Why This Matters

The repository has skill-based agent guidance but no concise, durable state handoff. These files make it possible to return after several days and continue without relying on chat history or generic memory.

## Current Status

- Done: Baseline repository inspection completed for guidance files, existing skills, README, config, high-level tree, and git state.
- Done: Continuity file structure initialized under `docs/ai/`.
- Done: Repo-local continuity skills initialized under `.agents/skills/checkpoint/` and `.agents/skills/resume-project/`.
- In progress: Keeping these files accurate as project work continues.
- Not started: No task-specific feature plan exists yet.

## Next 3 Actions

1. Use the resume procedure before the next non-trivial task: read `AGENTS.md`, this file, `docs/ai/HANDOFF.md`, and any active plan.
2. Decide the next actual product or engineering task. Unknown: the repo does not currently state a next product feature.
3. If the next task may span sessions, create `plans/<feature-slug>.md` before implementation and keep it updated.

## Relevant Files

- `AGENTS.md`: routes Codex to repo skills and continuity memory.
- `.agents/skills/architecture/SKILL.md`: structure and bounded-context workflow.
- `.agents/skills/ui-conventions/SKILL.md`: screen, component, route, styling, and UI data-flow workflow.
- `.agents/skills/domain-layer/SKILL.md`: `core/` domain, use-case, gateway, adapter, selector, API, and runtime-state workflow.
- `.agents/skills/coding-standards/SKILL.md`: naming, TypeScript, file growth, refactoring, and review guardrails.
- `.agents/skills/checkpoint/SKILL.md`: procedure for updating continuity files before stopping.
- `.agents/skills/resume-project/SKILL.md`: procedure for safely resuming after time away.
- `docs/ai/HANDOFF.md`: fresh-session continuation context.
- `docs/ai/WORKLOG.md`: chronological continuity log.
- `docs/ai/DECISIONS.md`: durable project decisions.
- `docs/ai/FAILED_ATTEMPTS.md`: known failed approaches and gotchas.
- `plans/README.md`: rule for multi-session task plans.
- `README.md`: currently default Expo README with setup commands.
- `package.json`: package scripts and dependency overview.
- `vitest.config.ts`: Vitest targets `core/**/use-cases/**/*.spec.ts`.
- `src/`: Expo Router app, runtime, UI components, hooks, stores, constants, and styles.
- `core/`: bounded contexts for `auth` and `subscription`.

## Last Validation Commands and Results

- `git branch --show-current`: passed, returned `master`.
- `git status --short`: passed, clean before continuity files were created.
- `git log --oneline -n 15`: passed, latest commit `9c658b2 Update domain-layer documentation and add use-case tests reference`.
- `python3 /Users/martinseigneuret/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/checkpoint`: passed.
- `python3 /Users/martinseigneuret/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/resume-project`: passed.
- `pnpm run test`: passed, 16 files and 22 tests.
- `pnpm exec oxfmt docs/ai/CURRENT.md docs/ai/HANDOFF.md docs/ai/WORKLOG.md docs/ai/DECISIONS.md docs/ai/FAILED_ATTEMPTS.md plans/README.md AGENTS.md .agents/skills/checkpoint/SKILL.md .agents/skills/resume-project/SKILL.md --check`: passed.
- `pnpm run check`: failed at `format:check` on existing source files: `core/auth/use-cases/password-reset-completion/reset-password.ts`, `core/subscription/use-cases/subscription-management/open-subscription-management.ts`, `core/subscription/use-cases/subscription-purchase/purchase-subscription.ts`, `core/subscription/use-cases/subscription-restore/restore-subscription-purchases.ts`, and `src/components/ui/Button.tsx`. These source files were not modified for this documentation-only setup.

## Blockers / Open Questions

- Existing repository formatting drift blocks `pnpm run check` before lint/typecheck can run.
- Unknown: `docs/product-agent-brief.md` is referenced by `AGENTS.md`, but the `docs/` directory did not exist before this setup.
- Unknown: Next product or feature priority is not stated in the repository.
- Unknown: Whether generated native `ios/` artifacts are intentionally present locally; `.gitignore` ignores `/ios`.

## Do-Not-Forget Notes

- Do not overwrite `AGENTS.md` or existing skills; patch them minimally.
- Do not place durable product truth in screens.
- Do not leak temporary UI state into domain models.
- Keep continuity files short, factual, versioned, and secret-free.
- Use `Unknown` rather than filling gaps from memory or chat history.
