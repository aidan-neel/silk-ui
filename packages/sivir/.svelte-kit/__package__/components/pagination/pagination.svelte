<script lang="ts">
    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { PaginationProps } from '.';

    let {
        class: className,
        page = $bindable(1),
        total,
        siblings = 1,
        onPageChange,
        ...rest
    }: PaginationProps = $props();

    function go(next: number) {
        const clamped = Math.min(Math.max(next, 1), total);
        if (clamped === page) {
            return;
        }
        page = clamped;
        onPageChange?.(clamped);
    }

    const pages = $derived.by(() => {
        const result: (number | 'ellipsis')[] = [];
        const start = Math.max(2, page - siblings);
        const end = Math.min(total - 1, page + siblings);

        result.push(1);
        if (start > 2) {
            result.push('ellipsis');
        }
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        if (end < total - 1) {
            result.push('ellipsis');
        }
        if (total > 1) {
            result.push(total);
        }
        return result;
    });
</script>

<nav
    data-ui="pagination"
    aria-label="Pagination"
    class={cn(className, 'flex select-none items-center gap-1')}
    {...rest}
>
    <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onclick={() => go(page - 1)}
        class="inline-flex size-[var(--size-icon-md)] items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-40"
    >
        <ChevronLeft size={15} />
    </button>

    {#each pages as p, i (i)}
        {#if p === 'ellipsis'}
            <span
                aria-hidden="true"
                class="inline-flex size-[var(--size-icon-md)] items-center justify-center text-foreground-muted"
            >
                <MoreHorizontal size={14} />
            </span>
        {:else}
            <button
                type="button"
                aria-current={p === page ? 'page' : undefined}
                onclick={() => go(p)}
                class={cn(
                    'inline-flex size-[var(--size-icon-md)] items-center justify-center rounded-[var(--radius-md)] text-[0.82rem] tabular-nums [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]', // token-lint-disable-line no-literal-length
                    p === page
                        ? 'bg-card text-foreground shadow-[var(--elevation-control)] hover:bg-muted'
                        : 'text-foreground-muted hover:bg-secondary hover:text-foreground'
                )}
            >
                {p}
            </button>
        {/if}
    {/each}

    <button
        type="button"
        aria-label="Next page"
        disabled={page >= total}
        onclick={() => go(page + 1)}
        class="inline-flex size-[var(--size-icon-md)] items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-40"
    >
        <ChevronRight size={15} />
    </button>
</nav>
