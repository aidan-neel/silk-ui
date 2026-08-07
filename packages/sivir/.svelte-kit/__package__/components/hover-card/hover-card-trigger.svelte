<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onDestroy, onMount } from 'svelte';
    import { getPopoverContext } from '../popover/context.svelte';
    import type { HoverCardTriggerProps } from '.';

    let { class: className, children, href, ...rest }: HoverCardTriggerProps = $props();

    const { state: popoverState } = getPopoverContext();
    let element = $state<HTMLElement>();

    function clearTimers() {
        if (popoverState.hoverTimeout) {
            clearTimeout(popoverState.hoverTimeout);
            popoverState.hoverTimeout = undefined;
        }
        if (popoverState.closeTimeout) {
            clearTimeout(popoverState.closeTimeout);
            popoverState.closeTimeout = undefined;
        }
    }

    function open() {
        clearTimers();
        const delay = popoverState.delay ?? 0;
        popoverState.hoverTimeout = setTimeout(() => {
            popoverState.open = true;
            popoverState.hovering = true;
        }, delay);
    }

    /**
     * Closes after a grace period. The 180ms default matches
     * `--motion-duration-panel` so the dismiss lines up with panel motion.
     */
    function close() {
        clearTimers();

        const closeDelay = popoverState.closeDelay ?? 180;
        popoverState.closeTimeout = setTimeout(() => {
            popoverState.open = false;
            popoverState.hovering = false;
        }, closeDelay);
    }

    onMount(() => {
        popoverState.buttonRef = element ?? null;
    });

    onDestroy(clearTimers);
</script>

{#if href}
    <a
        bind:this={element as HTMLAnchorElement}
        {href}
        onmouseenter={open}
        onmouseleave={close}
        onfocus={open}
        onblur={close}
        class={cn(
            className,
            'underline decoration-foreground-muted underline-offset-2 hover:decoration-foreground'
        )}
        {...rest}
    >
        {@render children?.()}
    </a>
{:else}
    <span
        bind:this={element}
        onmouseenter={open}
        onmouseleave={close}
        onfocus={open}
        onblur={close}
        role="button"
        tabindex="0"
        class={cn(className, 'inline-flex')}
        {...rest}
    >
        {@render children?.()}
    </span>
{/if}
