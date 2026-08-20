# Error Presentation

The UI consumes errors already translated from infrastructure into the owning bounded context's domain contract.

## Mutation flow

Use RTK Query `.unwrap()` so the component receives the success value normally and catches the typed domain error. The caught value remains `unknown`; pass it to the bounded context's presentation adapter instead of casting it in the component.

For forms, keep server or submission copy in `setError("root", ...)`. Keep field validation in the form and shared business validation in the use-case.

## Resolver ownership

Keep one error-message resolver per bounded context under a named presentation adapter folder, such as `adapters/i18next/`. Prefer an options object when copy depends on the action.

The resolver may map stable business codes to bounded-context copy, reusable technical categories to genuinely shared copy, and unknown values to the caller's fallback. Do not map generic `forbidden` or `unauthenticated` failures to action-specific copy without checking an explicit action context.

## Query flow

- gate loading and error before rendering dependent sections
- resolve typed query errors through the same presentation adapter
- keep retry interaction in the UI
- use `retryable` only for interaction behavior, never to reveal backend detail

Do not copy request errors into a Redux slice merely to select them later. RTK Query owns transient request state. Store a failure in domain state only when the failure itself is durable product truth shared across flows.

## Forbidden UI behavior

Components and screens must not inspect HTTP status or backend codes, import concrete infrastructure mappers, display `error.message`, branch on SDK exception classes, translate raw backend messages, or infer flow-specific meaning from generic technical errors without explicit action context.
