<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { ReorderList } from '@sivir-ui/svelte/components/reorder-list';

    type AgendaItem = { id: string; name: string; duration: string };
    const initial: AgendaItem[] = [
        { id: 'opening', name: 'Opening remarks', duration: '5 min' },
        { id: 'roadmap', name: 'Roadmap review', duration: '15 min' },
        { id: 'critique', name: 'Design critique', duration: '20 min' },
        { id: 'questions', name: 'Open questions', duration: '10 min' }
    ];
    let items = $state([...initial]);
</script>

<div class="w-full max-w-md">
    <div class="mb-3 flex justify-end">
        <Button size="sm" variant="ghost" onclick={() => (items = [...initial])}>Reset</Button>
    </div>
    <ReorderList
        bind:items
        getId={(item) => item.id}
        getLabel={(item) => item.name}
        label="Meeting agenda"
    >
        {#snippet children(item)}
            <span class="flex min-w-0 items-center justify-between gap-4">
                <span class="truncate text-sm font-medium">{item.name}</span>
                <span class="shrink-0 font-mono text-[10.5px] tabular-nums text-foreground-muted"
                    >{item.duration}</span
                >
            </span>
        {/snippet}
    </ReorderList>
    <p class="mt-3 text-xs leading-relaxed text-foreground-muted">
        Drag a row, or focus it and press Space to grab it. Arrow keys move; Escape cancels.
    </p>
</div>
