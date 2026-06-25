# Naming

Names should reflect domain language before technical language.

Prefer names that make business meaning explicit.

Rule of thumb: if a folder or file name could belong to any project, it is probably too generic.

## Business-first naming

Prefer names such as:

- `trainingPlan`
- `account`
- `cycle`
- `catalog`
- `sessionRecord`
- `dailyWellness`

Avoid:

- `data`
- `item`
- `info`
- `thing`
- `helpers`
- `misc`
- `manager`

## Use-case naming

Use-cases should always be named with verbs such as:

- `retrieveAccount`
- `updateAccount`
- `validateDayPlan`
- `createTrainingLog`

Avoid names such as:

- `accountUtils`
- `planLogic`
- `validationHelpers`
- `updateStuff`

## File naming

- domain files should usually be singular and business-oriented
- component names should describe UI purpose, not implementation
- screen file names should reflect the user-facing action or section
- files and folders should use kebab-case by default
- component files and component folders should use PascalCase, such as `MyComponent.tsx` or `MyComponent/index.tsx`
- hook files and hook folders should use camelCase, such as `useThis.ts` or `useThat/index.ts`
- acronyms should be treated as words in camelCase and PascalCase names: use `myApi.ts`, not `myAPI.ts`; use `ComponentAbc.tsx`, not `ComponentABC.tsx`
- framework or tooling conventions may keep their required names, such as Expo Router route groups, `_layout.tsx`, `index.tsx`, dotfiles, and conventional documentation files

## Identifier naming

- variables, functions, parameters, properties, and other value-like identifiers should use `camelCase`, `UPPER_CASE`, or `PascalCase` only
- types and enum members should use `PascalCase`
- acronyms should be treated as words in `camelCase` and `PascalCase`: use `createAuthApi`, not `createAuthAPI`; use `AuthScopeDto`, not `AuthScopeDTO`
- do not use abbreviations for variables, functions, members, or utility names; prefer complete self-explanatory words even when they are longer
- avoid short aliases such as `cfg`, `tmp`, and `val`; use names such as `configuration`, `temporary`, or `value`
