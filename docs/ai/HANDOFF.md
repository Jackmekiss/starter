# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [../../plans/align-secure-session-with-rva.md](../../plans/align-secure-session-with-rva.md)

## Active plan

None. [Align Secure Session With RVA](../../plans/align-secure-session-with-rva.md) is complete.

## Situation summary

Starter now uses RVA's Redux Persist secure-session storage algorithm: SecureStore extraction/injection, recursive credential sanitization, serialized writes, and fulfilled-query persistence.

## Exact continuation point

Review the working-tree diff, then commit/push only when requested.

## Known constraints

- Never allow `accessToken` or `refreshToken` to survive the recursive AsyncStorage sanitizer.
- Preserve serialized SecureStore writes and `WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Keep the package version compatible with Starter's Expo SDK 56.
- Do not launch Expo unless explicitly requested.

## Last known good state

- Branch at migration start: `master`.
- Starter was clean at `03ff09d`; RVA was read-only and remained untouched.
- Tests, typecheck, targeted format/lint, RVA comparison, and `git diff --check` pass.

## Branch

`master`

## Working tree summary

Expected uncommitted changes replace the Starter-specific session gateway/decorator/bootstrap with RVA's runtime `secure-session-storage.ts`, restore fulfilled-query persistence, adjust account startup loading, and align plans/memory.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 10 pre-existing unrelated files.

## Things not to repeat

- Do not reintroduce the superseded `SessionStorage` gateway, auth decorator, or explicit `auth-bootstrap.ts` flow.
- Do not copy RVA's product-specific Zustand navigation state or CoreAPI token-refresh hook into the neutral starter.
- Do not upgrade `expo-secure-store` to RVA's SDK 57 build without upgrading the Starter Expo SDK.

## Recommended first command

`git diff --check && git status --short`
