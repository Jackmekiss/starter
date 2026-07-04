---
name: resume-project
description: Use when starting a session after time away, or when the user says resume, where was I, continue from last time, pick up the project, reprends le projet, or on en était où.
---

# Resume Project

Use this skill before editing when a session starts after time away or the user asks to resume project work.

## Behavior

1. Read `AGENTS.md`.
2. Read `docs/ai/INDEX.md`.
3. Read `docs/ai/product-memory.md`.
4. Read `docs/ai/architecture-map.md`.
5. Read `docs/ai/technical-memory.md`.
6. Read `docs/ai/CURRENT.md`.
7. Read `docs/ai/HANDOFF.md`.
8. Read the active plan if one is referenced by `CURRENT.md` or `HANDOFF.md`.
9. If debugging, read `docs/ai/FAILED_ATTEMPTS.md`.
10. Inspect the current branch with `git branch --show-current`.
11. Inspect working tree state with `git status --short`.
12. Inspect recent commits with `git log --oneline -n 20`.
13. Summarize current state before editing code.
14. Identify the next 3 concrete actions.
15. Identify likely files to inspect or edit.
16. Identify the first validation command to run.

## Rules

- Do not modify source code until the state is summarized.
- Use `Unknown` for missing facts instead of inventing context.
- If `docs/product-agent-brief.md` is needed but missing, say so and continue with existing memory.
- Keep the summary concise and actionable.

## Output format

- Current branch
- Current focus
- Product context in one paragraph
- What appears done
- What is in progress
- Next 3 actions
- Likely files to inspect/edit
- Risks / blockers / unknowns
- First validation command
