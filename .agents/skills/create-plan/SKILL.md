---
name: create-plan
description: Use for multi-step, multi-file, risky, or multi-session work that needs an executable plan under plans/.
---

# Create Plan

Use this skill when work is large enough that future sessions need a self-contained plan.

## Behavior

1. Read `docs/ai/INDEX.md`.
2. Read relevant memory files for the task:
   - `docs/ai/product-memory.md`
   - `docs/ai/architecture-map.md`
   - `docs/ai/technical-memory.md`
   - `docs/ai/user-flows.md` when user-facing behavior changes
   - `docs/ai/data-model.md` and `docs/ai/api-contracts.md` when data/API behavior changes
3. Create `plans/<feature-slug>.md`.
4. Make the plan self-contained and executable.
5. Update `docs/ai/CURRENT.md` to point to the active plan.
6. Update `docs/ai/HANDOFF.md` with how to continue.

## Rules

- Do not over-plan tiny tasks.
- Keep plans specific and easy to execute.
- Track progress as work happens.
- Keep durable decisions in `docs/ai/DECISIONS.md` or `docs/adr/*.md`, not only in the plan.
- Keep durable product/domain facts in the relevant `docs/ai/` memory file.
- Do not store secrets, raw transcripts, or large code snippets in plans.

## Plan template

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
