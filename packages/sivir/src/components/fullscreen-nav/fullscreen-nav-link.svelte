<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { FullscreenNavLinkProps } from '.';
import { getFullscreenNavContext } from './context.svelte';

let {
    class: className,
    children,
    onclick: userOnclick,
    style: styleName,
    ...rest
}: FullscreenNavLinkProps = $props();
const { state } = getFullscreenNavContext();
const animationDelay = Math.min(50 + state.animationIndex * 35, 330);
state.animationIndex += 1;
</script>

<a
    data-ui="fullscreen-nav-link"
    class={cn(
        className,
        '-mx-2 rounded-[var(--radius-md)] px-2 py-1.5 text-[length:var(--text-xl)] font-medium tracking-tight transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]'
    )}
    style={`--fullscreen-nav-link-delay:${animationDelay}ms;${styleName ?? ''}`}
    onclick={(event) => {
        userOnclick?.(event);
        if (!event.defaultPrevented) {
            state.open = false;
        }
    }}
    {...rest}
>
    {@render children?.()}
</a>
