## Modal dark frame

In dark mode, `sivir-modal-frame` keeps its inset padding and inner well border, but the outer chrome stroke is transparent. Do not add a dark-mode frame border back on Modal or Alert Dialog. Code Block `sivir-inset-frame` still draws its outer border.

## Consumer control props

Keep existing names. Add the new bindable and callback props; do not rename Modal, callback, or Confirm/Exit.

- Prefer `bind:value` / `bind:open` / `bind:checked` plus `onValueChange` / `onOpenChange` / `onCheckedChange` on the same root. Fire the callback only when internal state changes, not when the parent writes the bindable.
- Combobox is a value control: `bind:value` and `onValueChange` on `Combobox.Root`. Do not read selection from context.
- ColorPicker `value` is `$bindable`. Keep `onValueChange`. Assign the hex on apply, then call the callback.
- Switch accepts `bind:checked`. Keep `bind:switched`. Write only the prop the caller actually passed.
- Toggle `variant="outline"` maps to the existing `outlined` style.
- Popover `stateKey` is the camelCase alias of `state_key`. Resolve with `stateKey ?? state_key`.
- Command.Item search key is `value ?? name`. Keep `name` working.

## Input, Textarea, Tooltip, types

- Input and Textarea wrap in `<label>` only when `label` is set. Description-only uses a `div`. Neither prop: render the control with no wrapper so it can sit inside a custom field.
- Tooltip.Content `class` applies to the shared `.sivir-tooltip` bubble for the active trigger, not the sr-only text host.
- Import prop types from `@sivir-ui/svelte` (`ButtonProps`, `InputProps`, `ComboboxRootProps`, …). Do not invent parallel prop types. Compound parts remain on the namespace as well (`Accordion.AccordionProps`).

## Select and Combobox max-height

Cap long menus with `max-h-*` on `Select.Content` / `Combobox.Content`. That class is applied to the menu ScrollArea, so `max-h-64` scrolls without an explicit `h-*`. Keep using `h-56` when you want a fixed menu height.
