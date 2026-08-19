# Worklog

## 2026-07-04 - Initialize project memory system

### Context

User requested a lightweight, repo-versioned Project Memory System for humans and fresh Codex sessions. The repository had minimal `AGENTS.md` guidance, local skills under `.agents/skills`, no `docs/` directory, no `plans/` directory, and no `CLAUDE.md`.

### Changes

- Inspected `AGENTS.md`, `README.md`, local skills, skill references, package/config files, source tree, domain files, route files, git branch/status, and recent commits.
- Created initial `docs/ai/` memory taxonomy.
- Created `docs/adr/README.md` for ADR guidance.
- Created `plans/README.md` with plan workflow and template.
- Added project memory skills under `.agents/skills/`.
- Patched `AGENTS.md` with project memory and continuity routing.

### Decisions

- Keep `docs/ai/` as the source of truth for memory.
- Keep stable product/domain memory separate from operational state.
- Use `Unknown` for product and technical facts not supported by repo evidence.
- Use `.agents/skills` for project memory maintenance procedures because this repo already uses that skill system.
- Keep `WORKLOG.md` append-only and rewrite `CURRENT.md` / `HANDOFF.md` as operational state changes.

### Validation

- Commands run for inspection included: `sed`, `find`, `rg`, `git branch --show-current`, `git status --short`, `git log --oneline -n 20`, `git ls-files`, and `mkdir -p`.
- Initial `mkdir -p` for `.agents/skills/*` failed because `.agents/skills` was read-only in the managed sandbox; the command was rerun with approved elevated permission.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.
- Reason: documentation and agent-workflow setup only.

### Next

- Run a consistency pass over required memory files, skill references, `AGENTS.md`, git status, and secret patterns.
- Fill product-specific facts in `docs/ai/product-memory.md` when confirmed product context is available.

## 2026-07-04 - Complete memory consistency pass

### Context

Initial memory files and project memory skills had been created and needed a final safety check.

### Changes

- Confirmed required `docs/ai/` files exist.
- Confirmed project memory skills exist under `.agents/skills/`.
- Confirmed `AGENTS.md` references the memory system.
- Updated `CURRENT.md` and `HANDOFF.md` with completed consistency results.

### Decisions

- No new durable decisions.

### Validation

- Ran `find docs/ai -maxdepth 1 -type f -print`.
- Ran `find .agents/skills/resume-project .agents/skills/checkpoint .agents/skills/update-project-memory .agents/skills/create-plan -maxdepth 2 -type f -print`.
- Ran `git status --short`.
- Ran `git status --short` for `src`, `core`, package/config files, and `README.md`; no source/config changes were reported.
- Ran `rg` checks for memory references in `AGENTS.md` and new skills.
- Ran a strict secret-pattern scan over `docs/ai`, `docs/adr`, `plans`, new memory skills, and `AGENTS.md`; no matches were found.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Fill product-specific facts in `docs/ai/product-memory.md` when confirmed product context is available.

## 2026-07-04 - Remove obsolete product brief references

### Context

User requested removing references to the separate product brief path and keeping product guidance inside the project memory system.

### Changes

- Updated `AGENTS.md` to point product guidance to `docs/ai/product-memory.md`, `docs/ai/user-flows.md`, and `docs/ai/OPEN_QUESTIONS.md`.
- Updated `docs/ai/product-memory.md`, `docs/ai/CURRENT.md`, `docs/ai/HANDOFF.md`, and `docs/ai/OPEN_QUESTIONS.md` to remove references to the obsolete product brief path.
- Updated `.agents/skills/resume-project/SKILL.md` to rely on existing project memory when product facts are missing.

### Decisions

- `docs/ai/product-memory.md` is the durable product-memory source of truth unless future confirmed product facts are added elsewhere.

### Validation

- Ran `rg` for the obsolete product brief path and name across `AGENTS.md`, `docs/ai`, `.agents/skills`, `plans`, and `docs/adr`; no matches remained.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Add confirmed product facts directly to `docs/ai/product-memory.md`.

## 2026-07-04 - Add starter memory initialization workflow

### Context

User clarified that this repository is a starter and that project-specific memory must be reinitialized for each new project derived from it.

### Changes

- Added `.agents/skills/initialize-project-memory/SKILL.md`.
- Added reset templates under `docs/ai/_templates/`.
- Added a `Starter reset policy` section to `docs/ai/INDEX.md`.
- Updated `AGENTS.md`, `CURRENT.md`, and `HANDOFF.md` to reference the initialization workflow.

### Decisions

