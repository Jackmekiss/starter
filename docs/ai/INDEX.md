# Project Memory Index

## Purpose

`docs/ai/` is the repo-versioned memory system for Starter. It gives returning humans and fresh Codex sessions enough durable context to understand the product shape, domain model, architecture, conventions, current state, decisions, and safe continuation points without relying on chat history.

Keep this folder concise. Prefer paths, short summaries, and cross-links over copied source code.

## Quick start for a returning human

1. Read [CURRENT.md](CURRENT.md) for the current dashboard.
2. Read [HANDOFF.md](HANDOFF.md) for the safest continuation point.
3. Read [WORKLOG.md](WORKLOG.md) for recent chronological context.
4. Read [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) for unresolved product and technical gaps.
5. Read the active `plans/*.md` file if `CURRENT.md` references one.

## Quick start for a fresh Codex session

1. Read [../../AGENTS.md](../../AGENTS.md).
2. Read this index.
3. Read [product-memory.md](product-memory.md), [architecture-map.md](architecture-map.md), [technical-memory.md](technical-memory.md), [CURRENT.md](CURRENT.md), and [HANDOFF.md](HANDOFF.md).
4. If changing user-facing behavior, also read [user-flows.md](user-flows.md) and [domain-glossary.md](domain-glossary.md).
5. If changing data/API behavior, also read [data-model.md](data-model.md) and [api-contracts.md](api-contracts.md).
6. If debugging, also read [FAILED_ATTEMPTS.md](FAILED_ATTEMPTS.md).
7. Inspect `git status --short`, `git branch --show-current`, and recent commits before editing.

## Memory map

| File | Purpose | Update when |
|---|---|---|
| [product-memory.md](product-memory.md) | Stable product, audience, product rules, and product constraints. | Durable product/domain facts change. |
| [domain-glossary.md](domain-glossary.md) | Shared vocabulary for domain terms and lifecycle states. | New durable terms appear or meanings change. |
| [user-flows.md](user-flows.md) | User-facing flows, states, and relevant files. | User-visible behavior, screens, or flow logic changes. |
| [architecture-map.md](architecture-map.md) | High-level technical map and boundaries. | Directory responsibilities, architecture, runtime, or integration boundaries change. |
| [technical-memory.md](technical-memory.md) | Commands, conventions, code patterns, and validation expectations. | Tooling, scripts, conventions, or project procedures change. |
| [data-model.md](data-model.md) | Durable entities, schema status, relationships, and integrity rules. | Domain entities, database schema, persistence, or ownership rules change. |
| [api-contracts.md](api-contracts.md) | API, gateway, integration, webhook, and contract boundaries. | API endpoints, gateway contracts, integrations, or error contracts change. |
| [testing-validation.md](testing-validation.md) | Repeatable validation strategy and known checks. | Tests, validation commands, QA expectations, or flaky tests change. |
| [CURRENT.md](CURRENT.md) | Short operational dashboard for the current state. | Work starts, stops, changes focus, or reaches a meaningful checkpoint. |
| [HANDOFF.md](HANDOFF.md) | Fresh-session continuation context. | Before stopping, compacting, or handing off meaningful work. |
| [WORKLOG.md](WORKLOG.md) | Append-only chronological work history. | Each meaningful session or checkpoint. |
| [DECISIONS.md](DECISIONS.md) | Durable decisions and rationale, or ADR index. | A decision should survive future sessions. |
| [FAILED_ATTEMPTS.md](FAILED_ATTEMPTS.md) | Real failed approaches, gotchas, and traps. | A failed path or debugging trap is discovered. |
| [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) | Centralized unresolved questions. | Unknowns appear or are answered. |
| [../adr/README.md](../adr/README.md) | ADR process notes. | Formal architecture decision process changes. |
| [../../plans/README.md](../../plans/README.md) | Plan creation and maintenance procedure. | Planning workflow changes. |

## Maintenance rules

- Keep stable product/domain memory separate from current operational state.
- Keep `CURRENT.md` and `HANDOFF.md` short and rewrite them when state changes.
- Keep `WORKLOG.md` append-only.
- Use `DECISIONS.md` for compact durable decisions; use `docs/adr/*.md` when a decision needs a full ADR.
- Update the most specific memory file instead of duplicating the same fact everywhere.
- Cross-link paths when context spans multiple files.
- Use `Unknown` with a short note when the repo does not provide enough evidence.
- Record validation commands and whether they were run or not run.
- Before stopping, run the checkpoint procedure in `.agents/skills/checkpoint/SKILL.md`.

## Do not store here

- Secrets, credentials, tokens, private keys, raw env values, or private URLs.
- Raw chat transcripts.
- Large code snippets or generated source dumps.
- Temporary TODOs that belong in an active plan or issue.
- Product speculation that is not supported by repo files or user-provided context.
