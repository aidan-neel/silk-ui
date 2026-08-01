<script lang="ts">
    import Menu from '@lucide/svelte/icons/menu';
    import { Button } from '@sivir-ui/svelte/components/button';
    import type { FullscreenNavTriggerProps } from '.';
    import { getFullscreenNavContext } from './context.svelte';

    let {
        class: className,
        children,
        element = $bindable(),
        onclick: userOnclick,
        ...rest
    }: FullscreenNavTriggerProps = $props();

    const { id, state } = getFullscreenNavContext();
</script>

<Button
    bind:element
    variant="ghost"
    size="icon"
    aria-label={state.open ? 'Close navigation menu' : 'Open navigation menu'}
    aria-haspopup="dialog"
    aria-expanded={state.open}
    aria-controls={`fullscreen-nav-${id}`}
    onclick={(event: MouseEvent) => {
        state.triggerRef = element;
        state.open = !state.open;
        userOnclick?.(event);
    }}
    class={className}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        <Menu aria-hidden="true" />
    {/if}
</Button>
