<script lang="ts">
import { Slider } from '@sivir-ui/svelte/components/slider';

let volume = $state(64);
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
    <div class="flex items-center justify-between text-[0.78rem]">
        <span class="text-foreground-muted">Volume</span>
        <span class="font-mono text-foreground">{volume}</span>
    </div>
    <Slider bind:value={volume} label="Volume" />
</div>
