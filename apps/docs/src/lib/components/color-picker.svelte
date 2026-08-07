<script lang="ts">
    // Thin wrapper that preserves the old single-component ColorPicker API for
    // the docs app's internal call sites (studio sidebars, fixtures). The
    // published component is the compound ColorPicker.Root/.Trigger/.Content.

    import type { ColorFormat, ColorOption } from '@sivir-ui/svelte/components/color-picker';
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';

    type Props = {
        label?: string;
        value: string;
        onValueChange?: (value: string) => void;
        options?: ColorOption[];
        format?: ColorFormat;
        variant?: 'outline' | 'secondary' | 'ghost';
        class?: string;
    };

    let {
        label,
        value,
        onValueChange,
        options = [],
        format = 'hsl',
        variant = 'outline',
        class: className
    }: Props = $props();
</script>

<ColorPicker.Root {label} {value} {onValueChange} {options} {format} class={className}>
    <ColorPicker.Trigger {variant} />
    <ColorPicker.Content />
</ColorPicker.Root>
