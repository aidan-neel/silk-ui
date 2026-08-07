<script lang="ts">
    import type { ColorOption } from '@sivir-ui/svelte/components/color-picker';
    import ColorPicker from '$lib/components/color-picker.svelte';

    type Props = {
        value: string;
        label: string;
        onValueChange?: (value: string) => void;
        swatches?: ColorOption[];
        class?: string;
    };

    let { value, label, onValueChange, swatches, class: className }: Props = $props();
</script>

<ColorPicker {value} {label} {onValueChange} options={swatches} class={className} />
