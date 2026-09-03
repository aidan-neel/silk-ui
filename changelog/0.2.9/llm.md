## Nested Modal

Compose a second `Modal.Root` inside the first `Modal.Content`. Do not invent a scale, extra scrim, or click-outside guard — overlay stacking is first-party.

- The earlier panel gets `data-stacked="behind"` and scales to `0.925`. The new scrim gets `data-nested` and `--overlay-blur: 0px`.
- Click-outside, Escape, Cancel, and Confirm dismiss only the top modal. Clicks inside another `[data-overlay-root]` are not outside clicks for the parent.
- Select, Combobox, and Dropdown Menu inside Modal are nested layers. Choosing an option or clicking their dismiss scrim must not close the Modal. Do not add a local `allowClickOutside={false}` workaround.
- Closing or unmounting the parent sets nested `bind:open` to `false`. Do not keep a leftover `true` that reopens both layers on the next parent open.
- Keep both layers on the same `orientation` / `size` unless the nested task genuinely needs a different surface.

## Self-hosted default fonts

The default theme uses DM Sans (`--font-sans`, `--font-header`) and JetBrains Mono (`--font-mono`), and both now ship with the package. `ui.css` imports the `latin-400/500/600/700` stylesheets from `@fontsource/dm-sans` and `@fontsource/jetbrains-mono`, which are real `dependencies` of `@sivir-ui/svelte`, so the bundler emits local `woff2` files. There is no Google Fonts request and no runtime network requirement.

Stop doing the old workarounds: do not add a `<link>` to `fonts.googleapis.com`, do not `@import url(...)` remote font CSS, and do not tell consumers to install only `@fontsource/dm-sans` — the mono face is required too. Package-mode consumers get both fonts transitively; `sivir init` treats both `@fontsource` packages as base dependencies alongside `sidenav` peers like `tailwindcss`. Overriding `--font-sans` / `--font-mono` / `--font-header` with another family remains the way to rebrand, and any non-default family (including Theme Studio presets such as Geist or Lora) is still consumer-supplied.

## Code Block tabs roll plain text

Tabbed Code Blocks only roll through Scritto when the active snippet is a single line (install commands). Multi-line language switches swap highlighted source and ease panel height — Scritto is a per-glyph WAAPI engine and cannot cheaply animate a full snippet. Do not re-enable a per-line roll on multi-line tabs. `Content` in a tabbed block is register-only; the root paints the surface.

Three structural constraints keep the roll faithful, all verified against the live docs page. Break any of them and multi-line code visibly collapses or wraps:

- One Scritto instance per source line inside a plain `div`, never one instance for the whole snippet and never inside a `pre`. A multi-line value earns Scritto's `data-wrap` treatment and its newlines die inside nowrap word spans; and Svelte preserves template whitespace as text nodes inside `pre`, which renders as blank lines between rows.
- Rows are `block w-max min-w-full` so long lines scroll instead of wrapping. Scritto's shadow `:host` rules carry `!important` and beat every outside stylesheet and inline style, so wrapping cannot be fixed with a `whitespace-*` class or style — it has to be structural.
- Empty lines render as a block `&nbsp;` span, not an empty Scritto, so they keep their height.
