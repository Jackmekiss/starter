# Testing And Validation

## Discovered validation commands

| Purpose | Command | Source | Verified in this memory setup |
|---|---|---|---|
| Format check | `pnpm run format:check` | `package.json` | Not run |
| Lint | `pnpm run lint` | `package.json` | Not run |
| Typecheck | `pnpm run typecheck` | `package.json` | Not run |
| Unit/use-case tests | `pnpm run test` | `package.json`, `vitest.config.ts` | Not run |
| Broad code check | `pnpm run check` | `package.json` | Not run |

## Fastest safe validation command

- Documentation-only changes: inspect changed Markdown, run `git status --short`, and perform a consistency pass over links and required files.
- Core use-case or domain changes: start with `pnpm run test`.
- Type/API changes: run `pnpm run typecheck`.

## Broad validation command

- `pnpm run check`
- Pair with `pnpm run test` when behavior under `core/**/use-cases` changes.

## Unit test command

- `pnpm run test`
- Vitest runs `core/**/use-cases/**/*.spec.ts` in Node.

## Integration / e2e command

Unknown. No e2e test command or integration test runner was discovered.

## Typecheck command

- `pnpm run typecheck`

## Lint command

- `pnpm run lint`
- Runs Oxlint first, then ESLint.

## Manual QA checklist

For source/UI changes:

- Start the Expo app with `pnpm run start` or the platform-specific script.
- Check startup route selection for unauthenticated, authenticated incomplete onboarding, and authenticated completed onboarding states.
- Verify loading, empty, and error states for any changed screen.
- Confirm auth/session persistence still routes correctly after reload.
- For subscription work, verify offering retrieval, purchase/restore failure, premium selector behavior, and management unavailable states.

For docs-only changes:

- Confirm `docs/ai/INDEX.md` links to all memory files.
- Confirm `CURRENT.md` and `HANDOFF.md` reflect the latest operational state.
- Confirm `WORKLOG.md` has an append-only entry.
- Confirm `AGENTS.md` references the memory system.
- Confirm no secrets, env values, raw transcripts, or large source snippets were written.

## Known flaky tests

Unknown / none discovered.

## Testing conventions

- Use-case specs live next to the use-case under `core/<bounded-context>/use-cases/<action>/*.spec.ts`.
- Specs dispatch RTK Query endpoints and assert durable context state through `store.getState()`.
- Use in-memory adapters as test gateways.
- Keep specs self-contained.
- Builders live under `core/<bounded-context>/domain/builders/`.
- Prefer explicit expectations over snapshots.

## When to add tests

- Add or update use-case tests when behavior under `core/<bounded-context>/use-cases` changes.
- Add tests when domain state transitions, gateway contracts, adapters, selectors, or error behavior change.
- UI-only placeholder/docs changes do not require app test suites unless they affect runtime behavior.

## Where tests live

- Current test suite: `core/**/use-cases/**/*.spec.ts`.
- No UI, integration, or e2e test locations were discovered.
