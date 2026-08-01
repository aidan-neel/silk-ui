<script lang="ts">
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { ModalContentProps } from '.';
    import { dialogIn, dialogOut, overlayIn, overlayOut } from '@sivir-ui/svelte/transition';
    import { useOverlay } from '@sivir-ui/svelte/components/_internal/overlay';
    import X from '@lucide/svelte/icons/x';
    import { getModalContext } from './context.svelte';

    let {
        class: className,
        allowClickOutside = true,
        role = 'dialog',
        contentClass = '',
        maxWidthClass,
        overlayClass = '',
        surfaceClass = '',
        panelIdPrefix = 'modal',
        showClose = true,
        size = 'md',
        children,
        ...rest
    }: ModalContentProps = $props();

    const sizeClass = $derived(
        maxWidthClass ??
            (
                {
                    // token-lint-disable-next-line no-literal-length
                    sm: 'md:max-w-[18rem]',
                    md: 'md:max-w-sm',
                    lg: 'md:max-w-md',
                    xl: 'md:max-w-xl',
                    '2xl': 'md:max-w-2xl',
                    '3xl': 'md:max-w-3xl'
                } as const
            )[size]
    );

    const modal = getModalContext();
    const contentId = $derived(`${panelIdPrefix}-${modal.id}`);
    let element = $state<HTMLElement>();
    let portalEl = $state<HTMLDivElement>();

    $effect(() => {
        modal.contentId = contentId;
    });

    /**
     * Portal the modal to `<body>` so its z-index escapes ancestor stacking
     * contexts such as flex items with a z-index or transformed parents.
     */
    $effect(() => {
        if (!portalEl || typeof document === 'undefined') {
            return;
        }
        document.body.appendChild(portalEl);
        return () => {
            portalEl?.remove();
        };
    });

    /** Shared overlay behavior: focus trap, click-outside, Escape, body lock. */
    useOverlay({
        isOpen: () => modal.state.open,
        panelEl: () => element,
        onClose: () => {
            modal.state.open = false;
        },
        allowClickOutside: () => allowClickOutside,
        returnFocus: () => modal.returnFocusEl
    });
</script>

<!-- Keep the host in body before opening so Safari does not reparent active transitions. -->
<div bind:this={portalEl} use:visualViewportBounds data-overlay-root>
    {#if modal.state.open}
        <div
            class="fixed inset-x-0 top-[var(--sivir-viewport-top)] z-[115] h-[var(--sivir-viewport-height)]"
        >
            <div
                in:overlayIn
                out:overlayOut
                data-ui="modal-overlay"
                class={cn(
                    overlayClass, // token-lint-disable-next-line no-literal-length
                    'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]'
                )}
            ></div>
            <div
                in:dialogIn
                out:dialogOut
                bind:this={element}
                data-motion="dialog"
                class={cn(
                    contentClass,
                    className, // token-lint-disable-next-line no-literal-length
                    'origin-center bg-panel text-foreground shadow-[var(--elevation-float)]',
                    'rounded-[var(--radius-lg)] border border-border',
                    'fixed top-[var(--sivir-viewport-center)] left-1/2 z-[120] m-auto flex min-h-20 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden md:top-[calc(var(--sivir-viewport-center)-3rem)] md:w-full max-h-[calc(var(--sivir-viewport-height)-2rem)]', // token-lint-disable-line no-literal-length
                    sizeClass
                )}
                {role}
                aria-modal="true"
                id={contentId}
                aria-labelledby={modal.id + '-title'}
                aria-describedby={modal.id + '-desc'}
                tabindex="-1"
                {...rest}
            >
                <div
                    class={cn(
                        surfaceClass,
                        'bg-panel',
                        'relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5'
                    )}
                >
                    {#if showClose}
                        <button
                            onclick={() => {
                                modal.state.open = false;
                            }}
                            aria-label="Close"
                            class="absolute top-1.5 right-1.5 inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] md:top-2.5 md:right-2.5 md:size-7"
                        >
                            <X size={16} />
                        </button>
                    {/if}
                    {@render children?.()}
                </div>
            </div>
        </div>
    {/if}
</div>
