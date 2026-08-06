# Sivir Theme Studio — Token System Overhaul (Executed Plan)

> Companion docs: [`gap-report.md`](./gap-report.md) (empirical audit), [`decisions.md`](./decisions.md) (autonomous decisions), [`style-rollout.md`](./style-rollout.md) (Phase 5 backlog), [`RUN-REPORT.md`](./RUN-REPORT.md) (final summary).

## Context

Sivir is a Svelte 5 runes component library (38 public components) whose thesis is **extreme customizability** — the Theme Studio should re-skin every component. Today: the Studio exposes only a slice of the real token surface; tokens live in **two sources of truth** (`ui.css` static defaults + `themeToCss()` dynamic overrides); a handful of values are hardcoded; tokens are flat (no group scope); and the 4,079-line Studio page renders a static preview that doesn't prove every token works. This overhaul makes every customizable property flow from one source, group-scoped with per-component override, exposes every token live, decomposes the page, rebuilds the preview, and ships a bounded "Style" preset mechanism.

Run is **autonomous** — open decisions are made defensibly and logged in `decisions.md`. Each phase lands typecheck + lint + full test suite green and build passing, then commits, before the next begins.

## Confirmed architecture (Phase 0 audit)

- Components in `packages/sivir/src/components/<name>/` (`*.svelte`, `index.ts`, `variants.ts` via `tailwind-variants`, `manifest.ts`); consume tokens through Tailwind arbitrary values (`px-[var(--button-padding-x)]`) and JS reads (`getCssNumber(node, '--motion-sheet-offset')`).
- Static layer: `packages/sivir/src/ui.css` (198 declared tokens). Dynamic layer: `themeToCss()` in `presets.ts` (129 emitted). Code consumes 182. **Gaps:** 28 dead, 77 consumed-but-uneditable, 16 emitted-but-unconsumed, plus the Category-C hardcodes — see `gap-report.md`.
- Live apply: `themes/live.ts` injects `<style id="sivir-live-theme-style">`. Studio state = `$state` runes in `+page.svelte`; `generatedCss = $derived(themeToCss(editorTheme))`; `$effect` re-applies.
- Tests: Vitest 4 + @testing-library/svelte in `apps/docs/tests/unit/sivir/` (projects: unit/ssr/browser). Baseline: **0 typecheck errors, 573 tests pass, 0 lint errors.**
- Commands (from `apps/docs`): `bun run check` | `bun run lint` | `bun run test:ci` | `bun run test:browser`; build from root `bun run build`; `bun run dev`. A **lefthook pre-commit** runs Biome formatting and linting; run `bun run format` before committing.

## Phases

- **Phase 0 — Audit & decisions.** ✅ Done: `gap-report.md`, `decisions.md`, `PLAN.md` written; taxonomy validated (D0.3).
- **Phase 1 — Token architecture & full wiring.** Migrate editable defaults into the TS schema (D0.2); promote Category-B3 + curated B2 into schema and emit them; introduce group-scoped tokens with `var(--component, var(--group))` fallback (transitions/easing/radius/focus-ring/elevation first); eliminate Category-C hardcodes; fix button sm/lg padding shadowing; wire `--motion-panel-easing` and the half-wired `--floating-*` menu tokens (D0.5); resolve dead tokens (wire valuable, delete inert). Add token→render wiring tests. _Green:_ no hardcoded visual values in audited components; every token affects its component; suite green; build passes; commit.
- **Phase 2 — File decomposition.** Split `+page.svelte` into modules under `apps/docs/src/lib/components/themes/studio/` (preview, sidebar sections per group, toolbar, shared `studio.svelte.ts` state). Pure refactor. _Green:_ behavior identical; suite green; build passes; commit.
- **Phase 3 — Playground Preview rebuild.** Preview renders a representative component from every group so every control visibly changes something. Magic MCP + `frontend-design`/`emil-design-eng` for coherence. Add group-coverage acceptance test. _Green:_ every control changes preview; coverage test green; suite green; build passes; commit.
- **Phase 4 — Sidebar + bottom toolbar.** Surface every customizable token by taxonomy with per-component override affordances; expand toolbar for global/style controls; add cheap new axes (per-group radius/elevation/focus-ring, easing decoupled from duration, density/scale, border-treatment). Cross-check test: every emitted token has a control; no orphan controls. _Green:_ suite green; build passes; commit.
- **Phase 5 — Style prop (bounded).** Style preset mechanism (token bundles), separately-installable packaging; ship 3 styles (Flat/Soft/Sharp) on 3–5 reference components (one per group); expose in Studio; write `style-rollout.md`; finalize `RUN-REPORT.md`. **Do not exceed the reference set.** _Green:_ style-switch works + selectable; mechanism tests green; suite green; build passes; commit.

## Verification

Per phase from `apps/docs`: `bun run check && bun run lint && bun run test:ci` (+ `test:browser` where relevant); root `bun run build`; manual drive via `bun run dev` + Playwright MCP. New tests: token emission+consumption (P1), preview group-coverage (P3), control↔token completeness (P4), style-switch (P5).

## Circuit breaker

If a phase needs a destructive/irreversible change, or a core assumption proves wrong, STOP at the last good commit and write findings to `RUN-REPORT.md`. No guessing through structural unknowns.
