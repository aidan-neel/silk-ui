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
                  sm: 'max-w-[23rem]',
                  md: 'max-w-[27rem]',
                  lg: 'max-w-[35rem]',
                  xl: 'max-w-[41rem]'
              }
            : {
                  sm: 'max-w-[17rem]',
                  md: 'max-w-[23rem]',
                  lg: 'max-w-[27rem]',
                  xl: 'max-w-[35rem]'
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
                    'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm backdrop-brightness-90 [backface-visibility:hidden] [transform:translateZ(0)]'
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
                    'origin-center bg-panel text-foreground shadow-[var(--elevation-modal)]',
                    'rounded-[var(--radius-lg)] border border-border',
                    'fixed top-[var(--sivir-viewport-center)] left-1/2 z-[120] m-auto flex min-h-20 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden md:top-[calc(var(--sivir-viewport-center)-3rem)] md:w-full max-h-[calc(var(--sivir-viewport-height)-2rem)]', // token-lint-disable-line no-literal-length
                    sizeClass,
                    isDestructiveAlert && 'shadow-[var(--elevation-alert-error)]'
                )}
                {role}
                data-orientation={modal.state.orientation}
                data-destructive={isDestructiveAlert || undefined}
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
                            type="button"
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
