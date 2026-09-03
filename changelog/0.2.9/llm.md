## Nested Modal

Compose a second `Modal.Root` inside the first `Modal.Content`. Do not invent a scale, extra scrim, or click-outside guard — overlay stacking is first-party.

- The earlier panel gets `data-stacked="behind"` and scales to `0.925`. The new scrim gets `data-nested` and `--overlay-blur: 0px`.
- Click-outside, Escape, Cancel, and Confirm dismiss only the top modal. Clicks inside another `[data-overlay-root]` are not outside clicks for the parent.
- Overlay stacking follows component-tree depth, not `$effect` registration order. A nested `Modal.Content` is a higher layer even when both `bind:open` start `true`.
- Select, Combobox, and Dropdown Menu inside Modal are nested layers. Choosing an option or clicking their dismiss scrim must not close the Modal. Do not add a local `allowClickOutside={false}` workaround.
- Closing or unmounting the parent sets nested `bind:open` to `false`. Do not keep a leftover `true` that reopens both layers on the next parent open.
- Keep both layers on the same `orientation` / `size` unless the nested task genuinely needs a different surface.

## Theme v3 extensions

`Theme` is now version 3 and additive over v2: `parseTheme` accepts `version: 2` or `3`, and `migrateThemeV2ToV3()` upgrades without changing rendered CSS. New optional blocks mirror the Theme Studio sections so studio output serializes as a `Theme`: `foundation: { light, dark }` with `base/border/background/secondary/muted` (emitted as the matching `--color-*` tokens), `tokens: { light, dark, shared }` keyed by `--token-name` with plain CSS values (no `;{}`), `typography: { headerSize 10-32, headerWeight, roleWeights }`, and `chrome: { shadows, primaryStroke, interactiveCursor }`. `themeToCss` appends them after the base blocks in studio order.

Stop doing the old workarounds: do not hand-append `:root`/`.dark` override blocks after `themeToCss` output — put them in the `Theme` object so they survive JSON round-trips. Light-only `foundation`/`tokens` and the chrome light block emit under `:root:not(.dark)`, matching the studio, so they never leak into dark mode; do not scope them to plain `:root`. New exports are `ThemeFoundation`, `ThemeFoundationPalette`, `ThemeTokenOverrides`, `ThemeTypography`, `ThemeRoleWeights`, `ThemeChrome`, `ThemeFontWeight`, `InteractiveCursor`, `SUPPORTED_THEME_VERSIONS`, and `migrateThemeV2ToV3`. The registry API still validates only the v2 base fields — v3 extensions need a Prisma migration before community themes can carry them, so copy-paste CSS remains the distribution path.

## Combobox input appearance

`Combobox.Trigger` accepts `appearance?: 'button' | 'input'` (default `'button'`) and an optional `trailing?: Snippet` adornment, mirroring `Input`'s `trailing` snippet. Button appearance is unchanged: button-styled frame, chevron unless `trailing` is provided, readonly until open, click toggles.

Use `appearance="input"` for search-field behavior: the frame uses the `input()` field styles, the text is always editable, the menu opens on focus or typing (click never closes), `Enter` picks the active match, `Escape` closes, and there is no chevron unless `trailing` is provided. Pass the icon as a snippet child (`{#snippet trailing()}<Search size={16} />{/snippet}`), not as a prop. While a query or selection is present, input appearance swaps the adornment for a built-in clear button (`data-ui="combobox-trigger-clear"`) that resets the query, selection, and bound value and keeps the menu open. Reopening preserves the selection as the editable query instead of clearing it. `combobox` manifest is now `2.3.0` with an added `input` component dependency — `sivir add combobox` pulls it automatically.

`Popover.Content` gained `dismissLayer?: boolean` (default `true`, `popover` manifest `3.1.0`). Combobox sets it false in input appearance so the full-viewport dismiss layer does not cover the trigger — the trigger must stay clickable (focus, caret, clear button) while open. Outside pointer dismissal still applies via `allowClickOutside`, so do not reimplement outside-close for this case. Rename candidate if you dislike it: the layer owns `data-ui="popover-dismiss"`. Never seed `searchContent`/`results` from inside a `$effect` that also reads combobox state (fuse subscribes to the item set and remount churn re-triggers it); seed synchronously in open/show event handlers instead.

