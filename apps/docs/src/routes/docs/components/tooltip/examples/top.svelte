<script lang="ts">
    import Info from '@lucide/svelte/icons/info';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
</script>

<Tooltip.Root placement="top">
    <Tooltip.Trigger>
        <Button variant="outline">
            <Info size={14} />
            Top
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>Appears above the trigger</Tooltip.Content>
</Tooltip.Root>
