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
- UI files should use kebab-case naming
