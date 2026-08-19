---
name: frontend-coding-standards
description: "Use when reviewing or tightening Expo/frontend and frontend-core code quality in this repository: naming, TypeScript boundaries, file splitting, refactoring discipline, application-error boundary audits, review checklists, and final agent rules for client-side code. Prefer this skill for frontend review, cleanup, error-system audits, and standards-enforcement tasks. Do not use it as backend coding standards or as the primary skill for feature design unless the task is mainly about frontend standards compliance."
---

# Frontend Coding Standards

Use this skill when the task is mainly about Expo/frontend or frontend-core code quality and consistency.

## Goals

- Keep naming business-first and explicit.
- Keep TypeScript boundaries readable and simple.
- Split files before they become vague.
- Review and refactor for clarity, not abstraction for its own sake.

## Workflow

1. Read [naming.md](references/naming.md) for repository naming expectations.
2. Read [typescript.md](references/typescript.md) for typing conventions.
3. Read [file-growth.md](references/file-growth.md) for splitting rules.
4. Read [refactoring.md](references/refactoring.md) for refactor quality checks.
5. Read [review-checklist.md](references/review-checklist.md) for review criteria and final agent rules.
6. Read [error-review.md](references/error-review.md) when reviewing a fallible operation, infrastructure integration, RTK Query error flow, or bounded-context error migration.

## Decision rules

- Prefer obvious code over smart code.
- Prefer business meaning over generic helpers.
- Prefer smaller clear files over large ambiguous ones.
- Treat infrastructure leakage and untyped fallible gateway methods as boundary defects.
- Use this skill as a guardrail, not as a substitute for architecture or domain design.

## Do not use this skill for

- Choosing route, component, or domain ownership as the main task.
- Styling or layout work.
- Implementing business-layer flows without a standards or review angle.
- Backend services, database schema, server routes, queues, or backend-only code.
