<script lang="ts">
import { Progress } from '@sivir-ui/svelte/components/progress';
import { onMount } from 'svelte';

let val = $state(28);

onMount(() => {
    const id = setInterval(() => {
        val = (val + 4) % 100;
    }, 600);
    return () => clearInterval(id);
});
</script>

<div class="flex flex-col gap-4 w-full max-w-md">
    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between text-[0.78rem] text-foreground-muted">
            <span>Uploading…</span>
            <span>{val}%</span>
        </div>
        <Progress value={val} />
    </div>
    <div class="flex flex-col gap-2">
        <span class="text-[0.78rem] text-foreground-muted">Indeterminate</span>
        <Progress indeterminate />
    </div>
</div>
