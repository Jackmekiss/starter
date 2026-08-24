---
name: project-memory
description: "Resume a project, checkpoint unfinished work, remember durable repository context, or initialize project memory from a starter. Use when the user asks to resume, save or hand off state, remember project information, update memory, or initialize a derived project."
---

# Project Memory

Maintain concise repository memory without duplicating Git, source code, or implementation skills.

## Select One Mode

- **Resume**: rebuild context after time away or when asked to continue.
- **Checkpoint**: preserve a genuinely useful continuation point before stopping or handing off.
- **Remember**: store a durable fact, decision, failure, or open question.
- **Initialize**: reset project-instance memory when a starter becomes a named product.

Use only the selected mode. Do not run every workflow together.

## Shared Boundaries

- `docs/ai/` is descriptive memory. Layer skills remain normative for how code is written.
- Git is the source for branch, commit, dirty state, and changed files. Inspect these facts when needed;
  never copy them into `CURRENT.md` or `HANDOFF.md`.
- Keep `INDEX.md` under 60 lines, `CURRENT.md` and `HANDOFF.md` under 40 lines,
  `technical-memory.md` around 100–150 lines at most, and active `WORKLOG.md` around 200 lines.
- Keep stable facts separate from operational state. Update the most specific file once and link to it
  instead of repeating it.
- Skills own procedures and code conventions. Technical memory owns only cross-cutting toolchain,
  runtime, environment, and operational facts.
- Never store secrets, raw environment values, chat transcripts, transient logs, or speculative facts.
- Use `Unknown` when evidence is missing.
- Record validation only when it actually ran.

## Resume Mode

1. Read `AGENTS.md`, `docs/ai/INDEX.md`, and `docs/ai/CURRENT.md`.
2. Read `HANDOFF.md` only when `CURRENT.md` reports interrupted work.
3. Load stable memory progressively according to the task:
   - product or UX: product memory, user flows, glossary;
   - architecture or tooling: architecture map and technical memory;
   - data or API: data model and API contracts;
   - debugging: failed attempts;
   - active multi-session work: the linked plan.
4. Inspect Git directly for current branch, working tree, and recent commits.
5. Summarize verified focus, blockers, next actions, likely files, and first validation command before
   editing.

## Checkpoint Mode

1. Read `CURRENT.md`, any active `HANDOFF.md`, and the active plan.
2. Inspect Git directly, but do not persist its volatile state in memory.
3. Rewrite `CURRENT.md` as a short dashboard: focus, active plan, blockers, and next three actions.
4. Write `HANDOFF.md` only for genuinely interrupted work that needs non-obvious continuation
   context. Otherwise replace it with a short statement that no handoff is active.
5. Append one factual `WORKLOG.md` entry only for meaningful progress.
6. Update stable memory, decisions, failures, or open questions only when their durable facts changed.
7. If `WORKLOG.md` approaches 200 lines, move older history into
   `docs/ai/worklog-archive/<year>-Q<quarter>.md` and keep roughly the latest 10–20 entries active.
8. Update an active plan when its progress or decisions changed.

## Remember Mode

Classify the fact before editing:

| Information                           | Owner                    |
| ------------------------------------- | ------------------------ |
| Product facts                         | `product-memory.md`      |
| Vocabulary                            | `domain-glossary.md`     |
| User behavior                         | `user-flows.md`          |
| Existing ownership and boundaries     | `architecture-map.md`    |
| Cross-cutting toolchain/runtime facts | `technical-memory.md`    |
| Data shape                            | `data-model.md`          |
| Public/integration contracts          | `api-contracts.md`       |
| Validation strategy                   | `testing-validation.md`  |
| Accepted rationale                    | `DECISIONS.md` or an ADR |
| Reusable failure or trap              | `FAILED_ATTEMPTS.md`     |
| Unresolved question                   | `OPEN_QUESTIONS.md`      |
| Current focus                         | `CURRENT.md`             |
| Interrupted-work continuation         | `HANDOFF.md`             |
| Meaningful chronology                 | `WORKLOG.md`             |

Read the target first, patch only the relevant section, and avoid propagating the same sentence to
other memory files.

## Initialize Mode

1. Require the product name; use `Unknown project` only when the user explicitly accepts it.
2. Read the reset policy in `docs/ai/INDEX.md` and the reusable architecture, technical, and testing
   memory.
3. Confirm that application source is outside the requested memory reset.
4. Reset project-instance files from `docs/ai/_templates/` when templates exist.
5. Preserve reusable architecture/tooling memory and repository skills unless the user changes those
   choices.
6. Reset active and archived worklog history, instance decisions, failed attempts, open questions,
   task plans, and product-specific ADRs.
7. Search for stale product names and report any remaining uncertain trace.
8. Do not invent audience, business rules, deployment facts, or product scope.

## Validation

- Check the line budgets and that active Worklog history is within its rolling window.
- Check links and references to removed or renamed memory skills.
- Validate this skill with Skill Creator's `quick_validate.py`.
- Confirm source files remain untouched during a memory-only initialization.
