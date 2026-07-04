# Plans

Use `plans/<feature-slug>.md` for multi-step, multi-file, risky, or multi-session work.

Do not create a plan for tiny single-file edits unless the user asks for one or the risk is high.

## When to create a plan

- The work spans several files or bounded contexts.
- The work may need multiple sessions.
- Product, UX, API, data, or architecture decisions need to be preserved.
- The implementation order matters.
- There are meaningful risks, unknowns, or validation steps.

## What a good plan contains

- The user outcome and purpose.
- Relevant memory files and source files.
- Clear scope and non-goals.
- Concrete implementation steps.
- Progress that can be updated as work happens.
- Decisions, validation, risks, open questions, and handoff notes.

## How plans differ from `CURRENT.md`

- `CURRENT.md` is the short operational dashboard for the whole repo.
- A plan is a task-specific working document for one feature or project.
- `CURRENT.md` may point to the active plan; it should not duplicate the whole plan.

## How to update plans during work

- Update progress as steps are completed.
- Add decisions when they affect future direction.
- Add validation results when commands are run.
- Keep handoff notes current before stopping.

## How to close or archive plans

- Mark the plan complete in its `Progress` section.
- Move any durable decisions into `docs/ai/DECISIONS.md` or an ADR.
- Move durable product/domain/technical facts into the correct `docs/ai/` file.
- Update `docs/ai/CURRENT.md` and `docs/ai/HANDOFF.md`.
- Leave the completed plan in `plans/` unless the repo later adopts an archive convention.

## Feature plan template

```md
# <Feature / Project Name>

## Purpose

## User outcome

## Context

## Relevant memory files

## Relevant source files

## Scope

## Non-goals

## Plan

## Progress

## Decisions

## Validation

## Risks

## Open questions

## Handoff notes
```
