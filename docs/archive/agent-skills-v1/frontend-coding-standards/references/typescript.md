# TypeScript

Rules:

- prefer explicit types for domain boundaries
- prefer clarity over clever typing
- avoid overengineering the type system
- use simple discriminated unions when useful
- keep interfaces readable
- a domain interface should be understandable in a few seconds
- prefer `function name()` declarations over `const name = () =>` for named functions; this improves scanning, hoisting behavior, and avoids implicit returns
- use `import type` for imports that are only used as types
- explicit function return types are recommended for public domain boundaries, gateways, adapters, and exported APIs when inference does not make intent obvious; they are not required everywhere
- do not use `any`; model unknown data with `unknown`, explicit request/response types, or narrow type guards
- do not use non-null assertions
- do not use type assertions; prefer typed values, typed adapters, and narrowers
- unused variables are errors unless prefixed with `_`

Documentation:

- use JSDoc comments for business concepts and application functions
- every function, method, type, interface, and enum should have a useful global JSDoc description
- describe intent, business meaning, side effects, constraints, or non-obvious behavior
- do not write comments that only repeat the symbol name or TypeScript type
- document optional parameters when their behavior is not self-explanatory
- document object keys when they carry business meaning or a non-obvious constraint
- do not force `@param` or `@returns` tags when TypeScript and naming already make them obvious

Examples of simple unions:

- `active | paused | finished`
- `planned | completed | skipped`
