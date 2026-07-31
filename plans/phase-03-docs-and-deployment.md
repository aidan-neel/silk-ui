# Phase 3: Docs And Deployment

## Status

**DONE — 2026-07-19** for core v1 docs posture.  
**Open polish** listed below should be finished before Phase 4 freeze.

## Decisions

| Topic            | Choice                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Docs tone        | Component-doc typography; readable body (`text-foreground`); library `CodeBlock` |
| Getting started  | Introduction, Installation, Theming only                                         |
| Styling page     | **Merge into Theming** (remove duplicate Styling page)                           |
| Components entry | Under **Getting Started** sidebar (not top-nav primary)                          |
| Theme registry   | **Not in v1** — code kept; sitemap/env/README do not require it                  |
| CLI docs         | `bunx --package @sivir-ui/svelte sivir …`                                        |
| Package docs     | `bun add @sivir-ui/svelte` + `@import '@sivir-ui/svelte/ui.css'`                 |
| Component docs   | Untouched except shared nav                                                      |
| `1.0.0` bump     | Phase 4 freeze only                                                              |

## Delivered

- Getting-started pages rewritten (no Studio marketing)
- Installation covers package + CLI
- Theming: tokens, presets, dark mode (+ styling methods when merge completes)
- Registry optional in `.env.example` / README
- `/themes` not in public sitemap
- `docs-release` contracts for catalog, sitemap, CLI invocation shape
- Default + Node adapter docs builds verified during phase work

## Open before RC

1. ~~Delete or redirect `/docs/styling` → Theming~~ (301 redirect + merged page)
2. ~~Sidebar Getting Started: Introduction, Installation, Theming, Components~~
3. ~~Top navbar: Home + Docs only~~
4. ~~More vertical spacing (`gap-16`) on getting-started pages~~
5. Confirm Command palette search feels correct after fuzzy-search fix (or accept).

## Exit criteria

- [x] Getting-started docs match package + CLI behavior
- [x] No Studio in getting-started product story
- [x] Registry not required for v1 docs deploy
- [x] Component reference pages remain the catalog surface
- [x] Docs build (Vercel + Node)
- [x] Nav/IA polish items 1–4
- [x] Command palette search uses word-token fuzzy ranking without false positives
- [ ] Version `1.0.0` (Phase 4)
