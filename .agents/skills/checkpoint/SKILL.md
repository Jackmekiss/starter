---
name: checkpoint
description: Use when ending a session, before compaction, after meaningful progress, or when the user says checkpoint, handoff, save state, update memory, sauvegarde l’état, or mets à jour la mémoire.
---

# Checkpoint

Use this skill before stopping, handing off, compacting context, or after meaningful progress.

## Behavior

1. Read `AGENTS.md`.
2. Read `docs/ai/INDEX.md`.
3. Read `docs/ai/CURRENT.md`.
4. Read `docs/ai/HANDOFF.md`.
5. Read the active plan if one is referenced.
6. Inspect the current branch with `git branch --show-current`.
7. Inspect working tree state with `git status --short`.
8. Inspect recent commits with `git log --oneline -n 20`.
9. Update `docs/ai/CURRENT.md`.
10. Update `docs/ai/HANDOFF.md`.
11. Append to `docs/ai/WORKLOG.md`.
12. Update the active plan if relevant.
13. Update stable memory only when durable facts changed:
    - `docs/ai/product-memory.md`
    - `docs/ai/domain-glossary.md`
    - `docs/ai/user-flows.md`
    - `docs/ai/architecture-map.md`
    - `docs/ai/technical-memory.md`
    - `docs/ai/data-model.md`
    - `docs/ai/api-contracts.md`
    - `docs/ai/testing-validation.md`
14. Update `docs/ai/DECISIONS.md` only if a durable decision was made.
15. Update `docs/ai/FAILED_ATTEMPTS.md` only if a failed path or gotcha was discovered.
16. Update `docs/ai/OPEN_QUESTIONS.md` for unresolved questions.
17. Record validation commands and results.
18. End with exact next steps for the next session.

## Rules

- `CURRENT.md` and `HANDOFF.md` may be rewritten.
- `WORKLOG.md` is append-only.
- Do not invent validation results.
- Do not include secrets, env values, credentials, private tokens, raw chat transcripts, or large code snippets.
- Keep updates concise.
- Prefer links and paths over copying code.
- Product/domain memory must stay separate from current task state.

## Output format

- Branch
- Working tree summary
- Memory files updated
- Validation commands and results
- Decisions recorded
- Open questions added or resolved
- Exact next steps
