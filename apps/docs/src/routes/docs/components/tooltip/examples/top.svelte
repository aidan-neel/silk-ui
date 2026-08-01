<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import Info from '@lucide/svelte/icons/info';
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
