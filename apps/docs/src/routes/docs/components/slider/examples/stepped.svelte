<script lang="ts">
import { Slider } from '@sivir-ui/svelte/components/slider';
</script>

<div class="w-full max-w-sm">
    <Slider value={50} step={10} min={0} max={100} label="By tens" />
</div>
