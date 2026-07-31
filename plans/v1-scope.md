# Sivir UI v1 Scope

**Status:** Approved release contract  
**Target:** `@sivir-ui/svelte` 1.0.0 / tag `v1.0.0`
**Updated:** 2026-07-19

## Decision

Sivir UI v1 ships the component library, package and CLI install paths, CSS-token
theming, and documentation on `sivir.dev`.

**Out of v1 (code may remain in-tree; not public product):**

- Theme Studio
- Theme registry / community gallery / remote theme hosting
- Public changelog page

## Launch Promise

A Svelte 5 + Tailwind v4 user can install `@sivir-ui/svelte` from npm **or** copy
source with the `sivir` CLI, follow the docs, customize documented tokens, and
use every advertised component in a production build.

## Included

### Library (38 components)

accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, card,
checkbox, code-block, collapsible, color-picker, combobox, command,
context-menu, copy-button, dropdown-menu, hover-card, input, label, modal,
pagination, popover, progress, radio-group, scroll-area, select, sheet,
shortcut, skeleton, slider, switch, tabs, textarea, toast, toggle,
toggle-group, tooltip

- Named and namespaced imports from `@sivir-ui/svelte`
- Direct `@sivir-ui/svelte/components/<name>` imports
- Public `ui.css`, tokens, variants, utilities
- Keyboard, focus, pointer, reduced-motion, SSR behavior

### Distribution

- `bun add @sivir-ui/svelte` / npm / pnpm
- CLI: `bunx --package @sivir-ui/svelte sivir {init,add,list}` and
  `sivir add theme <built-in-slug>`
- Isolated manifests + publish workflow with provenance and exact-artifact
  checks (`verify:artifact`, `verify:cli-artifact`)

### Theming

- CSS-variable customization
- Built-in presets via CLI only
- No Studio, no community registry in the public product

### Docs (getting started)

- Introduction, Installation, Theming (includes styling guidance)
- Components index + per-component reference pages
- Canonical host: `https://sivir.dev`

## Deferred (post-v1)

- Theme Studio (editor, local saves, publish UX)
- Theme registry service as a public product (gallery, remote install, ownership)
- Public changelog surface (release notes via GitHub/npm for v1)
- New components beyond the frozen 38
- Svelte 4 / Tailwind 3

## Identity

| Item          | Value                                              |
| ------------- | -------------------------------------------------- |
| Docs          | `https://sivir.dev`                                |
| npm           | `@sivir-ui/svelte`                                 |
| Version / tag | `1.0.0` / `v1.0.0` (bump at Phase 4 freeze)        |
| GitHub        | `aidan-neel/sivir-ui`                              |
| Registry host | Not a v1 product surface (code may stay for later) |

## Success criteria

- No public Studio or registry gallery entry points
- 38 components consistent across package, CLI registry, docs
- Package + CLI fresh-consumer paths green
- CI gates green (including browser, sandbox, both artifact verifiers)
- Production docs on `sivir.dev` without registry dependency
- No open P0/P1 on install, documented behavior, a11y, security

## Plans

- [Implementation index](v1-implementation.md)
- [Release checklist](v1-release-checklist.md)
