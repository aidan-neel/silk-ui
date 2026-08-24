<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import ChevronUp from '@lucide/svelte/icons/chevron-up';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ScrollAreaProps } from '.';

    let {
        class: className,
        children,
        orientation = 'vertical',
        showCues = true,
        element = $bindable(),
        onscroll,
        ...rest
    }: ScrollAreaProps = $props();

    let scrollTop = $state(0);
    let scrollHeight = $state(0);
    let clientHeight = $state(0);

    const atTop = $derived(scrollTop <= 1);
    const atBottom = $derived(scrollTop + clientHeight >= scrollHeight - 1);
    const overflows = $derived(scrollHeight - clientHeight > 1);
    const cuesVisible = $derived(showCues && orientation === 'vertical' && overflows);

    function measure() {
        if (!element) {
            return;
        }
        scrollTop = element.scrollTop;
        scrollHeight = element.scrollHeight;
        clientHeight = element.clientHeight;
    }

    /**
     * Measure on mount and whenever the content or viewport size changes, so the
     * edge cues are correct before the first scroll event fires.
     */
    $effect(() => {
        if (!element) {
            return;
        }
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(element);
        for (const child of Array.from(element.children)) {
            ro.observe(child);
        }
        return () => ro.disconnect();
    });
</script>

<div
    data-ui="scroll-area"
    data-orientation={orientation}
    class={cn(className, 'relative min-h-0 overflow-hidden')}
>
    <div
        bind:this={element}
        data-ui="scroll-area-viewport"
        class={cn(
            'relative size-full min-h-0 rounded-[inherit] overscroll-contain [scrollbar-color:color-mix(in_srgb,var(--color-foreground)_22%,transparent)_transparent] [scrollbar-width:thin]',
            '[&::-webkit-scrollbar]:size-2.5 [&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[color-mix(in_srgb,var(--color-foreground)_18%,transparent)] [&::-webkit-scrollbar-thumb]:bg-clip-padding',
            '[&::-webkit-scrollbar-thumb:hover]:bg-[color-mix(in_srgb,var(--color-foreground)_32%,transparent)] [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding',
            orientation === 'horizontal'
                ? 'overflow-x-auto overflow-y-hidden'
                : orientation === 'vertical'
                  ? 'overflow-y-auto overflow-x-hidden'
                  : 'overflow-auto'
        )}
        onscroll={(event) => {
            measure();
            onscroll?.(event);
    }}
        {...rest}
    >
        {#if cuesVisible}
            <!-- Top edge cue: sticky so it pins to the top of the scrollport. -->
            <div aria-hidden="true" class="sticky top-0 z-10 h-0">
                <div
                    class={cn(
                        'pointer-events-none absolute inset-x-0 -top-px flex h-7 items-start justify-center bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-panel,#fff)_96%,transparent),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_40%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_0%,#000_40%,transparent_100%)] backdrop-blur-sm transition-opacity duration-150',
                        atTop ? 'opacity-0' : 'opacity-100'
                    )}
                >
                    <ChevronUp size={13} class="mt-0.5 text-foreground-muted" />
                </div>
            </div>
        {/if}

        {@render children?.()}

        {#if cuesVisible}
            <!-- Bottom edge cue: sticky so it pins to the bottom of the scrollport. -->
            <div aria-hidden="true" class="sticky bottom-0 z-10 h-0">
                <div
                    class={cn(
                        'pointer-events-none absolute inset-x-0 -bottom-px flex h-7 items-end justify-center bg-[linear-gradient(to_top,color-mix(in_srgb,var(--color-panel,#fff)_96%,transparent),transparent)] [-webkit-mask-image:linear-gradient(to_top,#000_0%,#000_40%,transparent_100%)] [mask-image:linear-gradient(to_top,#000_0%,#000_40%,transparent_100%)] backdrop-blur-sm transition-opacity duration-150',
                        atBottom ? 'opacity-0' : 'opacity-100'
                    )}
                >
                    <ChevronDown size={13} class="mb-0.5 text-foreground-muted" />
                </div>
            </div>
        {/if}
    </div>
</div>
