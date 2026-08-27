---
name: begin-project
description: "Turn the frontend Starter into a named product by renaming app identifiers, selecting and removing example bounded contexts, initializing project memory, and validating the resulting Expo repository. Use when starting a real product from this starter; do not use for routine feature work or memory-only resets."
---

# Begin Project

Convert this frontend template into a clean product baseline without weakening its reusable
architecture.

## Required Inputs

Obtain or confirm these values before editing:

- product display name;
- repository/npm package slug;
- Expo slug and URL scheme;
- iOS bundle identifier and Android application ID;
- the bounded contexts to retain or remove.

Derive a proposed slug from the display name when useful, but do not invent mobile application
identifiers. Use `Unknown` only for product facts when the user explicitly accepts it.

## Safety Boundary

Inspect Git first and preserve unrelated changes. This workflow authorizes conversion of the
starter, but deletion still requires a concrete removal set. Present the exact bounded-context
directories and their dependent wiring, then obtain confirmation before deleting them.

Do not commit, push, replace assets, create remote services, or change signing credentials unless
the user asks. Keep structural paths and aliases such as `core/`, `src/`, `@/*`, and `@@/*` stable
unless the user explicitly requests a topology change.

## Workflow

1. Read `AGENTS.md`, `docs/ai/INDEX.md`, `docs/ai/CURRENT.md`, the relevant manifests, and runtime
   composition.
2. Inventory starter identity with `rg`; distinguish product-facing traces from intentional
   blueprint, archive, or provenance references.
3. Build a retention matrix for `account`, `auth`, `subscription`, and any other context present.
   Trace imports, Redux reducers and middleware, runtime factories, hooks, routes, screens,
   localization, fixtures, and documentation for each proposed removal.
4. After deletion confirmation, remove each selected context as one dependency-closed slice. Do not
   leave placeholder reducers, dead exports, empty routes, or fake adapters behind.
5. Rename the product consistently in `app.json`, `package.json`, lockfile workspace metadata,
   user-visible copy, deep-link configuration, README, and environment examples. Preserve generic
   starter blueprints when they remain useful and label any intentional `Starter` trace in the final
   audit.
6. Use `project-memory` in Initialize mode with the confirmed product name. Source cleanup belongs to
   this skill; `project-memory` owns the reset of `docs/ai/` instance state.
7. Search case-insensitively for the old display name, slug, scheme, package name, bundle ID, and
   removed context names. Classify every remaining match as intentional or unresolved.

## Validation

Run `pnpm install` only when manifest or lockfile consistency requires it, then run:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
```

Run native prebuild or launch a simulator only when required by `AGENTS.md` or explicitly requested.
Report the final identity values, retained and removed contexts, validation results, and intentional
starter traces.
