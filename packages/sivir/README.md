# @sivir-ui/svelte

SvelteKit component library inspired by shadcn/ui. **Svelte 5 + Tailwind v4.**

This package is the importable library: `bun add @sivir-ui/svelte` and import components
directly. (If you'd rather own the source in your own repo, shadcn-style, use the
`sivir` CLI's `add` command instead. This package is the "install it" path.)

## Requirements

- **Svelte 5** and **Tailwind v4** (peer dependencies). The easiest base is a
  SvelteKit app with Tailwind already set up:
    ```sh
    bunx sv create my-app          # pick Skeleton + TypeScript
    cd my-app && bunx sv add tailwindcss
    ```

## Install

```sh
bun add @sivir-ui/svelte
# or: npm i @sivir-ui/svelte / pnpm add @sivir-ui/svelte
```

Runtime dependencies (`@floating-ui/dom`, `@lucide/svelte`, `cnfast`,
`tailwind-variants`, …) install automatically.

## Wire up the styles

Sivir ships its Tailwind theme and design tokens in one stylesheet. In your app's
CSS (e.g. `src/app.css`), import it as the single entry point:

```css
@import '@sivir-ui/svelte/ui.css';
```

`ui.css` already pulls in Tailwind itself and registers Sivir's own components as a
Tailwind source. Do not add a separate `@import 'tailwindcss';`. This one line
covers Tailwind, the Sivir theme variables, and class scanning for every Sivir
component. Tailwind v4 auto-detects your own files, so your app classes keep
working too.

Make sure that CSS file is imported once at the root (a fresh
`sv add tailwindcss` already imports `app.css` in `src/routes/+layout.svelte`).

## Fonts

Sivir's default theme sets `--font-sans` to Inter and `--font-mono` to
JetBrains Mono. Both faces ship with the package through `@fontsource/inter`
and `@fontsource/jetbrains-mono`, which `ui.css` imports as self-hosted
`latin-400/500/600/700` stylesheets. Your bundler serves the `woff2` files
locally, so screens render the intended typefaces with no Google Fonts request
and no network access at runtime — including containerized deployments.

Do not add a remote font link to match older screenshots. To use a different
face, override `--font-sans`, `--font-mono`, or `--font-header` in your own CSS
and bring that font yourself; non-default Theme Studio presets already work
this way.

## Use it

Single-element components are named exports:

```svelte
<script>
    import { Button, Input, Switch } from '@sivir-ui/svelte';
</script>

<Button>Get started</Button>
<Input placeholder="Email" />
<Switch />
```

Compound components are namespace exports; their parts hang off the namespace:

```svelte
<script>
    import { AlertDialog, Tabs } from '@sivir-ui/svelte';
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Title>Are you sure?</AlertDialog.Title>
        <AlertDialog.Description>This can't be undone.</AlertDialog.Description>
        <AlertDialog.Footer>
            <AlertDialog.Exit>Cancel</AlertDialog.Exit>
            <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<Tabs.Root value="one">
    <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="one">First panel</Tabs.Content>
    <Tabs.Content value="two">Second panel</Tabs.Content>
</Tabs.Root>
```

Every component is also reachable directly if you prefer narrower imports:

```svelte
import {Button} from '@sivir-ui/svelte/components/button'; import * as AlertDialog from '@sivir-ui/svelte/components/alert-dialog';
```

## What's exported

- **Named:** `Badge`, `Button`, `Checkbox`, `CodeBlock`,
  `CopyButton`, `Input`, `Label`, `Markdown`, `Pagination`, `Progress`, `Reasoning`,
  `ReorderList`, `ResponseStream`, `ScrollArea`, `Shortcut`, `Skeleton`, `SkeletonSwap`,
  `Slider`, `Spinner`, `Switch`, `TaskSteps`, `Textarea`, `Toggle`, `Toolbar`, and the toast API (`Toast`, `Toaster`,
  `toast`, `getToastUIState`).
- **Namespaced:** `Accordion`, `Alert`, `AlertDialog`, `Attachment`, `Avatar`,
  `Breadcrumb`, `Card` (includes `variant="panel"`), `Collapsible`, `ColorPicker`,
  `Combobox`, `Command`, `ContextMenu`, `Conversation`, `DropdownMenu`,
  `FullscreenNav`, `HoverCard`, `Message`, `Modal`, `Popover`, `Composer`,
  `RadioGroup`, `Select`, `Sheet`, `Tabs`, `ToggleGroup`, `Tool`, `Tooltip`.

## License

[MIT](../../LICENSE) © Aidan Neel.
