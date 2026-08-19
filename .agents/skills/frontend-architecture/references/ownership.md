# Responsibility Ownership

Place a function according to what would make it change, not merely according to the business noun it manipulates.

| Reason to change                                                                            | Owner    |
| ------------------------------------------------------------------------------------------- | -------- |
| Durable product truth, canonical representation, or intrinsic business invariant            | Domain   |
| Flow-specific decision, before-and-after comparison, or command selection                   | Use-case |
| Remote protocol, storage representation, or infrastructure mapping                          | Adapter  |
| Reading or deriving application state                                                       | Selector |
| Input mask, display formatting, parsing of presentation values, or temporary form mechanics | UI       |

A shared business noun does not imply shared ownership. Split functions that change for different reasons even when they operate on the same entity or value.

Use these checks before placing a function:

- Would the rule remain true across screens, transports, and interaction flows? Keep it in the domain.
- Does the rule decide what one application action must do? Keep it in the use-case.
- Does it translate to or from an external representation? Keep it in the adapter.
- Does it require state or selector inputs and produce a read model? Keep it in a selector.
- Does it exist because of how a user enters or sees a value? Keep it with the owning UI or form.

Do not move code into `domain/` or `selectors/` only to remove it from a component. Move it to the layer whose responsibility it expresses.
