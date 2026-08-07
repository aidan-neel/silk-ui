<script lang="ts">
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
</script>

<Tooltip.Root delay={10} closeDelay={500}>
    <Tooltip.Trigger>
        <button type="button" data-testid="trigger-a">A</button>
    </Tooltip.Trigger>
    <Tooltip.Content><span>Alpha</span></Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root delay={10} closeDelay={500}>
    <Tooltip.Trigger>
        <button type="button" data-testid="trigger-b">B</button>
    </Tooltip.Trigger>
    <Tooltip.Content><span>Bravo</span></Tooltip.Content>
</Tooltip.Root>
