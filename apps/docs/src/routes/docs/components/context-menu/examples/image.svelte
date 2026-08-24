<script lang="ts">
    import Copy from '@lucide/svelte/icons/copy';
    import Download from '@lucide/svelte/icons/download';
    import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';
</script>

<div class="flex items-center justify-center">
    <ContextMenu.Root>
        <ContextMenu.Trigger>
            <div
                class="flex h-20 w-56 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-secondary/30 text-sm text-foreground-muted"
            >
                Right-click an image
            </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Download size={14} /> Save image</span>
            </ContextMenu.Item>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Copy size={14} /> Copy image</span>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item callback={() => {}}>Open in new tab</ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>
</div>
