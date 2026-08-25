# Validation

Starter intentionally contains no automated test suite or test runner.

## Required checks

| Purpose      | Command             |
| ------------ | ------------------- |
| Formatting   | `pnpm format:check` |
| Lint         | `pnpm lint`         |
| Type safety  | `pnpm typecheck`    |
| Broad static | `pnpm check`        |
| Diff hygiene | `git diff --check`  |

For UI changes, use the native Storybook or the affected native application flow when visual
verification is materially useful. Do not launch a simulator automatically for ordinary changes.

## Policy

- Do not add unit, behavior, integration, E2E, snapshot, or smoke tests.
- Do not add a test runner or a `test` package script.
- Validate source changes with formatting, lint, typecheck, and focused manual inspection.
- Preserve historical worklog entries that mention tests; they describe earlier repository states.
