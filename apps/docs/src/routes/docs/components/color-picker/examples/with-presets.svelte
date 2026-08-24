<script lang="ts">
    import type { ColorOption } from '@sivir-ui/svelte/components/color-picker';
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';

    let valueWithOptions = $state('#0284c7');

    const presetSwatches: ColorOption[] = [
        { label: 'Blue', value: '#2563eb' },
        { label: 'Indigo', value: '#4f46e5' },
        { label: 'Violet', value: '#7c3aed' },
        { label: 'Pink', value: '#db2777' },
        { label: 'Rose', value: '#e11d48' }
    ];
</script>

<div class="flex items-center justify-center">
    <ColorPicker.Root
        value={valueWithOptions}
        onValueChange={(v) => (valueWithOptions = v)}
        options={presetSwatches}
        label="Choose"
    >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
    </ColorPicker.Root>
</div>
