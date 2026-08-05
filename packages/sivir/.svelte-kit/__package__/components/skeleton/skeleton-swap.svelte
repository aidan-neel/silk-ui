<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { SkeletonSwapProps } from '.';

let {
    ready,
    children,
    skeleton,
    lines = 3,
    lineHeight = 21,
    barHeight = 9,
    reserve,
    delay = 120,
    minVisible = 380,
    label,
    class: className,
    ...rest
}: SkeletonSwapProps = $props();

const widths = [100, 93, 97, 88, 95, 91] as const;
let shell = $state<HTMLDivElement>();
let body = $state<HTMLDivElement>();
let showSkeleton = $state(false);
let shownAt = 0;
let scrollable = $state(false);
const boxHeight = $derived(reserve ?? lines * lineHeight);
const contentVisible = $derived(ready && !showSkeleton);

function widthFor(index: number) {
    if (lines > 1 && index === lines - 1) {
        return 62;
    }
    return widths[(index * 7 + 3) % widths.length];
}

$effect(() => {
    if (!ready) {
        if (showSkeleton) {
            return;
        }
        const timer = setTimeout(() => {
            shownAt = performance.now();
            showSkeleton = true;
        }, delay);
        return () => clearTimeout(timer);
    }

    if (!showSkeleton) {
        return;
    }
    const remaining = Math.max(0, minVisible - (performance.now() - shownAt));
    const timer = setTimeout(() => {
        showSkeleton = false;
    }, remaining);
    return () => clearTimeout(timer);
});

$effect(() => {
    if (!shell) {
        return;
    }
    const measure = () => {
        const next = shell ? shell.scrollHeight - shell.clientHeight > 1 : false;
        if (next !== scrollable) {
            scrollable = next;
        }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(shell);
    if (body) {
        observer.observe(body);
    }
    measure();
    return () => observer.disconnect();
});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    bind:this={shell}
    {...rest}
    data-ui="skeleton-swap"
    aria-busy={!contentVisible}
    aria-label={label}
    tabindex={scrollable ? 0 : undefined}
    class={cn(
        className,
        'relative grid overflow-y-auto overscroll-contain text-foreground [scrollbar-gutter:stable]'
    )}
    style:height={`${boxHeight}px`}
>
    <div
        bind:this={body}
        aria-hidden={!contentVisible}
        inert={!contentVisible || undefined}
        data-visible={contentVisible}
        class="sivir-skeleton-content col-start-1 row-start-1 min-w-0 origin-top-left"
    >
        {@render children?.()}
    </div>

    <div
        aria-hidden="true"
        data-visible={showSkeleton}
        class="sivir-skeleton-placeholder pointer-events-none col-start-1 row-start-1 w-full self-start"
    >
        {#if skeleton}
            {@render skeleton()}
        {:else}
            <div class="w-full">
                {#each Array(lines) as _, index (index)}
                    <div class="flex items-center" style:height={`${lineHeight}px`}>
                        <div
                            class="rounded-[var(--radius-sm)] bg-secondary"
                            style:height={`${barHeight}px`}
                            style:width={`${widthFor(index)}%`}
                        ></div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    {#if label}
        <span role="status" class="sr-only">{contentVisible ? `${label} loaded` : ''}</span>
    {/if}
</div>

<style>
    .sivir-skeleton-content,
    .sivir-skeleton-placeholder {
        transition-property: opacity, scale, filter;
        transition-duration: var(--motion-duration-panel);
        transition-timing-function: var(--ease-out);
    }

    .sivir-skeleton-content[data-visible='false'] {
        pointer-events: none;
        opacity: 0;
        scale: 0.99;
        filter: blur(4px);
    }

    .sivir-skeleton-content[data-visible='true'],
    .sivir-skeleton-placeholder[data-visible='true'] {
        opacity: 1;
        scale: 1;
        filter: blur(0);
    }

    .sivir-skeleton-placeholder[data-visible='false'] {
        opacity: 0;
        filter: blur(3px);
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-skeleton-content,
        .sivir-skeleton-placeholder {
            transition: none;
        }
    }
</style>
