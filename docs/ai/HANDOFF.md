# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `src/global.css`
5. `src/components/ui/Icon.tsx`
6. `.agents/skills/frontend-ui-conventions/references/styling.md`

## Situation summary

Starter has been migrated from NativeWind v4/Tailwind v3 to NativeWind v5 preview/Tailwind v4. Configuration is CSS-first through PostCSS, Metro uses import rewrites, and the obsolete Babel transform and JS Tailwind config were removed.

Third-party components that need class-based styling now use `styled()` adapters. Safe-area utilities were migrated to the Tailwind v4 plugin syntax, and the repository UI skill documents the rule.

## Exact continuation point

Review the uncommitted NativeWind migration after `8b74ad5`, then commit and push only when requested.

## Known constraints

- NativeWind v5 is a preview release.
- Keep theme tokens and custom utilities in `src/global.css`.
- Use `styled()` for incompatible third-party components and forward `className` from application-owned components.

## Branch and working tree

- Branch: `master`.
- Expected uncommitted changes: NativeWind/Tailwind dependencies and lockfile, CSS-first configuration, Metro/Babel/PostCSS setup, third-party interop adapters, safe-area classes, UI skill guidance, and checkpoint documentation.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 28 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: targeted Oxfmt check.
- Passed: `pnpm exec expo export --platform web`.

## Recommended first command

`git diff --check && git status --short`
