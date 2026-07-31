# Code Block Component — Design

**Date:** 2026-06-22
**Status:** Approved (pending spec review)
**Component:** `@sivir-ui/svelte/components/code-block`

## Summary

A new Sivir UI component that renders source code with syntax highlighting, a
multi-language tab switcher, a built-in copy button, and an optional actions
slot. Modeled on the reference image: language tabs on the left (Python /
JavaScript / Java / Go / C#), action icons on the right, and a dark,
syntax-highlighted code surface below.

## Decisions

- **Highlighting:** bundle `highlight.js` as a dependency of `@sivir-ui/svelte`.
  Lightweight, synchronous, supports all required languages. Token classes
  (`hljs-*`) styled via CSS variables so colors follow Sivir theming.
  - Rationale: keeps highlighting self-contained (true drop-in `<CodeBlock>`)
    without Shiki's async loading and bundle weight. The library's existing
    custom tokenizer (`apps/docs/src/lib/highlight.ts`) does not cover Python /
    Java / Go / C#.
- **Actions:** copy button built in (reuses Sivir's `CopyButton`); info / AI
  sparkle and any other buttons are caller-supplied via an `actions` snippet.
- **API:** both a high-level form (single tag) and a compound form
  (`CodeBlock.Root/Header/Tab/Actions/Copy/Body`), matching the repo's existing
  `Card` / `Tabs` compound + context conventions.

## Architecture

New directory: `packages/sivir/src/components/code-block/`

| File                        | Purpose                                                                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-block.svelte`         | **Root**. Manages active-tab `value` state + snippet registry via context. High-level mode when given `tabs[]` or `code`/`lang`; otherwise renders compound children. |
| `code-block-header.svelte`  | Top bar — `justify-between` row: tabs (left), actions (right).                                                                                                        |
| `code-block-tab.svelte`     | One language tab (`value`, `lang`, label children). Active gets the accent underline; non-active muted. Keyboard arrow navigation.                                    |
| `code-block-actions.svelte` | Right-side container that renders its `children` snippet, then the copy button.                                                                                       |
| `code-block-copy.svelte`    | Copy button wired (via context) to the active snippet's raw code. Reuses `CopyButton`.                                                                                |
| `code-block-body.svelte`    | Dark code surface. Renders highlighted `<pre><code>` for its `value`; visible only when active. Horizontal scroll for long lines; optional line numbers.              |
| `highlight.ts`              | Thin wrapper around `highlight.js`. `highlight(code, lang) => htmlString`; escapes plain text for unknown langs.                                                      |
| `variants.ts`               | `tv()` definitions for root, tab, body.                                                                                                                               |
| `index.ts`                  | Barrel exports (see API).                                                                                                                                             |
| `manifest.ts`               | Version/metadata (match sibling components).                                                                                                                          |

State flows through Svelte context (`setContext`/`getContext`), same pattern as
`Tabs` and `Button`:

- `value` (active tab) — `$bindable` on Root.
- snippet registry — `Tab`/`Body` register `{ value, lang, code }` so `Copy`
  can read the active code and the active `Body` is shown.

## Public API

### High-level

```svelte
<CodeBlock
	tabs={[
		{ label: 'Python', lang: 'python', code: pyCode },
		{ label: 'JavaScript', lang: 'javascript', code: jsCode },
		{ label: 'Java', lang: 'java', code: javaCode }
	]}
/>

<!-- single snippet, no tabs, just copy -->
<CodeBlock code={jsCode} lang="javascript" />
```

High-level props:

- `tabs?: { label: string; lang: string; code: string; value?: string }[]`
  (value defaults to `lang`).
- `code?: string`, `lang?: string` — single-snippet shorthand (ignored if
  `tabs` is provided).
- `value?: string` + `bind:value` — controlled/initial active tab.
- `showLineNumbers?: boolean` (default `false`).
- `actions?: Snippet` — extra buttons placed left of the copy button.
- `class?: string`, plus standard rest props.

### Compound

```svelte
<CodeBlock.Root value="javascript">
	<CodeBlock.Header>
		<CodeBlock.Tab value="python" lang="python">Python</CodeBlock.Tab>
		<CodeBlock.Tab value="javascript" lang="javascript">JavaScript</CodeBlock.Tab>
		<CodeBlock.Actions>
			{#snippet children()}<InfoButton /><AiButton />{/snippet}
		</CodeBlock.Actions>
	</CodeBlock.Header>
	<CodeBlock.Body value="python" code={pyCode} lang="python" />
	<CodeBlock.Body value="javascript" code={jsCode} lang="javascript" />
</CodeBlock.Root>
```

`Actions` always appends `CodeBlock.Copy` after the `children` snippet, so the
copy button is present without explicit wiring. (A `copy={false}` prop can
disable it if needed.)

### Exports (`index.ts`)

```ts
import Root from './code-block.svelte';
import Header from './code-block-header.svelte';
import Tab from './code-block-tab.svelte';
import Actions from './code-block-actions.svelte';
import Copy from './code-block-copy.svelte';
import Body from './code-block-body.svelte';

export { Root, Header, Tab, Actions, Copy, Body };
export { default as CodeBlock } from './code-block.svelte'; // high-level default
export type { CodeBlockProps, CodeBlockTab } from './types';
```

(`Root` doubles as the high-level component — it branches on whether
`tabs`/`code` props are present vs. compound `children`.)

## Behavior

- **Tab switching:** click + keyboard (Left/Right arrows move focus/selection,
  Home/End to ends), mirroring Sivir `Tabs`. Active tab shows the blue underline
  indicator from the image.
- **Copy:** copies the active tab's raw (un-highlighted) code; reuses
  `CopyButton`'s copied-state feedback.
- **Highlighting:** synchronous, computed in a `$derived` from `(code, lang)`.
  No async, no flash. Unknown langs render escaped plain text.
- **Single-snippet mode:** no tab row; the header still renders and shows the
  actions + copy button (so the copy affordance is always present).

## Styling

- Component CSS variables prefixed `--code-block-*` (surface bg, foreground,
  border, tab colors, token colors). Defined with sensible defaults that follow
  Sivir light/dark theming; the code surface is dark to match the image.
- `hljs-*` token classes mapped to `--code-block-token-*` variables
  (keyword, string, comment, function, number, etc.) using the muted VS-Code
  palette from the image.
- Tailwind + `tv()` for layout/variants; `cn()` for class merging (consumer
  classes win), consistent with other components.
- Mono font via existing `--font-mono`. Rounded corners via `--radius-lg`.

## Accessibility

- Tabs: `role="tablist"` / `role="tab"` with `aria-selected`, roving
  `tabindex`; bodies `role="tabpanel"` with `aria-labelledby`.
- Code wrapped in `<pre><code>`.
- Copy button has accessible label (from `CopyButton`).

## Docs

- Add `'code-block'` to `apps/docs/src/lib/components.ts` (drives sidebar nav).
- New page `apps/docs/src/routes/docs/components/code-block/+page.svelte`:
  - **Hero:** the exact multi-language tabbed example from the image, including
    a demo info button + AI-sparkle button in the actions slot.
  - **Examples** (each `examples/*.svelte` + `?raw` source via
    `ComponentPreview`): single snippet, multi-language tabs, compound usage,
    custom actions, line numbers.
  - **Props tables** for each exported part + `InstallCommand`.
- The docs page consumes the library component directly (`@sivir-ui/svelte/components/code-block`).

## Out of scope

- Server-side / build-time highlighting (Shiki) — explicitly not used.
- Editable code / live execution.
- Diff highlighting, line highlighting ranges (could be future work).

## Verification

- `<CodeBlock>` high-level renders the image's tabbed example with correct
  colors per language.
- Switching tabs changes the visible code and the copy target.
- Copy copies the active raw code.
- Compound form renders equivalently and accepts custom actions.
- Single-snippet form renders without a tab row.
- Docs page builds; component appears in sidebar; all examples render and show
  source.
- Type-check / build passes for both `@sivir-ui/svelte` and `apps/docs`.
