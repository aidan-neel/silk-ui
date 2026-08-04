<script lang="ts">
import { Gauge } from '@sivir-ui/svelte/components/gauge';
</script>

<div class="flex items-center gap-3">
    <Gauge value={72} label="Monthly API usage" tone="warning" size={40}>72%</Gauge>
    <div class="text-sm">
        <div class="font-medium text-foreground">Monthly API usage</div>
        <div class="text-foreground-muted">72,000 of 100,000 requests</div>
    </div>
</div>
