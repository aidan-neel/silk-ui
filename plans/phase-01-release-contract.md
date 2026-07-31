# Phase 1: Freeze The Release Contract

## Status

**DONE — 2026-07-19.**

## Decisions (locked)

| Decision             | Value                                                         |
| -------------------- | ------------------------------------------------------------- |
| Docs host            | `https://sivir.dev`                                           |
| npm package          | `@sivir-ui/svelte`                                            |
| Target version / tag | `1.0.0` / `v1.0.0`                                            |
| GitHub               | `aidan-neel/sivir-ui`                                         |
| Catalog              | **38** components                                             |
| Removed from catalog | `marquee`, `panel`, `separator`                               |
| Panel look           | `Card` `variant="panel"`                                      |
| Theme Studio         | Post-v1 (public surface removed)                              |
| Changelog page       | Removed from public docs                                      |
| Theme registry       | **Not a v1 product** (code retained; not required/advertised) |

## Frozen catalog

accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, card,
checkbox, code-block, collapsible, color-picker, combobox, command,
context-menu, copy-button, dropdown-menu, hover-card, input, label, modal,
pagination, popover, progress, radio-group, scroll-area, select, sheet,
shortcut, skeleton, slider, switch, tabs, textarea, toast, toggle,
toggle-group, tooltip

## Delivered

- Identity strings pointed at `sivir.dev` / package name consistency
- Studio routes/links stripped from public marketing and getting-started paths
- Changelog route removed from public nav/sitemap
- Catalog cull + Card panel variant
- Pagination / Scroll Area / Shortcut / Command search baseline work started in
  this phase and continued in Phase 2

## Exit criteria

- [x] Canonical identity recorded
- [x] 38-component catalog frozen
- [x] Studio out of public v1 surface
- [x] Registry not required for v1 product story
- [x] Verification gates green on the phase tree
