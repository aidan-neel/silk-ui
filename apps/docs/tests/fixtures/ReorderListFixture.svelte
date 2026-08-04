<script lang="ts">
import { ReorderList } from '@sivir-ui/svelte/components/reorder-list';

type Item = { id: string; label: string };
let { disabled = false }: { disabled?: boolean } = $props();
let items = $state<Item[]>([
    { id: 'one', label: 'First' },
    { id: 'two', label: 'Second' },
    { id: 'three', label: 'Third' }
]);
let commits = $state(0);
</script>

<ReorderList
    bind:items
    getId={(item) => item.id}
    getLabel={(item) => item.label}
    label="Steps"
    {disabled}
    onCommit={() => (commits += 1)}
>
    {#snippet children(item)}<span>{item.label}</span>{/snippet}
</ReorderList>
<output aria-label="Order">{items.map((item) => item.id).join(',')}</output>
<output aria-label="Commits">{commits}</output>
