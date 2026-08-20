# Handoff

## Files to read first

1. `AGENTS.md`
2. `docs/ai/INDEX.md`
3. `docs/ai/CURRENT.md`
4. `.agents/skills/frontend-core/SKILL.md`
5. `.agents/skills/frontend-ui/SKILL.md`
6. `docs/ai/DECISIONS.md`
7. `docs/archive/agent-skills-v1/MANIFEST.md`

## Situation summary

The requested frontend skill reconstruction is complete locally.

Starter source was first normalized around one Auth connection truth, typed gateway results, explicit runtime exports, consistent Subscription error presentation, shared time ownership, UI naming, and theme tokens. The five old skills were then archived and replaced by `frontend-core` and `frontend-ui`, each backed by seven frozen `1.0.0` blueprints and implicit invocation metadata.

Living architecture, product-flow, contract, glossary, validation, and decision memory now describe the normalized implementation. Historical worklog entries retain their original names.

## Exact continuation point

Review the complete diff. If accepted, commit and push only on explicit request. No implementation or forward-test work remains.

## Known constraints

- The six forward-tests and targeted correction reruns ran in temporary copies and were intentionally not merged into Starter; they validate generation behavior rather than add sample features.
- Native VoiceOver/TalkBack was not exercised on a simulator or device because no automation harness was provided.
- Global `format:check` retains nine pre-existing failures in untouched Markdown files.
- Production auth token refresh, startup retry/error UX, and RevenueCat configuration remain open.

## Branch and working tree

- Branch: `master`.
- Baseline commit: `3d63942`.
- Expected uncommitted changes: source normalization, five archived skills, two new skills with fourteen references, and aligned project memory.
- No commit or push was performed.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 32 tests).
- Passed: `pnpm run typecheck`.
- Passed: `pnpm run lint`.
- Passed: both Skill Creator quick validations.
- Passed: targeted Oxfmt and `git diff --check`.
- Passed: all six isolated forward-tests and the corrected Notifications/Profile/Library reruns with their own tests, typecheck, Oxlint, ESLint, formatting, and boundary review.

## Recommended first command

`git diff --check && git status --short`
