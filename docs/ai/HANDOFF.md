# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `.agents/skills/frontend-ui-conventions/SKILL.md`
5. `.agents/skills/frontend-ui-conventions/references/styling.md`

## Situation summary

The NativeWind v5 migration is published in `754c054`. A focused follow-up makes the third-party interop rule explicit in the frontend UI skill entrypoint and its styling reference.

When a third-party native component ignores `className`, create a local `styled()` adapter and map class props to the component's real style props. Do not use `StyleSheet` merely to bypass missing `className` support.

## Exact continuation point

Review the two uncommitted skill files after `754c054`, then commit and push only when requested.

## Known constraints

- NativeWind v5 is a preview release.
- Keep theme tokens and custom utilities in `src/global.css`.
- Use `styled()` for incompatible third-party components and forward `className` from application-owned components.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: the frontend UI skill entrypoint, its styling reference, and checkpoint documentation.

## Tests / checks last run

- Passed: Skill Creator `quick_validate.py`.
- Passed: targeted Oxfmt check.
- Passed: `git diff --check`.

## Recommended first command

`git diff --check && git status --short`
