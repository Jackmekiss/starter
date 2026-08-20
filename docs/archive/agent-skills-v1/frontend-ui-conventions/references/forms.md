# Forms And JSX

## Form handling

Use `react-hook-form` as the default form library.

Prefer:

- keeping form state and validation in the owning form component
- `useForm(...)` for form state
- `<Controller />` to bind `Input` and other controlled UI primitives
- `setError("root", ...)` for server or submission errors

Avoid:

- multiple `useState` fields for production form state when the screen is a real form
- `useController` by default when `<Controller />` is clearer
- placing form state in the screen when a dedicated form component already exists

Rule of thumb:

- screens orchestrate navigation and loading guards
- dedicated form components own `react-hook-form` wiring
- forms own input masks, presentation parsing, and conversion between field values and canonical submission values
- shared business validation still belongs in `core/` when it becomes domain logic

Do not move form-value formatting into the domain or a selector merely to share it. Extract it beside the owning form or feature UI when multiple components in that presentation flow need it.

## JSX helper rules

Avoid inline arrow functions inside JSX returns whenever reasonably possible.

Prefer:

- defining handlers above the `return`
- extracting render helpers or child components
- passing stable named functions when the UI becomes dense

Within a component body, prefer local helpers declared with `const` over local `function` declarations.

Use kebab-case for UI file names such as `home-header.tsx` and `account-subscription-panel.tsx`.
