<script lang="ts">
    import { useOverlay } from '@sivir-ui/svelte/components/_internal/overlay';
    import { overlayIn, overlayOut, sheetIn, sheetOut } from '@sivir-ui/svelte/transition';
    import { cn, visualViewportBounds } from '@sivir-ui/svelte/utils';
    import type { SheetContentProps } from '.';
    import { getSheetContext } from './context.svelte';

    let {
        class: className,
        allowClickOutside = true,
        children,
        side = 'right',
        ...rest
    }: SheetContentProps = $props();

    const { id, state: sheetState } = getSheetContext();
    let element = $state<HTMLElement>();
    let portalEl = $state<HTMLDivElement>();

    /**
     * Portal to `<body>` so the sheet escapes ancestor stacking contexts, the same
     * pattern Modal uses, and the slide always paints over the page.
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
        isOpen: () => sheetState.open,
        panelEl: () => element,
        onClose: () => {
            sheetState.open = false;
        },
        allowClickOutside: () => allowClickOutside,
        returnFocus: () => sheetState.triggerRef ?? undefined
    });
</script>

<!-- Keep the host in body before opening so Safari does not reparent active transitions. -->
<div bind:this={portalEl} use:visualViewportBounds data-overlay-root>
    {#if sheetState.open}
        <div
            class="pointer-events-none fixed inset-x-0 top-[var(--sivir-viewport-top)] z-40 h-[var(--sivir-viewport-height)] [&>*]:pointer-events-auto"
        >
            <div
                in:overlayIn
                out:overlayOut
                data-ui="sheet-overlay"
                class={cn(
                    // token-lint-disable-next-line no-literal-length
                    'absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px] [backface-visibility:hidden] [transform:translateZ(0)]'
                )}
                aria-hidden="true"
            ></div>
            <div
                bind:this={element}
                data-ui="sheet-content"
                data-side={side}
                data-motion="sheet"
                in:sheetIn={{ side }}
                out:sheetOut={{ side }}
                class={cn(
                    className,
                    // token-lint-disable-next-line no-literal-length
                    `fixed top-[calc(var(--sivir-viewport-top)+0.5rem)] bottom-auto z-50 flex h-[calc(var(--sivir-viewport-height)-1rem)] w-[calc(100%-1rem)] max-w-sm flex-col overflow-hidden text-foreground shadow-[var(--elevation-float)] will-change-transform [backface-visibility:hidden] ${
                        side === 'left' ? 'left-2' : 'right-2'
                    }`,
                    'rounded-[var(--radius-lg)] border border-border bg-panel'
                )}
                role="dialog"
                aria-modal="true"
                id={`sheet-${id}`}
                aria-labelledby={id + '-title'}
                aria-describedby={id + '-desc'}
                tabindex="-1"
                {...rest}
            >
                <div
                    class={cn(
                        'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-panel p-4'
                    )}
                >
                    {@render children?.()}
                </div>
            </div>
        </div>
    {/if}
</div>
