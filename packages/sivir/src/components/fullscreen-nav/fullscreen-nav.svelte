<script lang="ts">
    import type { FullscreenNavProps, FullscreenNavState } from '.';
    import { setFullscreenNavContext } from './context.svelte';

    let { open = $bindable(false), children }: FullscreenNavProps = $props();

    const id = $props.id();
    const navState = $state<FullscreenNavState>({
        open,
        animationIndex: 0,
        triggerRef: null
    });
    let syncedOpen = $state(open);

    setFullscreenNavContext({ id, state: navState });

    $effect(() => {
        if (open !== syncedOpen) {
            syncedOpen = open;
            navState.open = open;
        }
    });

    $effect(() => {
        if (navState.open !== syncedOpen) {
            syncedOpen = navState.open;
            open = navState.open;
        }
    });

    $effect(() => {
        if (!navState.open) navState.animationIndex = 0;
    });
</script>

{@render children?.()}
