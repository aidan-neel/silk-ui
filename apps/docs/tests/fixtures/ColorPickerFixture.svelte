<script lang="ts">
    import type { ColorFormat } from '@sivir-ui/svelte/components/color-picker';
    import ColorPicker from '$lib/components/color-picker.svelte';

    let {
        value = $bindable('#ff0000'),
        label = 'Color',
        format = 'hsl',
        onValueChange = (v: string) => {
            value = v;
        }
    }: {
        value?: string;
        label?: string;
        format?: ColorFormat;
        onValueChange?: (value: string) => void;
    } = $props();

    const options = [
        { label: 'Red', value: '#ff0000' },
        { label: 'Green', value: '#00ff00' },
        { label: 'Blue', value: '#0000ff' }
    ];
</script>

<div style="padding: 40px;">
    <ColorPicker {value} {label} {onValueChange} {options} {format} />
</div>
