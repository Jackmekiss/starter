# File Growth

Rules:

- split files before they become vague
- if a file starts holding multiple unrelated concepts, split it
- avoid giant utility files

If a helper file keeps growing, ask whether that logic belongs in:

- a bounded context
- a selector
- a use-case
- a UI helper

Rule of thumb: prefer more small clear files over fewer ambiguous files.
