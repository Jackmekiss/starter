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
- Added `docs/ai/starter-baseline.md`.
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
- Passed: `python3 /Users/martinseigneuret/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/initialize-project-memory`.
- Not run: `pnpm run test`.
- Not run: `pnpm run typecheck`.
- Not run: `pnpm run lint`.

### Next

- Use `initialize project memory for <project name>` when deriving a concrete project from this starter.
