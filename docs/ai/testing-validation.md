# Testing And Validation

## Discovered validation commands

| Purpose                     | Command                                                                                                 | Source                             | Verified in this memory setup |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------- |
| Format check                | `pnpm run format:check`                                                                                 | `package.json`                     | Targeted Oxfmt passed         |
| Lint                        | `pnpm run lint`                                                                                         | `package.json`                     | Passed 2026-08-20             |
| Typecheck                   | `pnpm run typecheck`                                                                                    | `package.json`                     | Passed 2026-08-20             |
| Unit/use-case tests         | `pnpm run test`                                                                                         | `package.json`, `vitest.config.ts` | 16 files, 32 tests passed     |
| Story registry              | `pnpm run storybook:generate`                                                                           | `package.json`, `.rnstorybook/`    | Passed 2026-08-20             |
| Storybook web bundle        | `STORYBOOK_SERVER=false STORYBOOK_ENABLED=true pnpm exec expo export --platform web --output-dir <tmp>` | Storybook/Expo docs                | Passed 2026-08-20             |
| In-app Storybook web bundle | `EXPO_PUBLIC_STORYBOOK_ENABLED=true pnpm exec expo export --platform web --output-dir <tmp>`            | `package.json`, Expo Router        | Passed 2026-08-21             |
| Broad code check            | `pnpm run check`                                                                                        | `package.json`                     | Not run                       |

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
- Switch the device between French, English, and an unsupported language; verify translated copy and the French fallback.
- Submit the login form with invalid fields and mapped backend failures; verify loading, focusable controls, and accessible localized error copy.
- For subscription work, verify offering retrieval, purchase/restore failure, premium selector behavior, and management unavailable states.
- For shared UI work, regenerate Storybook discovery, verify the changed story in explicit light/dark modes, and confirm accessible names/states and long copy.
- For Storybook infrastructure, serve the static export and confirm a non-empty registered root, no console errors, all 19 families, and eight Poppins weights. For the in-app mode, authenticate with the in-memory fixture, reach Home, and activate the localized `home.storybook` launcher.
- Exercise camera permission, bottom-sheet gestures, Android hardware back, VoiceOver, and TalkBack on supported native targets when those behaviors change.

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
- Use in-memory adapters for domain behavior and concrete fake/HTTP adapters when verifying adapter mapping through a use-case.
- Keep specs self-contained.
- Builders live under `core/<bounded-context>/domain/builders/`.
- Prefer explicit expectations over snapshots.
- For fallible use-cases, assert the exact value rejected by `.unwrap()` and confirm failure does not apply success-side durable state updates.
- Inject deterministic typed adapter failures through adapter setters or injected transports; exercise mappers through use-cases instead of mapper-only specs.
- Inject `DeterministicDateProvider` when a behavior depends on the current time and assert exact timestamps rather than broad string shapes.

## When to add tests

- Add or update use-case tests when behavior under `core/<bounded-context>/use-cases` changes.
- Add tests when domain state transitions, gateway contracts, adapters, selectors, or error behavior change.
- UI-only placeholder/docs changes do not require app test suites unless they affect runtime behavior.
- Add or update a co-located story whenever a shared primitive's public variants, states, anatomy, accessibility contract, or sizing changes.

## Where tests live

- Current test suite: `core/**/use-cases/**/*.spec.ts`.
- No UI, integration, or e2e test locations were discovered.

## Frontend skill validation

- Validate `frontend-core` and `frontend-ui` with Skill Creator's `quick_validate.py`.
- When a frozen blueprint changes, rerun an independent generation scenario for the changed workflow and at least one regression scenario.
- Evaluate generated diffs against architectural and behavioral invariants, not against exact prose.
- Keep forward-test workspaces outside the repository and do not retain their generated source.
