<script lang="ts">
    import * as Sheet from '@sivir-ui/svelte/components/sheet';

    let {
        open = $bindable(false),
        allowClickOutside = true,
        side = 'right' as 'left' | 'right',
        rows = 0
    } = $props();
</script>

<button data-testid="trigger" onclick={() => (open = true)}>Open</button>

<Sheet.Root bind:open>
    <Sheet.Content {allowClickOutside} {side}>
        <Sheet.Header>
            <Sheet.Title>Sheet Title</Sheet.Title>
            <Sheet.Description>Sheet Description</Sheet.Description>
        </Sheet.Header>
        <div>
            <button data-testid="inside-1">Inside one</button>
            <button data-testid="inside-2">Inside two</button>
            {#each Array(rows) as _, index (index)}
                <div class="h-10">Scrollable row {index + 1}</div>
            {/each}
        </div>
        <Sheet.Footer>
            <Sheet.Close onclick={() => (open = false)}>Close</Sheet.Close>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
