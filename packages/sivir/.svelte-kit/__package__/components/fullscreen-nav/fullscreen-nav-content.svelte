<script lang="ts">
    import { useOverlay } from '@sivir-ui/svelte/components/_internal/overlay';
    import { overlayIn, overlayOut } from '@sivir-ui/svelte/transition';
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { FullscreenNavContentProps } from '.';
    import { getFullscreenNavContext } from './context.svelte';

    let {
        class: className,
        label = 'Navigation menu',
        children,
        ...rest
    }: FullscreenNavContentProps = $props();

    const { id, state: navState } = getFullscreenNavContext();
    let element = $state<HTMLElement>();
    let portalEl = $state<HTMLDivElement>();

    $effect(() => {
        if (!portalEl || typeof document === 'undefined') {
            return;
        }
        document.body.appendChild(portalEl);
        return () => portalEl?.remove();
    });

    useOverlay({
        isOpen: () => navState.open,
        panelEl: () => element,
        onClose: () => {
            navState.open = false;
        },
        returnFocus: () => navState.triggerRef ?? undefined
    });
</script>

<!-- Keep the host in body before opening so Safari never starts a transition in one tree then reparents it. -->
<div
    bind:this={portalEl}
    use:visualViewportBounds
    data-overlay-root
    data-ui="fullscreen-nav-portal"
>
    {#if navState.open}
        <div
            class="fixed inset-x-0 top-[var(--sivir-viewport-top)] z-40 h-[var(--sivir-viewport-height)]"
        >
            <nav
                bind:this={element}
                in:overlayIn
                out:overlayOut
                id={`fullscreen-nav-${id}`}
                data-ui="fullscreen-nav-content"
                class={cn(
                    className,
                    // token-lint-disable-next-line no-literal-length: safe-area-aware full-screen inset
                    'fixed inset-x-0 top-[var(--sivir-viewport-top)] z-50 flex h-[var(--sivir-viewport-height)] flex-col overflow-y-auto overscroll-contain bg-background px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] text-foreground'
                )}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                tabindex="-1"
                {...rest}
            >
                {@render children?.()}
            </nav>
        </div>
    {/if}
</div>

<style>
    @media (prefers-reduced-motion: no-preference) {
        [data-ui='fullscreen-nav-content']
            :global([data-ui='fullscreen-nav-group'] > div > [data-ui='fullscreen-nav-link']) {
            animation: fullscreen-nav-link-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: var(--fullscreen-nav-link-delay, 50ms);
        }
    }

    @keyframes fullscreen-nav-link-in {
        from {
            opacity: 0;
            transform: translateY(0.5rem) scale(0.98);
        }
    }
</style>
