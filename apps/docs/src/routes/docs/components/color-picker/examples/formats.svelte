<script lang="ts">
import * as ColorPicker from '@sivir-ui/svelte/components/color-picker';

let hslValue = $state('#5e6ad2');
let rgbValue = $state('#5e6ad2');
let hsvValue = $state('#5e6ad2');
</script>

<div class="flex flex-wrap items-center justify-center gap-4">
    <ColorPicker.Root
        value={hslValue}
        onValueChange={(v) => (hslValue = v)}
        format="hsl"
        label="HSL"
    >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
    </ColorPicker.Root>
    <ColorPicker.Root
        value={rgbValue}
        onValueChange={(v) => (rgbValue = v)}
        format="rgb"
        label="RGB"
    >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
    </ColorPicker.Root>
    <ColorPicker.Root
        value={hsvValue}
        onValueChange={(v) => (hsvValue = v)}
        format="hsv"
        label="HSV"
    >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
    </ColorPicker.Root>
</div>
