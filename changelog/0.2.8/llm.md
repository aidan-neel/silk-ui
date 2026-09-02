## Token contract

`--spacing` follows `--sivir-space-unit`. Tailwind spacing utilities (`p-2`, `gap-3`, `h-8`, `size-4`) track density. Do not write `var(--sivir-space-*)` in components.

`--text-xs`, `--text-sm`, `--text-base`, `--text-xl`, and `--text-3xl` follow the role font-size tokens. Prefer `[font-size:var(--font-size-label)]` (or `text-label`) over a second scale class on the same node. Drop `var(--token, fallback)` literals — the fallbacks were wrong.

`font-header` is the header **family**. Weight 600 is `[font-weight:var(--font-weight-header)]`. `font-label` is weight 500.

### New public tokens

- `--size-hairline` (2px): control chrome, concentric radius, tab/toast hairlines. `--motion-press-px` references it.
- `--size-touch` (2.75rem / 44px): pointer-target minimum. Use `min-h-[var(--size-touch)]` / `size-[var(--size-touch)]`, not `min-h-11`.
- `--overlay-gutter` (2rem): modal/command viewport inset. Not the sheet’s 8px inset.
- `--overlay-blur` / `--overlay-brightness`: overlay scrim. Use `.sivir-overlay-scrim`.
- `--opacity-disabled` (0.4): every disabled control and label.
- `--font-size-title` (20px), `--font-size-display` (30px), `--font-size-meta` (10.5px).
- `--leading-body` (1.5), `--leading-label` (1.3), plus themed `--leading-none/tight/snug/relaxed`.
- `--color-success-soft` / `--color-warning-soft` / `--color-error-soft` / `--color-info-soft`: the 12% status wash. Use `bg-error-soft`, not a local `color-mix`.

### Shared classes

`.sivir-menu-label`, `.sivir-menu-separator`, `.sivir-error-notice`, `.sivir-overlay-scrim`. Do not restyle those recipes per component.

Keep `rounded-full`, measured overlay geometry, SVG path data, color-picker spectrum values, and iOS `font-size: 16px` as exceptions.

## Chrome tokens

`--color-primary-stroke` is transparent by default. Primary buttons paint it as an inset hairline (`inset 0 0 0 var(--border-size)`). Set it to a dark mix in light mode and a light mix in `.dark`; do not add a separate border on `variant="primary"`.

`--ui-cursor-interactive` is `default`. Set it to `pointer` to use the hand on buttons, tabs, and other interactive chrome. Do not hard-code `cursor-pointer` on those controls.

To flatten lift, set `--elevation-1`, `--elevation-float`, and `--elevation-modal` to `none`, and reduce `--elevation-control` and `--elevation-button-outline` to `inset 0 0 0 1px var(--color-border)` so inset strokes survive. Leave `--focus-ring` alone.

## Nested overlay focus

`trapFocus` must not steal focus from a portaled `[data-floating-content]` or sibling `[data-overlay-root]`. Color Picker, Select, Combobox, and Dropdown Menu portal to `body`, so a Modal trap that yanks `focusin` back into the dialog makes those layers unusable. Leave nested layer Tab cycling to that layer's own trap. Do not set `inert={false}` on Color Picker to paper over this.
