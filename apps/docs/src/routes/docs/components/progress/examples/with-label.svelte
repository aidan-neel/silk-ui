<script lang="ts">
import { Progress } from '@sivir-ui/svelte/components/progress';
</script>

<div class="w-full max-w-md flex flex-col gap-2">
    <div class="flex items-center justify-between text-sm text-foreground-muted">
        <span>Uploading…</span>
        <span>72%</span>
    </div>
    <Progress value={72} />
</div>
