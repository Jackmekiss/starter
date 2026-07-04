---
name: checkpoint
description: Use when ending a session, before context compaction, after meaningful progress, or when the user says "checkpoint", "handoff", "save state", "update memory", or asks to preserve project state. Updates repo-versioned continuity files for the next human or Codex session.
---

# Checkpoint

Use this skill to leave the repository in a state that can be safely resumed without chat history.

## Workflow

1. Read `AGENTS.md`.
2. Read `docs/ai/CURRENT.md` and `docs/ai/HANDOFF.md`.
3. Read the active plan if one is referenced.
4. Check repository state:
   - `git branch --show-current`
   - `git status --short`
   - `git log --oneline -n 15`
5. Review the work completed in the current session.
6. Update `docs/ai/CURRENT.md` with the current branch, focus, status, next 3 actions, relevant files, validation commands and results, blockers, and do-not-forget notes.
7. Update `docs/ai/HANDOFF.md` with files to read first, active plan, situation summary, exact continuation point, constraints, last known good state, checks run, and things not to repeat.
8. Append a dated entry to `docs/ai/WORKLOG.md`.
9. Update `docs/ai/DECISIONS.md` only for durable decisions.
10. Update `docs/ai/FAILED_ATTEMPTS.md` only for failed attempts, gotchas, or debugging paths that should not be repeated.
11. Update the active plan if one exists and the task changed its status, next steps, validation, or blockers.

## Rules

- Keep entries concise and factual.
- Use `Unknown` with a short note when a fact is missing.
- Do not include secrets, credentials, private tokens, raw chat transcripts, or large code snippets.
- Do not turn `AGENTS.md` into a state dump.
- Do not modify source code as part of checkpointing unless the user explicitly asks.
- Record validation commands exactly, including whether they passed, failed, or were not run.

## Final Response

End with:

- files updated
- validation run
- exact next steps for the next session
- any `Unknown` items that still matter
