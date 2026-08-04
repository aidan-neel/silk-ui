<script lang="ts">
import { getContext, onMount, type Snippet } from 'svelte';

let { children }: { children?: Snippet } = $props();

const tip = getContext('sivir-tooltip') as { text: string };

/**
 * The shared bubble renders the label itself, so this only hosts the authored
 * content off-screen and reports its text up to the context. A
 * MutationObserver keeps dynamic labels (Copy to Copied) current.
 */
let el = $state<HTMLElement>();

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

<span bind:this={el} aria-hidden="true" class="sr-only">
    {@render children?.()}
</span>
