<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import { useOverlay } from '@sivir-ui/svelte/components/_internal/overlay';
    import { dialogIn, dialogOut, overlayIn, overlayOut } from '@sivir-ui/svelte/transition';
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { ModalContentProps } from '.';
    import { getModalContext } from './context.svelte';

    let {
        class: className,
        allowClickOutside = true,
        allowEscape = true,
        role = 'dialog',
        contentClass = '',
        overlayClass = '',
        surfaceClass = '',
        panelIdPrefix = 'modal',
        showClose = true,
        size,
        children,
        ...rest
    }: ModalContentProps = $props();

    const modal = getModalContext();
    const resolvedSize = $derived(size ?? (modal.state.orientation === 'horizontal' ? 'lg' : 'md'));
    const sizeClass = $derived(
        (modal.state.orientation === 'horizontal'
            ? {
                  sm: 'max-w-sm',
                  md: 'max-w-md',
                  lg: 'max-w-xl',
                  xl: 'max-w-2xl'
              }
            : {
                  sm: 'max-w-xs',
                  md: 'max-w-sm',
                  lg: 'max-w-md',
                  xl: 'max-w-xl'
              })[resolvedSize]
    );
    const isDestructiveAlert = $derived(role === 'alertdialog' && modal.state.error);
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
        allowEscape: () => allowEscape,
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
                    'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] backdrop-brightness-90 [backface-visibility:hidden] [transform:translateZ(0)]'
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
                    'sivir-modal-frame origin-center text-foreground shadow-[var(--elevation-modal)]',
                    'fixed top-[var(--sivir-viewport-center)] left-1/2 z-[120] m-auto flex min-h-20 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden md:top-[calc(var(--sivir-viewport-center)-3rem)] md:w-full max-h-[calc(var(--sivir-viewport-height)-2rem)]', // token-lint-disable-line no-literal-length
                    sizeClass
                )}
                {role}
                data-ui="modal-panel"
                data-orientation={modal.state.orientation}
                data-destructive={isDestructiveAlert || undefined}
                aria-modal="true"
                id={contentId}
                aria-labelledby={`${modal.id}-title`}
                aria-describedby={`${modal.id}-desc`}
                tabindex="-1"
                {...rest}
            >
                <div
                    class={cn(
                        surfaceClass,
                        'relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5',
                        showClose && '[&_[data-ui=modal-header]]:pr-8'
                    )}
                    data-ui="modal-surface"
                >
                    {#if showClose}
                        <button
                            type="button"
                            onclick={() => {
                                modal.state.open = false;
                            }}
                            aria-label="Close"
                            class="absolute top-3 right-3 z-[2] inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                        >
                            <X size={16} />
                        </button>
                    {/if}
                    {@render children?.()}
                </div>
                {#if modal.footerSlot}
                    <div
                        {...modal.footerSlot.rest}
                        data-ui="modal-footer"
                        data-orientation={modal.state.orientation}
                        class={cn(
                            modal.footerSlot.className,
                            'flex w-full flex-row items-center px-1 py-1.5'
                        )}
                    >
                        {@render modal.footerSlot.children?.()}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
