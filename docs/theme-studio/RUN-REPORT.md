# Theme Studio Overhaul — Run Report (Final)

> Branch: `theme-studio-overhaul` (off `github-workflows`). All five phases landed, each committed and green.

## Status at a glance

| Phase                           | State                    | Verification                                           |
| ------------------------------- | ------------------------ | ------------------------------------------------------ |
| 0 — Audit & decisions           | ✅ Landed                | gap-report/decisions/PLAN from grep evidence           |
| 1 — Token architecture & wiring | ✅ Landed                | typecheck 0E, lint 0E, build ✓, tests ✓                |
| 2 — File decomposition          | ✅ Landed (scoped, D2.1) | Studio pixel-identical (Playwright)                    |
| 3 — Playground Preview rebuild  | ✅ Landed                | every token group renders (Playwright + coverage test) |
| 4 — Sidebar + toolbar           | ✅ Landed                | every spacing token has a control (completeness test)  |
| 5 — Style prop (bounded)        | ✅ Landed                | Flat/Soft/Sharp selectable + live-verified             |

**Final gate:** typecheck **0 errors**, **595 tests** pass (was 573 at baseline; +22 new), lint **0 errors**, full build ✓.

## What landed, by phase

**Phase 0 — Audit.** Empirical token map (`gap-report.md`): 28 dead tokens, 77 consumed-but-uneditable, 16 emitted-but-unconsumed, hardcode catalog. Corrected the briefing's false "126 unused tokens" claim. Finalized the 6-group taxonomy (D0.3).

**Phase 1 — Single source of truth.** Wired every audited token to its component; tokenized all themeable hardcodes; promoted 5 spacing axes + a control-easing token into the editable schema; built the group-scoped **motion-curve (easing)** backbone (the brief's "decoupled transitions" pattern); resolved dead tokens. +8 emission/consumption tests.

**Phase 2 — Decomposition.** Extracted the ~1,030-line Playground preview into `studio-preview.svelte` (page 4,079 → 2,921 lines); verified pixel-identical. Toolbar/inspector/dialog extraction folded into 3–4 (D2.1); the spacing-control config was also extracted to a module in Phase 4.

**Phase 3 — Preview coverage.** Added a 4th "Gallery" screen rendering a representative component from **every** token group (Controls/Surfaces/Menus/Modals/Transient/Nav-Data), each section tagged `data-group`. +2 coverage tests; verified live.

**Phase 4 — Controls.** Surfaced every spacing token (extracted `spacing-fields.ts`, added the 5 new tokens) + a decoupled "Control easing" control; wired `primaryButtonOutline` via CSS `outline` (no layout shift) + toggle. +4 completeness tests enforcing controls == `defaultSpacing` keys 1:1 (no orphan tokens / no dead controls).

**Phase 5 — Style mechanism.** Token-bundle Style presets (`themes/styles/`), auto-registered, separately-installable; `styleToCss` applies a coherent override layer. Shipped Flat/Soft/Sharp on the 5-component reference set (Button/Card/Modal/DropdownMenu/Tooltip), Style picker in the Shape tab. +8 tests. Did **not** exceed the reference set; rollout in `style-rollout.md`.

## Decisions

Full log in `decisions.md` (D0.1–D5.2). Notable autonomous calls:

- **D0.1** snapshot-committed the pre-existing 188-file WIP for clean per-phase diffs (recoverable via `git reset --soft 1e77c6b`).
- **D2.1** scoped Phase 2 to the preview extraction; folded the rest into 3–4 to avoid extract-then-rewrite churn.
- **D4.1** `invertedPanels` deferred (needs multi-file menu-color rewiring) — see backlog.
- **D5.2** Style selection not persisted/undoable (bounded) — steps to add in `style-rollout.md`.

## Deferred (backlog — `style-rollout.md`)

- Extend Flat/Soft/Sharp beyond the reference set to all components.
- Per-group radius/elevation/focus-ring scales, density/scale, border-treatment tokens.
- Wire `invertedPanels` (repoint menu-item consumers to `--floating-menu-item-*`).
- Persist `selectedStyleSlug`.

## Known pre-existing issues (NOT introduced here)

- `/themes/[name].css` 500s in dev — the theme-**registry** backend isn't running (`getRegistryThemeBySlug` throws before `themeToCss`). No effect on Studio rendering.
- Pre-existing svelte-check (5) and lint (~134, mostly missing keyed each blocks) warnings predate this work; errors were green at baseline and remain 0.

## How to verify / resume

From `apps/docs`: `bun run check` · `bun run lint` · `bun run test:ci` · (root) `bun run build`. Live: `bun run dev` then `/tmp/sivir-*.mjs` Playwright scripts (chromium) against `/themes/studio` — **restart the dev server fresh before visual checks** (D2.2: accumulated HMR can transiently serve stale content). Scope was kept to the Theme Studio + token system only; no monorepo restructure or CLI build was started (hooks left in `style-rollout.md`).
