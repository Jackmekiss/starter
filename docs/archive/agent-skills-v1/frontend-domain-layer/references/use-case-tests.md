# Use-Case Tests

Use this reference when adding, refactoring, or reviewing behavior specs for use-cases under `core/<bounded-context>/use-cases`.

## Goal

Test application actions at the bounded-context boundary:

- dispatch the RTK Query endpoint for the use-case
- use an in-memory adapter as the gateway implementation
- assert durable context state through `store.getState()`
- avoid UI, selector, and screen concerns

## File Placement

- Put one `*.spec.ts` file next to the tested use-case file.
- Put fluent builders under `core/<bounded-context>/domain/builders/`.
- Do not put builders next to specs.
- Do not create shared spec utility modules unless the user explicitly asks for one.

## Spec Setup Pattern

Each spec must be self-contained.

```ts
import { createApi } from "@reduxjs/toolkit/query";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryXxxGateway } from "@core/xxx/adapters/in-memory/in-memory-xxx-gateway";
import { createXxxApiOptions } from "@core/xxx/apis/xxx-api";
import { createStore } from "@core/init-redux-store";

import type { ReduxStore } from "@core/init-redux-store";

/**
 * Creates the xxx API used by behavior specs.
 */
function createXxxApi(xxxGateway: InMemoryXxxGateway) {
  return createApi(createXxxApiOptions(xxxGateway));
}

describe("Business Action", () => {
  let store: ReduxStore;
  let xxxGateway: InMemoryXxxGateway;
  let xxxApi: ReturnType<typeof createXxxApi>;

  beforeEach(() => {
    xxxGateway = new InMemoryXxxGateway();
    xxxApi = createXxxApi(xxxGateway);
    store = createStore({ xxxApi }, {});
  });
});
```

## Behavior Rules

- Exercise use-cases by dispatching endpoints and calling `.unwrap()`.
- Use named local helpers such as `retrieveAccount`, `purchaseSubscription`, `expectAccount`, and `expectSubscription`.
- Keep fixture setup inside the `it` block when it belongs to that scenario.
- Assert only behavior the use-case owns: state updates, returned result, or gateway-visible effect.
- Use explicit expectations over broad snapshots when checking state transitions.
- Keep failure specs focused on stored domain errors or unchanged durable state.

## Builders

Builder files should mirror domain entities and stay immutable.

```ts
import type { Entity } from "@core/xxx/domain/entity";

/**
 * Creates fluent entity fixtures for domain and use-case behavior specs.
 */
export function entityBuilder({ id = "entity-id" }: Partial<Entity> = {}) {
  const props: Entity = {
    id,
  };

  return {
    /**
     * Returns a new entity builder with the provided identifier.
     */
    withId(value: Entity["id"]) {
      return entityBuilder({
        ...props,
        id: value,
      });
    },

    /**
     * Builds the entity represented by the current builder state.
     */
    build(): Entity {
      return {
        id: props.id,
      };
    },
  };
}
```

## In-Memory Adapter Fixtures

If an in-memory adapter has mutable module-level state, move that state to private instance fields. Expose fixture setters without `public`.

```ts
export class InMemoryXxxGateway extends XxxGateway {
  private currentEntity: Entity | null = defaultEntity;

  /**
   * Sets the locally stored demo entity.
   */
  set entity(value: Entity | null) {
    this.currentEntity = value;
  }

  async retrieveEntity(): Promise<Entity | null> {
    return this.currentEntity;
  }
}
```

Add getters only when production code or a spec genuinely needs to read adapter fixture state directly. Prefer reading the unwrapped use-case result or Redux state.

## Verification

Run targeted checks to avoid unrelated formatting churn:

- `pnpm run test`
- `pnpm run typecheck`
- `pnpm exec oxlint <changed files>`
- `pnpm exec eslint <changed files>`
- `pnpm exec oxfmt <changed files> --check`

Avoid project-wide format fixes unless the user asks for that cleanup. If `pnpm run check` fails on pre-existing unrelated files, report that clearly.
