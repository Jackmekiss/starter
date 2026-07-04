# Decisions

| Date | Decision | Reason | Alternatives considered | Scope | Status |
|---|---|---|---|---|---|
| 2026-07-04 | Use `docs/ai/` as the source of truth for project memory. | User requested repo-versioned Markdown memory with stable and operational files. | Store memory in `AGENTS.md`; external/private notes. | Documentation and agent workflow. | Accepted |
| 2026-07-04 | Keep `AGENTS.md` as a routing file instead of a knowledge dump. | Top-level instructions should stay short and point agents to the correct memory files. | Copy product/architecture facts into `AGENTS.md`. | Agent onboarding. | Accepted |
| 2026-07-04 | Use `.agents/skills` for memory procedures. | The repo already uses `.agents/skills`; creating a duplicate skill system would add confusion. | Add scripts only; create another skills directory. | Agent workflow. | Accepted |
| 2026-07-04 | Keep product/domain memory separate from current task state. | Stable facts and operational state age differently and should not overwrite each other. | Single large memory file. | Memory taxonomy. | Accepted |
| 2026-07-04 | Use `docs/adr/` for formal ADRs and `docs/ai/DECISIONS.md` for compact decisions. | No ADR system existed, but future durable architecture choices may need fuller records. | Only compact table; only ADR files. | Decision tracking. | Accepted |
| 2026-07-04 | Use `plans/*.md` for multi-session feature plans. | Plans need a separate lifecycle from current dashboard and durable memory. | Put active plans in `CURRENT.md`; use external task tracking only. | Work planning. | Accepted |
