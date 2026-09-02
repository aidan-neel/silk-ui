<script lang="ts">
    import { setContext, untrack } from 'svelte';
    import type { TooltipProps, TooltipState } from '.';

    let { children, delay = 125, closeDelay = 100, placement = 'top' }: TooltipProps = $props();

    const tip = $state<TooltipState>(
        untrack(() => ({
            text: '',
            placement,
            delay,
            closeDelay,
            className: ''
        }))
    );

    $effect(() => {
        tip.placement = placement;
        tip.delay = delay;
        tip.closeDelay = closeDelay;
    });

    setContext('sivir-tooltip', tip);
</script>

{@render children?.()}
