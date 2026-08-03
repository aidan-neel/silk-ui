# Docs preview/code via example files + `?raw`

**Date:** 2026-06-20
**Status:** Approved (design + rollout signed off)

## Problem

Every component docs page renders a live preview (`children` of `ComponentPreview`)
and, separately, a hand-written `code` string for the "Code" tab. The two are
maintained independently, drift apart, and the `code` strings do **not** include
the `<script>`/import. We want the Code tab to ALWAYS show the `<script>` with the
import followed by the exact markup the preview renders — guaranteed identical.

## Approach (chosen)

Single source of truth per example via Vite `?raw`:

- Each `ComponentPreview` gets a real example component:
  `src/routes/docs/components/<name>/examples/<example>.svelte`.
- The page imports it twice — once to render the preview, once as raw source:
    ```svelte
    import Basic from './examples/basic.svelte'; import BasicSrc from './examples/basic.svelte?raw';
    ...
    <ComponentPreview code={BasicSrc}><Basic /></ComponentPreview>
    ```
- `ComponentPreview` and `CodeBlock` are UNCHANGED (already take `code` + `children`;
  `CodeBlock` highlights `lang="svelte"` by default).

## Scope

- The **40 nav pages** in `src/lib/components.ts` → their `+page.svelte`
  (~129 `<ComponentPreview>` literals; loops expand to more — see rules).
- OUT OF SCOPE: legacy `src/lib/content/*.svx` (the explicit `+page.svelte` wins
  SvelteKit route precedence; the 4 `.svx`-only slugs — confirm/loading/menubar/
  template — are not in the nav). Leave `.svx` untouched.
- OUT OF SCOPE: "Installation" and "Usage" snippets (separate from `ComponentPreview`).

## Example file rules

1. **Self-contained & canonical.** The file is shown verbatim, so it must read as
   clean, copy-pasteable code: `<script lang="ts">` (keep `lang="ts"`) with the
   real imports, then the markup. Move anything the preview pulled from page scope
   (icons, `$state`, handlers, small data) INTO the file.
2. **Clean explicit markup — no page-data loops.** If a preview rendered a
   `{#each pageArray}` purely to lay items out, replace it with explicit elements
   in the example file (matching what the old hand-written `code` string showed).
3. **Unroll multi-preview loops.** If one `<ComponentPreview>` sat inside an
   `{#each}` that produced several _separate_ previews (e.g. one per Button
   variant), unroll into one example file + one `<ComponentPreview>` section per
   item, each with its own heading as before.
4. **Naming.** `examples/<kebab-name>.svelte` matching the section id/heading
   (e.g. `basic`, `sizes`, `with-icon`, `disabled`, `variant-secondary`). Page
   import aliases: `XxxDemo` for the component, `XxxSrc` for the raw source.
5. **Cleanup.** Remove now-orphaned page-level `*Code`/`heroCode` vars and any
   imports the migration leaves unused (icons, data arrays, types). Keep imports
   still used elsewhere on the page (Steps, highlight for Usage, nav icons, etc.).
6. **Don't change** preview behavior, headings, section ids, ordering, or the
   surrounding page structure. Only the preview/code plumbing changes.

## Verification

- Dev server compiles each page with no new errors.
- Spot-check rendered Preview + Code tabs on several pages (screenshots).
- `vitest run` (unit + ssr + relevant browser) stays green (modulo the two
  pre-existing branch failures unrelated to docs).

## Execution

`button/` is converted first as the reference implementation. The remaining 39
pages are converted in parallel (one agent per page) following this spec + the
button reference. Pages are independent → no file contention.
