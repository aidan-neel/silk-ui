<script lang="ts">
    import { Pagination } from '@sivir-ui/svelte/components/pagination';

    const pageSize = 5;
    const items = Array.from({ length: 48 }, (_, i) => `Result ${i + 1}`);
    let page = $state(1);
    const totalPages = Math.ceil(items.length / pageSize);
    const pageItems = $derived(items.slice((page - 1) * pageSize, page * pageSize));
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
    <ul class="m-0 flex list-none flex-col gap-2 p-0">
        {#each pageItems as item (item)}
            <li
                class="rounded-[var(--radius-md)] border border-border bg-card px-3 py-2 text-sm text-foreground"
            >
                {item}
            </li>
        {/each}
    </ul>
    <div class="flex items-center justify-between gap-3">
        <p class="m-0 text-xs text-foreground-muted tabular-nums">
            Page {page} of {totalPages}
        </p>
        <Pagination bind:page total={totalPages} />
    </div>
</div>
