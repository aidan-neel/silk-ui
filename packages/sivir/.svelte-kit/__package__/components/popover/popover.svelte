<script lang="ts">
    import { onDestroy, onMount, untrack } from 'svelte';
    import type { PopoverProps, PopoverState } from '.';
    import { setPopoverContext } from './context.svelte';

    let {
        open = $bindable(false),
        onOpenChange,
        placement = 'bottom',
        children,
        state_key,
        stateKey,
        hoverable,
        delay = 0,
        closeDelay = 150,
        inert = true
    }: PopoverProps = $props();

    const generatedKey = $props.id();
    const initial = untrack(() => {
        return {
            key: stateKey ?? state_key ?? generatedKey,
            placement,
            hoverable: hoverable ?? false,
            delay,
            closeDelay,
            inert
        };
    });
    const popoverState = $state<PopoverState>({
        open,
        trigger: null,
        focusedElement: null,
        buttonRef: null,
        popoverRef: undefined,
        placement: initial.placement,
        onclick: undefined,
        closeTimeout: undefined,
        hoverable: initial.hoverable,
        delay: initial.delay,
        closeDelay: initial.closeDelay,
        inert: initial.inert
    });
    const key = initial.key;
    let syncedOpen = $state(open);

    setPopoverContext({ id: key, state: popoverState });

    onMount(() => {
        popoverState.placement = placement;
        popoverState.hoverable = hoverable ?? false;
        popoverState.delay = delay;
        popoverState.closeDelay = closeDelay;
        popoverState.inert = inert;
    });

    $effect(() => {
        popoverState.placement = placement;
    });

    $effect(() => {
        popoverState.hoverable = hoverable ?? false;
        popoverState.delay = delay;
        popoverState.closeDelay = closeDelay;
        popoverState.inert = inert;
        if (open !== syncedOpen) {
            syncedOpen = open;
            popoverState.open = open;
        }
    });

    $effect(() => {
        if (popoverState.open !== syncedOpen) {
            syncedOpen = popoverState.open;
            open = popoverState.open;
            onOpenChange?.(popoverState.open);
        }
    });

    onDestroy(() => {
        if (popoverState.closeTimeout) {
            clearTimeout(popoverState.closeTimeout);
        }
        if (popoverState.hoverTimeout) {
            clearTimeout(popoverState.hoverTimeout);
        }
    });
</script>

{@render children?.()}
