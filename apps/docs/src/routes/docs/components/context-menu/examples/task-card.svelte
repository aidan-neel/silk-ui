<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import Pencil from '@lucide/svelte/icons/pencil';
    import Share from '@lucide/svelte/icons/share-2';
    import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';
</script>

<div class="flex items-center justify-center">
    <ContextMenu.Root>
        <ContextMenu.Trigger>
            <div
                class="flex h-20 w-56 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-secondary/30 text-sm text-foreground-muted"
            >
                Right-click a task
            </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Pencil size={14} /> Edit</span>
            </ContextMenu.Item>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Share size={14} /> Share</span>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Check size={14} /> Mark complete</span>
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>
</div>
