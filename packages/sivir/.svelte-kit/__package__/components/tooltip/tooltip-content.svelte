<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import type { TooltipContentProps, TooltipState } from '.';

    let { children, class: className }: TooltipContentProps = $props();

    const tip = getContext('sivir-tooltip') as TooltipState;

    let el = $state<HTMLElement>();

    $effect(() => {
        tip.className = className ?? '';
    });

    onMount(() => {
        if (!el) {
            return;
        }
        const sync = () => {
            tip.text = (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
        };
        sync();
        const mo = new MutationObserver(sync);
        mo.observe(el, { childList: true, characterData: true, subtree: true });
        return () => mo.disconnect();
    });
</script>

<span bind:this={el} aria-hidden="true" class="sr-only"> {@render children?.()} </span>
