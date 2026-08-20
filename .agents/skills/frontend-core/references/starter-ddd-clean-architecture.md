# Starter DDD and Clean Architecture

> Blueprint version: `1.0.0`

This is the frozen architectural contract for Starter's frontend core. It describes the repository's pragmatic implementation, not a generic backend Clean Architecture.

## Placeholders

- `<context>`: kebab-case bounded-context name, for example `auth` or `subscription`
- `<Context>`: PascalCase context name, for example `Auth`
- `<entity>` / `<Entity>`: business concept owned by the context
- `<action>`: kebab-case application action folder
- `<verbEntity>`: camelCase use-case operation
- `<Infrastructure>`: concrete external system, for example `Http` or `RevenueCat`

## Canonical Boundary Tree

```text
core/
├── <context>/
│   ├── domain/       # business vocabulary, context errors/results, durable Redux state
│   ├── apis/         # public request/result DTOs and RTK Query API options
│   ├── gateways/     # domain-oriented ports
│   ├── use-cases/    # RTK Query endpoint builders, one action folder at a time
│   └── adapters/     # concrete infrastructure, error mapping, selectors, presentation
├── shared/
│   ├── domain/       # genuinely cross-context contracts such as Result
│   ├── gateways/     # shared ports such as DateProvider
│   └── adapters/     # shared implementations and RTK Query adaptation
└── init-redux-store.ts

src/app-runtime/
├── app-runtime.ts
├── root-app-providers.tsx
└── runtime/
    ├── <context>-runtime.ts
    └── store-runtime.ts
```

## DDD as Starter Uses It

Starter uses strategic DDD to keep the frontend's business language and ownership explicit:

- A bounded context owns a coherent product capability and its durable frontend truth.
- Context names come from product language, not screens, transports, or frameworks.
- Domain model names describe business concepts. Do not create `XxxCard`, `XxxListItem`, or `XxxResponse` domain entities merely for one consumer.
- Request filters, command payloads, and application result shapes live in `apis/types.ts`; external response DTOs stay inside their concrete adapter.
- `core/shared/` is for proven cross-context contracts. Do not move a concept there because two files happen to look similar.
- Contexts communicate through stable public contracts or selectors, not by importing another context's internal adapter.

Starter does not require aggregates, value objects, repositories, domain services, or class-based entities. Introduce such a construct only when the requested behavior and existing code demonstrate a real invariant that needs it.

## Clean Architecture as Starter Uses It

The protected boundary is business meaning, not complete framework independence.

| Concern                                     | Starter owner                 | May depend on                                                                 |
| ------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| Business representation and intrinsic rules | `domain/`                     | shared domain contracts; Redux Toolkit for the context slice                  |
| Application action                          | `use-cases/`                  | domain, public API DTOs, gateway, RTK Query builder types, shared RTK adapter |
| Business port                               | `gateways/`                   | domain and public API DTOs                                                    |
| Concrete transport/storage/SDK              | `adapters/<infrastructure>/`  | gateway, domain, API DTOs, external SDK/transport                             |
| Durable state read adapter                  | `adapters/selectors/`         | context slice, root state, Redux selectors                                    |
| Presentation error adapter                  | `adapters/presentation/`      | context error contract and i18next types                                      |
| API option assembly                         | `apis/`                       | use-case builders, gateway, context error                                     |
| Composition root                            | `src/app-runtime/`            | concrete adapters, API options, store, providers                              |
| Route and component presentation            | `src/app/`, `src/components/` | runtime facade, selectors, presentation adapters, UI primitives               |

Framework-aware choices are intentional:

- A use case is an RTK Query endpoint builder.
- A durable context slice lives under `domain/`.
- `toRtkQueryResult` is the standard application-to-RTK boundary.
- `src/app-runtime/` owns `createApi`, hook exports, concrete gateway selection, middleware, and store mounting.

Do not "purify" these patterns into backend-style interactors, repositories, dependency containers, or framework-free application services unless the user explicitly requests an architecture migration.

## Ownership Decision Skeleton

```text
Does it express durable business truth or an intrinsic invariant?
  yes -> core/<context>/domain
Does it decide what one application action does?
  yes -> core/<context>/use-cases/<action>
Does it define what the action needs from an external capability?
  yes -> core/<context>/gateways
Does it translate an external protocol, SDK, clock, storage, or error?
  yes -> core/<context>/adapters/<infrastructure>
Does it derive a stable read from durable state?
  yes -> core/<context>/adapters/selectors
Does it instantiate implementations, APIs, middleware, or hooks?
  yes -> src/app-runtime
Does it exist only for one mounted interaction or visual presentation?
  yes -> src/app or src/components
```

## Required and Conditional Areas

For a new fallible, stateful context, the complete baseline requires domain models, error/result contracts, a slice, public API types, gateway, API options, at least one use case and behavior spec, an in-memory adapter, selectors, runtime API creation, and store mounting.

Add only when required:

- `adapters/fake/`: delayed demo behavior is needed.
- `adapters/http/`, `adapters/revenuecat/`, or another named concern: a concrete external system exists.
- `adapters/presentation/`: the UI must turn context errors into localized copy.
- a session/actor provider: a concrete adapter needs current credentials.
- `createEntityAdapter`: the context owns a durable collection keyed by id.
- logout cleanup middleware: the context owns account-scoped state that must clear with auth.

## Invariants

- `src/` may consume `core/`; domain and gateway contracts never import `src/`.
- UI never constructs concrete gateways or calls adapter methods.
- Credentials never appear in public action payloads or business gateway parameters.
- Transport URLs, HTTP verbs, SDK operation names, storage keys, and raw response schemas stay in concrete adapters.
- A use case updates durable state only according to its owned business semantics.
- Existing context behavior takes precedence over mechanical skeleton expansion.

## Anti-Patterns

- A context named after a route, component, framework, database table, or transport.
- Generic `helpers`, `misc`, `manager`, `services`, or catch-all business folders.
- Domain models shaped around cards, rows, modals, or API response names.
- Pure UI state promoted to Redux or a use case.
- Concrete adapter imports in a screen.
- A service locator or direct global store import inside a gateway.
- Passing bearer tokens through a mutation payload.
- Moving all infrastructure outside `core/` merely to imitate a textbook diagram.
