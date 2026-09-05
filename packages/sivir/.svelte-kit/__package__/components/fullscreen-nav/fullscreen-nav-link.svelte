<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
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

    function pulse() {
        if (typeof navigator === 'undefined') {
            return;
        }
        navigator.vibrate?.(10);
    }
</script>

<a
    data-ui="fullscreen-nav-link"
    use:pressable
    class={cn(
        className,
        'sivir-press -mx-2 flex min-h-[var(--size-control-lg)] items-center rounded-[var(--radius-lg)] px-3 [font-size:var(--font-size-header)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] text-foreground no-underline transition-[background-color,color,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] touch-manipulation hover:bg-secondary focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none'
    )}
    style={`--fullscreen-nav-link-delay:${animationDelay}ms;${styleName ?? ''}`}
    onpointerdown={pulse}
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
