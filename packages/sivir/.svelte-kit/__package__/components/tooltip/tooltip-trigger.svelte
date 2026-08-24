<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext, onDestroy, type Snippet } from 'svelte';
    import {
        flashTooltip,
        hideTooltip,
        isActiveTooltip,
        showTooltip,
        updateTooltipText
    } from './shared-tooltip';

    type Placement = 'top' | 'left' | 'bottom' | 'right';

    let {
        children,
        class: className,
        showOnClick = false
    }: {
        children?: Snippet;
        class?: string;
        /** Also reveal the tooltip on click (e.g. Copy buttons fired by touch/keyboard). */
        showOnClick?: boolean;
    } = $props();

    const tip = getContext('sivir-tooltip') as {
        text: string;
        placement: Placement;
        delay: number;
        closeDelay: number;
    };

    let el = $state<HTMLElement>();

    function open() {
        if (el) {
            showTooltip(el, tip.text, tip.placement, tip.delay);
        }
    }
    function close() {
        hideTooltip(el ?? null, tip.closeDelay);
    }
    function clickOpen() {
        if (showOnClick && el) {
            flashTooltip(el, tip.text, tip.placement);
        }
    }

    /**
     * Keeps the bubble's label in sync while this trigger owns it, so a label
     * that changes mid-hover (Copy to Copied) morphs in place instead of going
     * stale.
     */
    $effect(() => {
        const text = tip.text;
        if (el && isActiveTooltip(el)) {
            updateTooltipText(el, text);
        }
    });

    onDestroy(() => hideTooltip(el ?? null, 0));
</script>

<span
    bind:this={el}
    role="presentation"
    onmouseenter={open}
    onmouseleave={close}
    onfocusin={open}
    onfocusout={close}
    onclick={clickOpen}
    class={cn(className, 'inline-flex')}
>
    {@render children?.()}
</span>
