---
name: initialize-project-memory
description: Reset project-instance memory for a repo derived from this starter. Use when the user says initialize project memory, initialize project memory for a named project, new project from starter, or start a new project from this starter.
---

# Initialize Project Memory

Use this skill when this starter becomes a new project and stale project-specific memory must be reset.

## Required inputs

- Project name: use the name supplied in `initialize project memory for <project name>`.
- If no project name is supplied, use `Unknown project`.
- Date: use today's environment date.

## Workflow

1. Read `AGENTS.md`.
2. Read `docs/ai/INDEX.md`, especially `Starter reset policy`.
3. Read `docs/ai/starter-baseline.md`.
4. Inspect current branch with `git branch --show-current`.
5. Inspect working tree with `git status --short`.
6. Confirm no application source files need to change.
7. Reset only project-instance memory from `docs/ai/_templates/`.
8. Replace template placeholders:
   - `<Project Name>` with the supplied project name or `Unknown project`.
   - `<YYYY-MM-DD>` with today's date.
   - `<branch>` with the current branch.
9. Rewrite `docs/ai/CURRENT.md` and `docs/ai/HANDOFF.md`.
10. Replace `docs/ai/WORKLOG.md` with the initialized worklog template.
11. Reset project-specific decisions, failed attempts, and open questions from templates.
12. Leave starter technical memory intact.
13. Verify no `src/` or `core/` files changed.
14. Run `rg` for stale project-specific traces from the previous memory state.

## Reset map

Keep:

- `docs/ai/INDEX.md`
- `docs/ai/starter-baseline.md`
- `docs/ai/architecture-map.md`
- `docs/ai/technical-memory.md`
- `docs/ai/testing-validation.md`
- `docs/adr/README.md`
- `plans/README.md`
- `AGENTS.md`
- `.agents/skills/**`

Reset from template:

- `docs/ai/product-memory.md`
- `docs/ai/domain-glossary.md`
- `docs/ai/user-flows.md`
- `docs/ai/data-model.md`
- `docs/ai/api-contracts.md`
- `docs/ai/CURRENT.md`
- `docs/ai/HANDOFF.md`
- `docs/ai/OPEN_QUESTIONS.md`

Reset history:

- `docs/ai/WORKLOG.md`
- `docs/ai/DECISIONS.md`
- `docs/ai/FAILED_ATTEMPTS.md`
- task-specific `plans/*.md`
- ADR files under `docs/adr/*.md`, except `docs/adr/README.md`

## Rules

- Do not modify application source code.
- Do not delete `docs/ai/_templates/`.
- Do not delete starter technical memory.
- Do not invent product facts.
- Use `Unknown` for anything not supplied by the user or proven by the repo.
- Do not include secrets, env values, raw transcripts, or large source snippets.
- If stale traces remain after reset, record them in `docs/ai/OPEN_QUESTIONS.md` or report them before continuing.

## Output format

- Project name
- Branch
- Files reset
- Files kept
- Stale trace check result
- Source-code safety check result
- Next 3 actions
