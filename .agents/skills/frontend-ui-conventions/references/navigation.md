# Navigation

## Current UI runtime stack

The current project UI stack relies on:

- Expo Router for navigation
- Redux Toolkit and RTK Query for runtime data flow
- NativeWind and Tailwind tokens for styling
- reusable UI primitives in `components/ui/`

## Navigation structure

Navigation is organized with Expo Router route groups.

`app/_layout.tsx` acts as the central runtime entrypoint.

It is responsible for:

- instantiating bounded context base queries
- creating RTK Query APIs
- creating and wiring the Redux store
- wrapping the app with runtime providers
- exporting the API hooks consumed by screens

## Screen conventions

Screens should:

- retrieve data
- call use-cases or context APIs
- connect UI pieces together
- handle navigation

Screens should not:

- implement deep business rules
- transform domain models excessively
- access raw infrastructure directly
- become the source of truth
