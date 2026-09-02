<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext, onDestroy } from 'svelte';
    import type { TooltipState, TooltipTriggerProps } from '.';
    import {
        flashTooltip,
        hideTooltip,
        isActiveTooltip,
        showTooltip,
        updateTooltipClass,
        updateTooltipText
    } from './shared-tooltip';

    let { children, class: className, showOnClick = false }: TooltipTriggerProps = $props();

    const tip = getContext('sivir-tooltip') as TooltipState;

    let el = $state<HTMLElement>();

    function open() {
        if (el) {
            showTooltip(el, tip.text, tip.placement, tip.delay, tip.className);
        }
    }
    function close() {
        hideTooltip(el ?? null, tip.closeDelay);
    }
    function clickOpen() {
        if (showOnClick && el) {
            flashTooltip(el, tip.text, tip.placement, 1500, tip.className);
        }
    }

    $effect(() => {
        const text = tip.text;
        if (el && isActiveTooltip(el)) {
            updateTooltipText(el, text);
        }
    });

    $effect(() => {
        const bubbleClass = tip.className;
        if (el && isActiveTooltip(el)) {
            updateTooltipClass(el, bubbleClass);
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
