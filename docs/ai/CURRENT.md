# Current Project State

Last updated: 2026-07-04

## Current branch

`features/memory-test-2`

## Current focus

Project memory system initialized; code convention skills renamed as frontend-specific; standalone starter-only memory file removed.

## Why this matters

The repo now has a lightweight, versioned continuity layer so humans and fresh Codex sessions can resume work without relying on chat history.

## Current status

Done for the initial memory setup.

## Next 3 concrete actions

1. Use `initialize project memory for <project name>` when deriving a concrete project from the starter.
2. Update [product-memory.md](product-memory.md) with confirmed product facts when they are known.
3. Run relevant validation commands when source code changes; no app validation was needed for this docs-only setup.

## Relevant files

- [INDEX.md](INDEX.md): memory entry point.
- [HANDOFF.md](HANDOFF.md): fresh-session continuation guide.
- [WORKLOG.md](WORKLOG.md): append-only history.
- [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md): unresolved product and technical questions.
- [../../AGENTS.md](../../AGENTS.md): top-level agent routing and memory rules.
- [../../.agents/skills/checkpoint/SKILL.md](../../.agents/skills/checkpoint/SKILL.md): procedure to update memory before stopping.

## Active plan

None.

## Last validation commands and results

- Passed: required memory files exist under `docs/ai/`.
- Passed: project memory skills exist under `.agents/skills/`.
- Passed: `AGENTS.md` references the memory system.
- Passed: starter reset policy and reset templates were added.
- Passed: `initialize-project-memory` skill validates with `quick_validate.py`.
- Passed: code convention skills were renamed to `frontend-*` and validated with `quick_validate.py`.
- Passed: no removed starter-only memory filename or stale wording remains in `AGENTS.md`, `docs/ai`, `.agents/skills`, `plans`, or `docs/adr`.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes after adding the starter initialization workflow.
- Passed: strict secret-pattern scan over memory docs, plans, new skills, and `AGENTS.md` found no matches.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.
- Reason: documentation and agent-workflow setup only; no application/source code changes were intended.

## Blockers / open questions

- Actual product category, target users, product promise, and post-login user experience are Unknown.
- Production backend, database, auth provider, and RevenueCat configuration are Unknown.

## Do-not-forget notes

- Keep product/domain memory separate from current task state.
- Use `Unknown` rather than inventing product facts.
- Keep `WORKLOG.md` append-only.
- Do not store secrets, env values, raw transcripts, or large source snippets in memory files.
