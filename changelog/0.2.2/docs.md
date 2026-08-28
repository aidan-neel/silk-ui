- Add repository-wide Sivir design guidance for composition, typography,
  rhythm, restraint, responsive behavior, and visual review.
- Track changelog source files while ignoring generated output, caches, local
  tooling state, test artifacts, and temporary workspaces consistently.
- Restore missing per-component subtitle/description copy on all component docs
  pages and the components index header in the docs section.
- Refresh the docs-facing copy on `Introduction`, `Installation`, and `Theming` pages
  with concise, human-readable wording for consistency with the docs narrative.
- Re-add Back / Next pager buttons opposite the header title on every docs page
  (`/docs/introduction`, `/docs/installation`, `/docs/theming`, `/docs/components`, and all
  `/docs/components/*` pages) via `DocsPager` in `apps/docs/src/lib/components/docs/docs-pager.svelte:1`.
- Update the package metadata version for `@sivir-ui/svelte` to `0.2.2` for the next release.