- Use `initialize project memory for <project name>` as the main trigger phrase.
- Keep starter technical memory and reset project-instance memory from templates.

### Validation

- Passed: required reset templates exist under `docs/ai/_templates/`.
- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.
- Passed: `docs/ai/INDEX.md` contains Keep / Reset / History groups under `Starter reset policy`.
- Passed: strict secret-pattern scan over memory docs, plans, skills, and `AGENTS.md` found no matches.
- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists with expected frontmatter.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Use `initialize project memory for <project name>` when deriving a concrete project from this starter.

## 2026-07-04 - Rename code skills as frontend-specific

### Context

User clarified that the code convention skills are for the Expo frontend and frontend business core, and should not be confused with backend skills in a future monorepo.

### Changes

- Renamed code skills to `frontend-architecture`, `frontend-ui-conventions`, `frontend-domain-layer`, and `frontend-coding-standards`.
- Updated skill frontmatter and descriptions to specify Expo/frontend/client-side scope.
- Updated `AGENTS.md` and memory references to use the new names.

### Decisions

- Use `frontend-*` as the namespace for Expo/frontend code skills.
- Treat `core/` in these skills as frontend business core, not backend server code.

### Validation

- Passed: renamed skill folders exist under `.agents/skills/frontend-*`.
- Passed: no stale direct references to old code skill names remained in `AGENTS.md`, `docs/ai`, or `.agents/skills`.
- Passed: `frontend-architecture`, `frontend-ui-conventions`, `frontend-domain-layer`, and `frontend-coding-standards` skill files exist with expected frontmatter.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.

### Next

- Use `frontend-*` skills for Expo/frontend and frontend-core work only.

## 2026-07-04 - Remove standalone starter-only memory file

### Context

User clarified that the starter should not keep a separate starter-only memory file.

### Changes

- Removed the standalone starter-only memory file.
- Updated `docs/ai/INDEX.md` to state that reusable starter knowledge lives in architecture, technical, testing, and skill docs.
- Updated `.agents/skills/initialize-project-memory/SKILL.md` to read reusable technical memory directly.
- Removed separate starter-memory-file references from current state, handoff, and reset templates.

### Decisions

- Do not create a separate starter-only memory file.

### Validation

- Passed: `.agents/skills/initialize-project-memory/SKILL.md` exists with expected frontmatter.
- Passed: reset templates no longer list a separate starter-only memory file as a file to read.
- Passed: targeted `git status --short` for `src`, `core`, package/config files, and `README.md` showed no changes.
- Passed: strict secret-pattern scan over memory docs, plans, skills, and `AGENTS.md` found no matches.

### Next

- Keep reusable starter knowledge in architecture, technical, testing, and skill docs.

## 2026-08-19 - Synchronize reusable RVA architecture patterns

### Context

The user asked to bring patterns that evolved in `rva-app` back into `starter`, using error management as the simplest example.

### Changes

- Compared both repositories' local architecture, domain, UI, and coding skills.
- Added reusable guidance for responsibility ownership, named adapter concerns, authenticated adapters, error presentation/review, i18n naming, icon styling, form-value ownership, and accessibility.
- Added shared `ApplicationError` and `Result` primitives.
- Migrated all fallible `auth` and `subscription` gateway operations to bounded-context result contracts.
- Removed legacy success/failure unions, raw user-facing adapter messages, and transient error storage from durable slices.
- Added safe presentation resolvers and updated use-case specs to assert exact `.unwrap()` rejections and unchanged durable state on failure.
- Added the stylesheet module declaration required for the existing global CSS import to typecheck.

### Decisions

- Use stable context-owned business codes plus shared transport-independent technical categories.
- Map infrastructure failures in concrete adapters and propagate typed errors through RTK Query.
- Keep transient request failures in RTK Query unless a failure itself is durable product truth.
- Synchronize architecture from RVA without copying product-specific contexts, backend codes, or translations.

### Validation

- Passed: `pnpm run test` (16 files, 24 tests).
- Passed: `pnpm run typecheck`.
- Passed: targeted Oxfmt, Oxlint, and ESLint for changed source files.
- Passed: targeted Oxfmt check for all changed and new files.
- Passed: `git diff --check`.
- Global `pnpm run check` stopped on pre-existing format issues in untouched files.
- Global `pnpm run lint` stopped on pre-existing findings in `src/components/ui/BottomSheetModal.tsx` and `src/components/ui/Button.tsx`.

### Next

- Review and commit the migration.
- Use the same complete-context error migration for future bounded contexts.
