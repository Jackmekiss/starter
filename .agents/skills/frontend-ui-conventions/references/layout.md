# Layout

## Layout and spacing rules

- Let the parent layout own component placement.
- Do not let reusable child components control their own page placement.
- Do not use page-specific margins inside reusable components for positioning.
- Do not use percentage-based widths in UI layout except as a documented exception.
- Avoid ad hoc margins, negative margins, arbitrary offsets, or arbitrary sizing values inside reusable components to create page spacing.
- Let child components define internal spacing only.
- Let external spacing be handled by the parent.

Prefer parent-controlled spacing with:

- `gap`
- `padding`
- layout wrappers
- dedicated spacer components
- section containers or layout primitives

When fixed multi-column sizing is needed, compute item width in the parent from screen width, container padding, and inter-item gap.

## `app/` vs `components/`

- `app/` orchestrates navigation, hooks, selectors, and screen composition
- `components/` renders presentational blocks and screen feature sections

For screen composition:

- let the screen place the sections in order
- let a section encapsulate its own local actions and simple store reads
- do not create a screen-level render model only to decide section placement

## Component splitting

Split components early when responsibilities diverge.

Prefer:

- one screen orchestrator
- one header component
- one item or card component
- one section component
- one form block component

Avoid large mixed files that combine:

- layout orchestration
- card rendering
- section rendering
- inline local subviews
- ad hoc visual helpers

## Component conventions

Components should:

- focus on rendering
- receive explicit props when they are reusable primitives
- remain easy to read
- be split early when they grow too much
- keep JSX free of inline handlers whenever reasonably possible
- never pass inline function expressions to JSX event props

Prefer explicit props such as `title`, `subtitle`, `onPress`, `selected`, and `disabled`.

Avoid vague props such as `data`, `payload`, or `configBlob`.
Avoid inline arrow functions, anonymous functions, or `.bind(...)` inside JSX event props such as `onPress`, `onChange`, `onSubmit`, `onDismiss`, and `onSelected`. Declare a named handler before the `return` and pass the handler reference, for example `onPress={handlePress}`.

For screen feature sections:

- prefer autonomy over props drilling when the section is not a generic reusable primitive
- keep local formatting, small selectors, and local navigation inside the section
- do not turn section placement into `FooScreenModel` or `FooSectionModel` types
- still move `onPress`, `onChange`, and similar handlers above the `return`