## Self-hosted default fonts

The default theme uses Inter (`--font-sans`, `--font-header`) and JetBrains Mono (`--font-mono`), and both now ship with the package. `ui.css` imports the `latin-400/500/600/700` stylesheets from `@fontsource/inter` and `@fontsource/jetbrains-mono`, which are real `dependencies` of `@sivir-ui/svelte`, so the bundler emits local `woff2` files. There is no Google Fonts request and no runtime network requirement.

Stop doing the old workarounds: do not add a `<link>` to `fonts.googleapis.com`, do not `@import url(...)` remote font CSS, and do not tell consumers to install only `@fontsource/inter` — the mono face is required too. Package-mode consumers get both fonts transitively; `sivir init` treats both `@fontsource` packages as base dependencies alongside `sidenav` peers like `tailwindcss`. Overriding `--font-sans` / `--font-mono` / `--font-header` with another family remains the way to rebrand, and any non-default family (including Theme Studio presets such as Geist or Lora) is still consumer-supplied.

## Shortcut hides below sm

`Shortcut` renders `hidden ... sm:inline-flex`: the kbd chip is removed from layout below 640px and appears from `sm` up. The keybinding itself still works everywhere — only the visual is gated — so touch layouts with Bluetooth keyboards keep working.

Stop doing the old workarounds: do not wrap `Shortcut` in your own `hidden sm:block` containers, and do not assume a shortcut hint is visible when reasoning about a small-screen layout (button widths, menu row spacing). To force a chip visible on small screens, pass a display class — consumer classes win over the default.

## Code Block tabs roll plain text

Tabbed Code Blocks only roll through Scritto when the active snippet is a single line (install commands). Multi-line language switches swap highlighted source and ease panel height — Scritto is a per-glyph WAAPI engine and cannot cheaply animate a full snippet. Do not re-enable a per-line roll on multi-line tabs. `Content` in a tabbed block is register-only; the root paints the surface.

Three structural constraints keep the roll faithful, all verified against the live docs page. Break any of them and multi-line code visibly collapses or wraps:

- One Scritto instance per source line inside a plain `div`, never one instance for the whole snippet and never inside a `pre`. A multi-line value earns Scritto's `data-wrap` treatment and its newlines die inside nowrap word spans; and Svelte preserves template whitespace as text nodes inside `pre`, which renders as blank lines between rows.
- Rows are `block w-max min-w-full` so long lines scroll instead of wrapping. Scritto's shadow `:host` rules carry `!important` and beat every outside stylesheet and inline style, so wrapping cannot be fixed with a `whitespace-*` class or style — it has to be structural.
- Empty lines render as a block `&nbsp;` span, not an empty Scritto, so they keep their height.

## Response Stream is roll-only

`ResponseStream` has no `mode` prop: every stream rolls arrivals in through Scritto and eases its height open as lines wrap, in medium body text. `speed` (1–100) is the only pace control — it sets the roll duration and the static-string reveal rate; live chunks still render on arrival.

Stop doing the old patterns: do not pass `mode`, `fadeDuration`, or `segmentDelay`, and do not import `Mode` or `Segment` — all four are removed and old call sites fail typecheck. Do not reintroduce per-word blur spans; the `.sivir-response-stream-segment` styles and fade keyframes are gone. The Scritto roller loads client-side only with plain-text SSR fallback, and unit-test DOMs without Web Animations deterministically render plain text. `response-stream` manifest is now `2.0.0` with `@scritto/core` and `@scritto/svelte` peers — `sivir add response-stream` pulls them automatically.

## Menu lists cap with max-h, not h

Cap long Select, Combobox, and Dropdown Menu lists with `max-h-*` on the Content (e.g. `max-h-56`), not `h-*`. ScrollArea sizes its viewport with flex and inherits the menu cap through `max-h-[inherit]`, so short lists shrink to fit with no empty scroll space and long lists scroll with edge cues. The old `max-h-inherit` class never generated CSS and `size-full` on the viewport only resolved against an explicit height — both are gone, so stop adding `h-*` as a scrolling workaround.
