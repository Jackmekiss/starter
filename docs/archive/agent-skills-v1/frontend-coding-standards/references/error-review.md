# Error System Review

Use this checklist when reviewing a fallible operation or a bounded-context error migration.

## Boundary audit

Verify:

- shared errors contain only transport-independent technical categories
- the bounded context owns a stable business code union and type guard
- every fallible gateway method returns `Promise<ContextResult<Value>>`
- remote, fake, and in-memory adapters return the same domain contract
- backend codes, HTTP status, SDK types, and raw messages stay in concrete adapters
- adapter-independent error mappers live under `adapters/errors/`
- adapters catch expected infrastructure failures and return `{ ok: false }`
- use-cases do not import concrete adapters or infrastructure mappers
- RTK Query endpoint `queryFn` calls the injected gateway and uses `toRtkQueryResult`
- use-cases contain no transport URL, HTTP method, transport body, SDK operation identifier, or gateway request router
- `.unwrap()` rejects with the exact domain error
- transient request failures are not duplicated into durable slices
- UI copy comes from the context's primary presentation adapter
- global mappings do not assign action-specific copy without an explicit action

Search the target scope for `throw error`, `error.message`, `response.status`, `data.code`, `transformErrorResponse`, `success: false`, `setError(`, `url:`, and `method:`. Treat matches as inspection points, not automatic violations; `url:` and `method:` are valid inside concrete HTTP adapters.

## Severity guidance

- P1: raw backend or SDK failures cross the gateway; expected adapter failures escape RTK Query; callers cannot distinguish success from failure
- P2: backend identifiers leak into domain codes; presentation copy is wrong for the flow; transient errors are persisted without product meaning; fake and real adapters expose different errors
- P3: naming, documentation, or duplication makes the contract harder to extend without changing behavior

## Tests

Repository tests belong to use-cases. Cover use-case-owned validation, mapped business failures reaching `.unwrap()` unchanged, technical failures with the correct `retryable` value, no success-side state update after failure, and unchanged success behavior.

Exercise mapper behavior through a use-case and adapter rather than adding mapper-only specs.

## Validation

Run targeted Oxfmt, Oxlint, and ESLint; relevant use-case specs; TypeScript for contract changes; then repository-wide checks when the change is broad. Distinguish new failures from pre-existing failures in untouched files.
