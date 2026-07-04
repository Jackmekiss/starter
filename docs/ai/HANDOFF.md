# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)

If debugging, also read [FAILED_ATTEMPTS.md](FAILED_ATTEMPTS.md). If user-facing behavior changes, also read [user-flows.md](user-flows.md) and [domain-glossary.md](domain-glossary.md). If data/API behavior changes, also read [data-model.md](data-model.md) and [api-contracts.md](api-contracts.md).

## Active plan

None.

## Situation summary

The repository is an Expo/React Native starter app with frontend-first architecture. Durable domain code currently centers on auth and subscription bounded contexts under `core/`. UI routes exist for auth, onboarding, and tabs/home, but screens are placeholders. This session initialized the project memory system under `docs/ai/`, added ADR and plan guidance, added memory-maintenance skills, and patched `AGENTS.md` to route future sessions through memory.

## Exact continuation point

The initial memory system is installed. Next work should begin by reading the memory index and current state, then updating product memory once real product facts are available.

## Known constraints

- Do not invent product facts.
- Do not modify app/source code for memory maintenance unless necessary.
- Keep `AGENTS.md` as routing/instructions, not a knowledge dump.
- Keep chronological files append-only.
- Keep secrets and env values out of memory.
- `.agents/skills` may require elevated write permission in the managed sandbox.

## Last known good state

- Branch before setup: `features/memory-test-2`.
- Working tree before setup: clean.
- App validation not run because setup was docs/workflow only.

## Branch

`features/memory-test-2`

## Working tree summary

Expected changes after this setup:

- New `docs/ai/*.md` memory files.
- New `docs/adr/README.md`.
- New `plans/README.md`.
- New project memory skills under `.agents/skills/`.
- Minimal `AGENTS.md` patch for project memory routing.
- No application/source code changes.

## Tests / checks last run

- Passed: required memory files exist under `docs/ai/`.
- Passed: project memory skills exist under `.agents/skills/`.
- Passed: `AGENTS.md` references the memory system.
- Passed: strict secret-pattern scan over memory docs, plans, new skills, and `AGENTS.md` found no matches.
- Passed: targeted source/config status check showed no changes under `src`, `core`, package/config files, or `README.md`.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

## Things not to repeat

- Do not assume product facts that are absent from `docs/ai/product-memory.md`.
- Do not treat internal gateway `url` strings as real backend endpoints.
- Do not treat in-memory subscription prices as production billing policy.
- Do not assume `.agents/skills` is writable without checking sandbox permissions.

## Recommended first command

`git status --short`
