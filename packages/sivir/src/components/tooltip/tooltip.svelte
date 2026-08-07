<script lang="ts">
    import { type Snippet, setContext, untrack } from 'svelte';

    type Placement = 'top' | 'left' | 'bottom' | 'right';

    let {
        children,
        delay = 125,
        closeDelay = 100,
        placement = 'top'
    }: {
        children?: Snippet;
        delay?: number;
        closeDelay?: number;
        placement?: Placement;
    } = $props();

    /**
     * Shared config plus the live label, read by Trigger and written by Content.
     * Reactive, so a changing label morphs the active bubble in place.
     */
    const tip = $state<{ text: string; placement: Placement; delay: number; closeDelay: number }>(
        untrack(() => ({ text: '', placement, delay, closeDelay }))
    );

    $effect(() => {
        tip.placement = placement;
        tip.delay = delay;
        tip.closeDelay = closeDelay;
    });

    setContext('sivir-tooltip', tip);
</script>

{@render children?.()}
