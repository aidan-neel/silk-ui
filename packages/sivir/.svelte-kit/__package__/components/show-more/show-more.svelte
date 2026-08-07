<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import type { ShowMoreProps } from '.';

    let {
        children,
        lines = 3,
        maxHeight = 320,
        defaultExpanded = false,
        expanded = $bindable(defaultExpanded),
        moreLabel = 'Show more',
        lessLabel = 'Show less',
        label = 'Details',
        onExpandedChange,
        class: className,
        ...rest
    }: ShowMoreProps = $props();

    let content = $state<HTMLDivElement>();
    let region = $state<HTMLDivElement>();
    let lineHeight = $state<number>();
    let fullHeight = $state<number>();
    const regionId = $props.id();

    const collapsedHeight = $derived(
        lineHeight === undefined || fullHeight === undefined
            ? undefined
            : Math.min(lineHeight * lines, fullHeight)
    );
    const capped = $derived(fullHeight !== undefined && fullHeight > maxHeight);
    const expandable = $derived(
        lineHeight === undefined || fullHeight === undefined
            ? true
            : fullHeight - lineHeight * lines > 1
    );
    const open = $derived(expanded && expandable);
    const height = $derived(
        open
            ? fullHeight === undefined
                ? undefined
                : Math.min(fullHeight, maxHeight)
            : collapsedHeight
    );
    const scrollable = $derived(open && capped);
    const veiled = $derived(expandable && (!open || scrollable));

    function measure() {
        if (!content) {
            return;
        }
        const styles = getComputedStyle(content);
        const parsedLineHeight = Number.parseFloat(styles.lineHeight);
        const parsedFontSize = Number.parseFloat(styles.fontSize);
        lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : parsedFontSize * 1.5;
        fullHeight = content.scrollHeight;
    }

    function toggle() {
        if (open) {
            region?.scrollTo({ top: 0 });
        }
        expanded = !expanded;
        onExpandedChange?.(expanded);
    }

    onMount(() => {
        measure();
        if (!content) {
            return;
        }
        const observer = new ResizeObserver(measure);
        observer.observe(content);
        return () => observer.disconnect();
    });
</script>

<div {...rest} data-ui="show-more" class={cn(className, 'text-foreground')}>
    <div class="relative">
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
            bind:this={region}
            id={regionId}
            role={scrollable ? 'region' : undefined}
            aria-label={scrollable ? label : undefined}
            tabindex={scrollable ? 0 : undefined}
            data-scrollable={scrollable}
            class="sivir-show-more-region overscroll-contain rounded-[var(--radius-sm)] outline-none focus-visible:shadow-[var(--focus-ring)]"
            style:height={height === undefined ? undefined : `${height}px`}
            style:max-height={height === undefined ? `${lines}lh` : undefined}
            style:overflow-y={scrollable ? 'auto' : 'hidden'}
            style:scrollbar-gutter={capped ? 'stable' : undefined}
        >
            <div bind:this={content}>{@render children?.()}</div>
        </div>
        <div aria-hidden="true" data-visible={veiled} class="sivir-show-more-veil"></div>
    </div>

    {#if expandable}
        <button
            type="button"
            onclick={toggle}
            aria-expanded={open}
            aria-controls={regionId}
            class="mt-2 inline-flex min-h-[var(--size-control-sm)] items-center gap-1.5 rounded-[var(--radius-md)] px-2 [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] text-foreground-muted transition-[background-color,color] duration-[var(--motion-duration-press)] ease-[var(--ease-press)] hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transition-none"
        >
            <span class="grid text-left">
                <span class="sivir-show-more-label col-start-1 row-start-1" data-active={!open}
                    >{moreLabel}</span
                >
                <span class="sivir-show-more-label col-start-1 row-start-1" data-active={open}
                    >{lessLabel}</span
                >
            </span>
            <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                class="sivir-show-more-chevron"
                data-open={open}
            >
                <path
                    d="m2.5 4.25 3.5 3.5 3.5-3.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
    {/if}
</div>

<style>
    .sivir-show-more-region {
        transition: height var(--motion-duration-panel) var(--ease-out);
    }

    .sivir-show-more-veil {
        pointer-events: none;
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: 2.25rem;
        background: linear-gradient(to top, var(--color-background), transparent);
        opacity: 0;
        transition: opacity var(--motion-duration-press) var(--ease-out);
    }

    .sivir-show-more-veil[data-visible='true'] {
        opacity: 1;
    }

    .sivir-show-more-label,
    .sivir-show-more-chevron {
        transition-property: opacity, translate, rotate;
        transition-duration: var(--motion-duration-press);
        transition-timing-function: var(--ease-out);
    }

    .sivir-show-more-label[data-active='false'] {
        opacity: 0;
        translate: 0 2px;
    }

    .sivir-show-more-chevron[data-open='true'] {
        rotate: 180deg;
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-show-more-region,
        .sivir-show-more-veil,
        .sivir-show-more-label,
        .sivir-show-more-chevron {
            transition: none;
        }
    }
</style>
