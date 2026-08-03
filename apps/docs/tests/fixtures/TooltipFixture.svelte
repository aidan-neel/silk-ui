<script lang="ts">
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';

    let {
        delay,
        closeDelay,
        placement = 'top' as 'top' | 'bottom' | 'left' | 'right'
    }: {
        delay?: number;
        closeDelay?: number;
        placement?: 'top' | 'bottom' | 'left' | 'right';
    } = $props();
</script>

<Tooltip.Root {delay} {closeDelay} {placement}>
    <Tooltip.Trigger>
        <button data-testid="tooltip-trigger">Hover me</button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        <span data-testid="tooltip-body">Tooltip content</span>
    </Tooltip.Content>
</Tooltip.Root>
