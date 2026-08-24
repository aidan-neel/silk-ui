<script lang="ts">
    import Bold from '@lucide/svelte/icons/bold';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
</script>

<div class="flex gap-2">
    <Toggle size="sm">
        <Bold size={12} />
    </Toggle>
    <Toggle>
        <Bold size={14} />
    </Toggle>
    <Toggle size="lg">
        <Bold size={16} />
    </Toggle>
</div>
