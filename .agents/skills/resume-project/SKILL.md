---
name: resume-project
description: Use when starting a session after time away, or when the user says "resume", "where was I", "continue from last time", "pick up the project", or asks to reorient before work. Reads continuity files and summarizes the current state before source edits.
---

# Resume Project

Use this skill to rebuild project context before changing code.

## Workflow

1. Read `AGENTS.md`.
2. Read `docs/ai/CURRENT.md` and `docs/ai/HANDOFF.md`.
3. Read the active plan if one is referenced.
4. If debugging, read `docs/ai/FAILED_ATTEMPTS.md`.
5. Check repository state:
   - `git branch --show-current`
   - `git status --short`
   - `git log --oneline -n 15`
6. Summarize the current state before editing source code.
7. Identify the next 3 concrete actions.
8. Identify likely files to edit.
9. Identify the first validation command to run.
10. Load any task-specific repo skill needed for the actual work, such as `architecture`, `ui-conventions`, `domain-layer`, or `coding-standards`.

## Rules

- Do not modify source code until the state has been summarized.
- Use `Unknown` with a short note when a fact is missing.
- Keep the summary concise and tied to repo files.
- If the requested work may span sessions, create or update `plans/<feature-slug>.md`.
- If continuity files are stale, update them with the `checkpoint` procedure before or after the requested work as appropriate.

## Resume Summary Shape

Include:

- current branch and working-tree state
- active focus and plan
- last known validation
- next 3 actions
- likely files to edit
- first validation command
- blockers or `Unknown` items
