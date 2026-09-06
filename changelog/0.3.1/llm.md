## Traveling highlight off

`chrome.travelingHighlight: false` still mounts `.sivir-item-highlight` and positions it on the active item. It only disables the slide: the fill snaps instead of interpolating. Do not hide the highlight or skip the `travelingHighlight` action when the flag is off. The emitted token remains `--sivir-traveling-highlight: none`.

## PromptComposer is now Composer

Every `PromptComposer` export is renamed to `Composer`: the `Root`, `Input`, `Toolbar`, `Actions`, and `Submit` namespaces, all `Composer*Props` / `ComposerStatus` / `ComposerSubmitAction` / `ComposerSubmitState` types, the `getComposerContext` / `setComposerContext` helpers, the `composer` context key, and the `data-ui="composer*"` attributes. The install name and docs route are `composer`. Stop importing `@sivir-ui/svelte/components/prompt-composer`; the old path and names are gone, not aliased.

`Submit` no longer renders an icon-only button by default. Without `children` it renders a text button: `Send` with an Enter `Shortcut` hint, `Stop` while stopping, and a spinner while pending. Pass explicit `children` (or a sizing class) for an icon-only submit. `label` now defaults to `Send`, and the input and toolbar ship the taller, roomier metrics the old docs examples used to override by hand, so drop any `!min-h-*`, toolbar spacing, and submit-shape overrides copied from those examples.

## Dropdown/Select dynamic content width

`Content` and `SubContent` (dropdown) and `Content` (select) accept `dynamic`: when true, the panel pins its width to the widest visible `[data-collection-item]` plus 16px, re-measuring on mount, DOM changes, and item resizes. Hidden items are ignored. The panel CSS `min-width` (trigger width) and viewport `max-width` still win over the pinned width, so menus never shrink under their trigger or overflow the viewport. Prefer `dynamic` over a fixed `w-*` class when menu items vary; keep fixed trigger widths so the trigger itself never shifts with the selection.
