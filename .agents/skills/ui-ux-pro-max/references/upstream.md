# Upstream Snapshot

- Repository: <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>
- Vendored path: `.claude/skills/ui-ux-pro-max`
- Commit: `e4f45473691e4b389519ee4bc359a3d6df666c26`
- Commit date: 2026-08-26
- Installed: 2026-08-27
- Root repository license at the pinned commit: MIT

## Local adaptation

The upstream `data/`, `scripts/`, upstream tests, `references/quick-reference.md`, and
`references/pro-rules.md` are vendored unchanged. Starter replaces the upstream Claude-oriented entrypoint with a
Codex-native, design-only contract and adds `agents/openai.yaml`, this provenance record, and `LICENSE.txt`.

The local entrypoint deliberately disables generic stack searches and gives repository rules, the existing
gluestack/NativeWind design system, and `frontend-ui` priority over catalog recommendations. No CLI bundle,
branding, slides, Shadcn, or other sibling skills are installed.

When updating, review the upstream diff from this exact commit, verify its license and public security reports,
reapply the local contract intentionally, and run the bundled data and search tests before accepting the update.

## Snapshot validation

Validated locally on 2026-08-27 with Python 3:

- all 130 standalone tests covering search, data quality and contracts, design-system mode, native and Web
  catalog freshness, style taxonomy, and resilient text layout passed;
- `scripts/validate_data.py` passed for 12 domain files, 22 stack files, and `ui-reasoning.csv`;
- native-domain, style-domain, UX-domain, and non-persistent design-system smoke searches completed offline;
- the vendored `data/`, `scripts/`, `references/quick-reference.md`, and `references/pro-rules.md` matched the
  pinned upstream snapshot byte for byte before the local entrypoint and metadata were added.

`test_catalog_refresh.py` and `test_relevance_evaluator.py` are upstream repository-integration tests, not
standalone skill tests. They intentionally look above the vendored skill for root-level catalog refresh scripts,
relevance fixtures, and `scripts/evaluate-relevance.py`, which are not part of `.claude/skills/ui-ux-pro-max` and
were not installed. Run those two tests only from a full checkout of the pinned upstream repository.
