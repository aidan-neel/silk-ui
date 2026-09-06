<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
</script>

<div class="flex flex-wrap gap-4 justify-center">
    {#each ['top', 'right', 'bottom', 'left'] as placement (placement)}
        <Popover.Root placement={placement as 'top' | 'right' | 'bottom' | 'left'}>
            <Popover.Trigger size="md" variant="outline">{placement}</Popover.Trigger>
            <Popover.Content class="w-48">
                <div class="p-3">
                    <p class="m-0 text-sm text-foreground-muted">Anchored to {placement}</p>
                </div>
            </Popover.Content>
        </Popover.Root>
    {/each}
</div>
