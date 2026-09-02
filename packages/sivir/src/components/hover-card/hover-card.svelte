<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { setContext } from 'svelte';
    import type { Placement } from '../popover';
    import type { HoverCardProps } from '.';

    let {
        open = $bindable(false),
        openDelay = 200,
        closeDelay = 150,
        children
    }: HoverCardProps = $props();

    let placement = $state<Placement>('bottom');

    setContext('sivir-hover-card', {
        setPlacement(next: Placement) {
            placement = next;
        }
    });
</script>

<Popover.Root bind:open hoverable delay={openDelay} {closeDelay} {placement}>
    {@render children?.()}
</Popover.Root>
