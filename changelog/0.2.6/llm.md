## Inset frame (Modal, Alert Dialog, Code Block)

Do not rebuild these as a flat bordered card. They share one concentric inset recipe:

- Outer chrome: `sivir-modal-frame` (Modal, Alert Dialog) or `sivir-inset-frame` (Code Block). Padding and gap are `--sivir-modal-inset` (`var(--spacing)`). Radius is `--radius-xl`. Fill is `--color-secondary` (Code Block uses `--color-muted` in dark).
- Inner well: `[data-ui=modal-surface]` or `sivir-inset-surface`. It has a real border. Inner radius is `outer radius − border − inset`. Fill is `--color-card`.
- Chrome actions live *outside* the inner well: Modal/Alert Dialog footer in the frame; Code Block tabs and copy actions in the header row.

When composing or restyling related surfaces, copy this geometry. Do not put footer buttons or language tabs inside the inner card, and do not use the tighter `sivir-card-frame` recipe for these components.

Modal dark mode inverts the chrome/well contrast so the inner well is darker than the frame (`sivir-modal-frame` dark fill is `--color-card`). Code Block does not use that invert.

## Overlay lock (Popover, Modal, Sheet, Alert Dialog, Command, Fullscreen Nav)

Open overlays now inert the page, trap focus, and lock nested overflow containers, not only `document.body`. Nested overlays must restore the previous inert/lock state on close.

- Popover defaults to `inert={true}` for non-hover open. Pass `inert={false}` only when outside page content must stay interactive.
- Do not add a second focus trap, `inert` tree, or `overflow: hidden` on `body` around these components.
- Keep the trigger and nested floating layers interactive while unrelated branches are inert.

## Select, Combobox, and Dropdown Menu scrolling

Long option lists scroll *inside* `ScrollArea`, which honors a parent `max-height`. Edge-blur cues appear when content overflows.

- Cap height on the menu/panel, not on `body`.
- Do not replace the menu list with a plain overflowing `div`.
- Placeholders stay `text-foreground-muted`; a selected value always renders in `text-foreground`.

## Default font

The default Sivir and generated-app sans font is DM Sans, not Inter. Override `--font-sans` in application CSS if the host product requires a different face. Do not add a second font import "to match older docs screenshots."

## Segmented Tabs radii

The active pill and trigger radius is `var(--radius-xl) − 3px` (the track inset). Do not hard-code a `--radius-lg` pill inside a `--radius-xl` track.
