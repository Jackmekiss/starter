# Open Questions

| Date | Question | Area | Impact | Possible owner | Status |
|---|---|---|---|---|---|
| 2026-07-04 | What is the actual product category and post-login user outcome for Starter? | Product | Home screen and user-flow memory are currently skeletal. | Product owner | Open |
| 2026-07-04 | Who are the target users and roles beyond account owner/free/premium subscriber? | Product/domain | Affects permissions, copy, onboarding, and domain naming. | Product owner | Open |
| 2026-07-04 | Which auth backend/provider should replace the local in-memory/fake adapters? | Technical/API | Affects auth contracts, env config, persistence, and validation. | Engineering | Open |
| 2026-07-04 | Is Supabase intended for auth, database, storage, or only future use? | Technical/API | Dependency exists but no configured client/schema was discovered. | Engineering | Open |
| 2026-07-04 | What database technology, schema, migrations, and data ownership rules are intended? | Data model | Data-model memory currently documents TypeScript entities only. | Engineering | Open |
| 2026-07-04 | Should the subscription API be mounted in runtime now? | Architecture | Store factory supports `subscriptionApi`, but runtime mounts only `authApi`. | Engineering | Open |
| 2026-07-04 | What RevenueCat products, entitlements, prices, and platform setup are intended? | Billing/integration | Subscription memory cannot document production billing policy. | Product/engineering | Open |
| 2026-07-04 | What build, release, CI, and e2e validation commands should be used? | Validation/release | Current technical memory only has local scripts. | Engineering | Open |
| 2026-07-04 | Should a Claude-specific guide be added later, or is `AGENTS.md` enough? | Agent workflow | `CLAUDE.md` did not exist, so it was not created. | Maintainer | Open |
