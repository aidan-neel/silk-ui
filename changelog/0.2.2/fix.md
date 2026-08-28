- Add the new `approval-request` and `question` components to the docs component
  registry so package, route, and docs sync checks remain aligned.
- Resolve token-lint violations in modal and spinner internals by moving
  size and blur values to inline-safe style declarations.
- Clean up lint `useTemplate` concatenations in modal, alert-dialog, and sheet
  title/description/content and drop unused `attachment` context and stale
  `question`/`select` imports.
