<script lang="ts">
import FolderOpen from '@lucide/svelte/icons/folder-open';
import Pencil from '@lucide/svelte/icons/pencil';
import Trash from '@lucide/svelte/icons/trash-2';
import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';
</script>

<div class="flex items-center justify-center">
    <ContextMenu.Root>
        <ContextMenu.Trigger>
            <div
                class="flex h-20 w-56 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-secondary/30 text-sm text-foreground-muted"
            >
                Right-click a file
            </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><FolderOpen size={14} /> Open</span>
            </ContextMenu.Item>
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2"><Pencil size={14} /> Rename</span>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item callback={() => {}}>
                <span class="flex items-center gap-2 text-[var(--color-error)]">
                    <Trash size={14} /> Delete
                </span>
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>
</div>
