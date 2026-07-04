---
name: update-project-memory
description: Use when durable project context is discovered, when the user says remember this, this is project context, update project memory, mets ça dans la mémoire, or garde ça pour le projet.
---

# Update Project Memory

Use this skill when durable context needs to be preserved for future humans and agents.

## Classification

Update the most specific file:

| New information | File |
|---|---|
| Product/domain facts | `docs/ai/product-memory.md` |
| Terms/vocabulary | `docs/ai/domain-glossary.md` |
| User flows or UX behavior | `docs/ai/user-flows.md` |
| Architecture | `docs/ai/architecture-map.md` |
| Engineering conventions or commands | `docs/ai/technical-memory.md` |
| Data model | `docs/ai/data-model.md` |
| APIs/integrations | `docs/ai/api-contracts.md` |
| Validation/testing | `docs/ai/testing-validation.md` |
| Durable decisions | `docs/ai/DECISIONS.md` or `docs/adr/*.md` |
| Failed attempts/gotchas | `docs/ai/FAILED_ATTEMPTS.md` |
| Unresolved questions | `docs/ai/OPEN_QUESTIONS.md` |
| Current work status | `docs/ai/CURRENT.md` |
| Handoff context | `docs/ai/HANDOFF.md` |
| Chronological summary | `docs/ai/WORKLOG.md` |

## Rules

- Do not put the same fact everywhere.
- Cross-link instead of duplicating.
- Preserve existing content.
- Mark uncertainty clearly.
- Use `Unknown` when evidence is missing.
- Ask no unnecessary questions; continue with the best-supported classification.
- Do not store secrets, env values, credentials, private tokens, raw chat transcripts, or large code snippets.
- Keep stable product/domain memory separate from current task state.

## Workflow

1. Read `docs/ai/INDEX.md`.
2. Identify whether the new information is stable, operational, chronological, or a decision.
3. Read the target memory file before editing it.
4. Patch only the relevant section.
5. If the update changes current state, update `docs/ai/CURRENT.md` or `docs/ai/HANDOFF.md`.
6. If the update is meaningful session progress, append to `docs/ai/WORKLOG.md`.
