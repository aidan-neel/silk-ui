<script lang="ts">
    import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';

    let value = $state('#5e6ad2');
</script>

<div class="flex items-center justify-center">
    <ColorPicker.Root {value} onValueChange={(v) => (value = v)} label="Pick a color">
        <ColorPicker.Trigger />
        <ColorPicker.Content />
    </ColorPicker.Root>
</div>
