# Current Project State

Last updated: 2026-08-20

## Current branch

`master`

## Current focus

Explicit NativeWind v5 third-party interop guidance.

## Current status

Implemented and validated locally. Changes are uncommitted after `754c054`.

The `frontend-ui-conventions` entrypoint and styling reference now enforce the exact decision: application components forward `className`; incompatible third-party native components use a local NativeWind v5 `styled()` adapter; `StyleSheet` is not an interop workaround.

## Next 3 concrete actions

1. Review the focused frontend UI skill diff.
2. Commit and push only when requested.
3. Apply the rule to future third-party UI integrations.

## Relevant files

- `.agents/skills/frontend-ui-conventions/SKILL.md`
- `.agents/skills/frontend-ui-conventions/references/styling.md`

## Active plan

None.

## Last validation commands and results

- Passed: Skill Creator `quick_validate.py`.
- Passed: targeted Oxfmt check on both changed skill files.
- Passed: `git diff --check`.

## Blockers / open questions

- Production auth token refresh and startup retry/error UX remain Unknown.
- Concrete RevenueCat runtime configuration remains Unknown.

## Do-not-forget notes

- NativeWind v5 is still published as a preview release.
- Keep Tailwind customization in `src/global.css`, not a v3-style JS config.
- Use `styled()` only at incompatible third-party boundaries; application-owned components should forward `className`.
- Do not push until requested.
