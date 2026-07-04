# Fresh Session Handoff

Last updated: 2026-07-04

## Files To Read First

1. `AGENTS.md`
2. `docs/ai/CURRENT.md`
3. `docs/ai/HANDOFF.md`
4. Active plan, if referenced in `CURRENT.md` or this file
5. `docs/ai/FAILED_ATTEMPTS.md` when debugging
6. `docs/product-agent-brief.md` before product, UX, copy, or feature-scope decisions, if present

## Active Plan

None.

Unknown: no task-specific feature plan exists yet.

## Situation Summary

This is an Expo Router project named `starter` with strict TypeScript, NativeWind, Redux Toolkit, RTK Query, and Vitest. The app code is organized with `src/` for routes, runtime, UI components, hooks, stores, constants, and styling. Durable business concepts live under `core/`, currently including `auth` and `subscription` bounded contexts with domain, adapter, gateway, API, selector, and use-case structure.

The repository already had minimal `AGENTS.md` guidance and four local skills: `architecture`, `ui-conventions`, `domain-layer`, and `coding-standards`. This handoff system adds concise repo-versioned continuity files and two local continuity skills without changing application source code.

## Exact Continuation Point

Continuity setup is complete. The next session should start by running the resume procedure, then choose the next real product or engineering task.

No application source files have been intentionally modified for this setup.

## Known Constraints

- Keep `AGENTS.md` as routing and instructions, not a knowledge dump.
- Patch existing skills only when necessary.
- Do not invent project facts; write `Unknown` with a short note.
- Do not include secrets, credentials, private tokens, raw chat transcripts, or huge code snippets.
- Prefer Markdown files committed in the repo.
- Read `docs/product-agent-brief.md` before product, UX, copy, or feature-scope decisions. Unknown: that file is currently missing.
- Use the matching repo skill when a task needs architecture, UI, domain-layer, or coding-standards guidance.

## Last Known Good State

- Branch before continuity setup: `master`.
- Working tree before continuity setup: clean.
- Latest commit before continuity setup: `9c658b2 Update domain-layer documentation and add use-case tests reference`.
- Existing tests discovered: use-case specs under `core/auth/use-cases/**` and `core/subscription/use-cases/**`.

## Tests / Checks Last Run

- `git branch --show-current`: passed, returned `master`.
- `git status --short`: passed, clean before continuity files were created.
- `git log --oneline -n 15`: passed.
- `python3 /Users/martinseigneuret/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/checkpoint`: passed.
- `python3 /Users/martinseigneuret/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/resume-project`: passed.
- `pnpm run test`: passed, 16 files and 22 tests.
- `pnpm exec oxfmt docs/ai/CURRENT.md docs/ai/HANDOFF.md docs/ai/WORKLOG.md docs/ai/DECISIONS.md docs/ai/FAILED_ATTEMPTS.md plans/README.md AGENTS.md .agents/skills/checkpoint/SKILL.md .agents/skills/resume-project/SKILL.md --check`: passed.
- `pnpm run check`: failed at `format:check` on existing source files: `core/auth/use-cases/password-reset-completion/reset-password.ts`, `core/subscription/use-cases/subscription-management/open-subscription-management.ts`, `core/subscription/use-cases/subscription-purchase/purchase-subscription.ts`, `core/subscription/use-cases/subscription-restore/restore-subscription-purchases.ts`, and `src/components/ui/Button.tsx`.

## Things Not To Repeat

- Do not use chat history as the only project memory.
- Do not turn `AGENTS.md` into a state dashboard.
- Do not create a task-specific plan for trivial single-session edits.
- Do not record secrets, credentials, tokens, raw transcripts, or large code excerpts in `docs/ai/`.
- Do not assume `docs/product-agent-brief.md` exists until verified.
- Do not rerun `pnpm run check` expecting it to pass until the existing formatting drift is addressed.
