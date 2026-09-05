## File Diff

`FileDiff` renders a unified diff for one file. Prefer the high-level form: pass `file`, `lang`, and a `diff: FileDiffLine[]` array to `FileDiff.Root` and it renders the top bar and rows itself, deriving the `+n` / `−n` counts from the line types. Pass `additions` / `deletions` explicitly only to override the derived counts.

Stop doing per-file string concatenation for the top bar. The top bar contract is `file` plus counts; custom trailing controls go in `FileDiff.TopBar` children, which pin right. Removed lines carry only `oldLine`, added lines only `newLine`; the empty gutter cell is intentional, not a missing prop. Syntax highlighting runs synchronously per row during render (SSR-safe), so there is no client highlighting step to await and no need to split code into tokens yourself. Set `showLineNumbers={false}` on Root to hide both gutters; the sign column stays so changed rows keep a non-color cue.

## CodeBlock / FileDiff custom themes

`CodeBlock.Root` and `FileDiff.Root` accept `theme="sivir"` (default) or `theme="custom"`. The default paints `hljs-*` tokens from 9 `--code-block-token-*` / `--file-diff-token-*` variables (GitHub light/dark per mode): comment, keyword (+doctag), string, number, function (titles), property (+operators, selector ids/classes/attrs), builtin (built-ins, types, params, class titles), entity (tag/component names, selector pseudos — the green one), meta. Brackets, punctuation, and template substitutions intentionally stay plain, matching GitHub. Recolor by setting those variables on a wrapper or `:root` — not via the component `class`, which merges before the built-in token classes and loses. With `theme="custom"` the roots emit no token variables and the panels skip their token selectors, so a stock `highlight.js/styles/*` stylesheet loaded by the consumer paints instead — the Sivir frame and surface stay, and Sivir's own selectors outrank bare `hljs-*` rules, so `sivir`-themed blocks on the same page are unaffected. `theme` flows through the code-block registry / file-diff context, so compound `Content` / `Row` parts follow the Root with no per-part prop.

## Tag Input

`TagInput` turns typed text into removable tokens. The state contract is `bind:tags` on `TagInput.Root`; always render `TagInput.List` and `TagInput.Input` inside Root, since Root owns the draft and only Input can commit it. Do not manage the draft yourself unless you need it observed: `bind:query` mirrors the draft, and `normalize` (default trim) plus `validate` run on every candidate before it joins the list.

Stop blocking entry with custom key handlers. Enter always commits, single characters in `delimiters` (default comma) commit while typing, Backspace on an empty draft removes the last tag, Escape clears the draft, and multi-value pastes split on commas, semicolons, newlines, and the delimiters. Read edits through `onAdd` / `onRemove` for single tags or `onTagsChange` for the whole list; refused candidates report through `onReject` as `{ value, code, reason }` where code is `duplicate`, `invalid`, or `max-tags`. Duplicates are rejected unless `allowDuplicates` is set, and `max` caps the list. `validate` returns `true` to accept, `false` or an error string to reject. Pass `name` to render one hidden input per tag for native form submission.

## Popover Escape inside overlays

Floating menus register their Escape handler one rank above the enclosing overlay, so a Select, Combobox, or Dropdown Menu opened inside a Modal or Sheet peels first and the host stays open. Standalone menus are unaffected. Do not special-case Escape for menus in dialogs; the ordering is owned by the overlay stack.

## Traveling highlight on touch

`travelingHighlight` ignores touch pointers: on coarse-pointer devices the highlight follows keyboard focus only, never the finger. Do not re-add pointer tracking for touch; tap feedback comes from focus and press states.

## Theme chrome: per-surface shadows and highlight opt-out

`chrome` now carries `surfaceShadows`, `controlShadows`, and `dialogShadows` (default true; `shadows: false` still forces all off) plus `travelingHighlight: false`. Surface shadows own `--elevation-1` and `--elevation-float` (cards, selects, dropdowns, popovers, reorder rows); control shadows own `--elevation-control` and `--elevation-button-outline`; dialog shadows own `--elevation-modal`. The card inset surface composes `var(--elevation-1)` with its hairline, so turning surface shadows off leaves the hairline. `travelingHighlight: false` emits `--sivir-traveling-highlight: none`, which leaves `.sivir-item-highlight` visible and still positions it on the active item, but snaps with no slide. Do not hide the highlight or skip mounting the action when the flag is off.

Per-mode primary colors are authored through `tokens.light` / `tokens.dark` overriding `--color-primary` (plus `--color-primary-hover` and `--color-ring`, which do not re-derive from the token). `foundation.foreground` overrides `--color-foreground` per mode. `motion: "none"` now also zeroes `--motion-duration-panel-in/out`, `--motion-duration-modal-in/out`, `--motion-duration-press`, and `--motion-duration-item`, so JS transitions reading those variables (`getCssDuration`) settle instantly too.

## Theme foundation muted text

Theme schema version 4 removes `foundation.muted` and its `--color-muted` surface mapping. Use `foundation.foregroundMuted` to emit `--color-foreground-muted` for secondary text, icons, and placeholders. Do not derive muted text from a surface color or add `--color-muted` back to generated theme CSS.

Hover and open states now use `--color-secondary`, including `--color-field-hover` by default. Override `--color-field-hover` directly in `tokens` only when a field needs a distinct hover surface. Use `migrateThemeV3ToV4()` for saved v3 themes; it intentionally discards the removed `foundation.muted` value.

## Open preset

The new built-in `open` preset demonstrates the inverted-accent pattern: `brand: '#333333'` while `tokens.dark` overrides `--color-primary` / `--color-primary-hover` / `--color-ring` to `#e6e6e6`, with `foundation.dark.onPrimary: '#1a1a1a'`. The dark primary differing from `brand` is intentional — do not "fix" it by removing the `tokens.dark` block or the dark mode loses all contrast. Portable theme JSON cannot express per-mode brand any other way; `Theme.brand` is the light value.

Loading a preset in the Theme Studio resets the draft to the preset's `Theme` shape (`applyPreset` derives studio chrome flags from `chrome` and clears studio extensions), so studio edits of `open` start from the portable values and re-append the dark brand only if the user changes it. Any code listing built-in slugs (registry tests, docs) must include `open` alongside `default`, `magic`, and `bitsy`.
