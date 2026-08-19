# Handoff

## Files to read first

1. [../../AGENTS.md](../../AGENTS.md)
2. [INDEX.md](INDEX.md)
3. [product-memory.md](product-memory.md)
4. [architecture-map.md](architecture-map.md)
5. [technical-memory.md](technical-memory.md)
6. [CURRENT.md](CURRENT.md)
7. [../../plans/secure-auth-bootstrap.md](../../plans/secure-auth-bootstrap.md)

## Active plan

None. [Secure Auth Bootstrap](../../plans/secure-auth-bootstrap.md) is complete.

## Situation summary

The secure-auth bootstrap migration is complete. Tokens now persist behind `SessionStorage` with Expo SecureStore, Redux auth is the only runtime session truth, RTK Query caches are not persisted, and navigation mounts only after session hydration and account retrieval.

## Exact continuation point

Review the working-tree diff and commit/push only when requested. The next product decision is the startup retry/error experience for a real auth backend.

## Known constraints

- Do not persist auth, session credentials, subscription entitlement, or RTK Query state in AsyncStorage.
- Unsupported SecureStore platforms intentionally keep sessions only in process memory.
- Do not launch Expo unless explicitly requested.
- Do not launch Expo unless explicitly requested.

## Last known good state

- Branch at migration start: `master`.
- Both `starter` and `rva-app` working trees were clean before inspection.
- Tests, typecheck, targeted format/lint, and `git diff --check` pass.

## Branch

`master`

## Working tree summary

Expected uncommitted changes include the SecureStore session boundary/adapters, deterministic bootstrap, Redux persistence restrictions, removal of Zustand/API-cache persistence, focused auth spec assertions, package lock updates, the completed plan, and memory updates.

## Tests / checks last run

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` stops in the formatting phase on 11 pre-existing unrelated files.

## Things not to repeat

- Do not restore the persisted Zustand `isConnected` flag.
- Do not re-enable persisted RTK Query transforms for auth data.
- Keep the `root-v2` persistence key or add an explicit migration before changing its schema.

## Recommended first command

`git diff --check && git status --short`
