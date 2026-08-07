<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';

    let {
        open = $bindable(false),
        placement = 'bottom' as 'top' | 'bottom' | 'left' | 'right',
        hoverable = false,
        delay = 0,
        closeDelay = 150
    } = $props();
</script>

<Popover.Root bind:open {placement} {hoverable} {delay} {closeDelay}>
    <Popover.Trigger>
        <span data-testid="popover-trigger-label">Open popover</span>
    </Popover.Trigger>
    <Popover.Content>
        <Popover.Title>Popover Title</Popover.Title>
        <p data-testid="popover-body">Popover body content</p>
        <button type="button" data-testid="inside-popover">Inside button</button>
    </Popover.Content>
</Popover.Root>
