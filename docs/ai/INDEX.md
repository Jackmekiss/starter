# Project Memory Index

`docs/ai/` stores concise, repo-versioned context for humans and fresh agent sessions. Git owns
branch, commit, dirty state, and changed files; memory never copies them.

## Start Here

1. Read `AGENTS.md`, this index, and `CURRENT.md`.
2. Read `HANDOFF.md` only when Current reports interrupted work.
3. Load only the task-relevant stable memory or active plan.
4. Use `project-memory` for Resume, Checkpoint, or Remember; use `begin-project` to initialize a
   derived product, including its source and identifiers.

## Owners

| File                       | Owns                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `product-memory.md`        | Stable product facts and constraints                                 |
| `domain-glossary.md`       | Business vocabulary                                                  |
| `user-flows.md`            | User-visible behavior                                                |
| `architecture-map.md`      | Existing code ownership and dependency boundaries                    |
| `technical-memory.md`      | Cross-cutting toolchain, runtime, environment, and operational facts |
| `data-model.md`            | Durable state and relationships                                      |
| `api-contracts.md`         | Gateways and integration contracts                                   |
| `testing-validation.md`    | Repeatable validation strategy                                       |
| `CURRENT.md`               | Focus, active plan, blockers, and next actions                       |
| `HANDOFF.md`               | Non-obvious continuation context for interrupted work only           |
| `WORKLOG.md`               | Recent meaningful chronology                                         |
| `worklog-archive/`         | Older immutable Worklog history                                      |
| `DECISIONS.md` / `../adr/` | Accepted rationale                                                   |
| `FAILED_ATTEMPTS.md`       | Reusable failed approaches                                           |
| `OPEN_QUESTIONS.md`        | Unresolved facts or choices                                          |

## Budgets and Rotation

Keep Index below 60 lines; Current and Handoff below 40; Technical Memory around 100–150 maximum;
and active Worklog around 200. When Worklog grows, archive older entries by year and quarter while
keeping roughly the latest 10–20 entries active.

## Starter Reset

Initialize a derived product through `begin-project`, which uses `project-memory` Initialize mode for
the memory reset. Preserve `AGENTS.md`, architecture, technical/testing memory, plans procedure, ADR procedure, and skills. Reset
project-instance facts, Current, Handoff, decisions, failures, questions, plans, product-specific
ADRs, and active or archived Worklog history from `docs/ai/_templates/`.

## Rules

Store each fact once in its most specific owner and cross-link instead of copying. Skills own coding
procedures; memory describes the repository. Use `Unknown` rather than speculation. Never store
secrets, raw environment values, transcripts, large source excerpts, or transient logs.
