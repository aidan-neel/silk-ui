<script lang="ts">
import Archive from '@lucide/svelte/icons/archive';
import MoreHorizontal from '@lucide/svelte/icons/ellipsis';
import Copy2 from '@lucide/svelte/icons/files';
import Pencil from '@lucide/svelte/icons/pencil';
import Trash from '@lucide/svelte/icons/trash-2';
import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger variant="ghost" size="icon" aria-label="Row actions">
        <MoreHorizontal size={14} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-[12rem]">
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Pencil size={13} /> Rename</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span>
            <Shortcut shortcut="cmd+D" />
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Archive size={13} /> Archive</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
            <span class="flex items-center gap-2 text-[var(--color-error)]">
                <Trash size={13} /> Delete
            </span>
            <Shortcut shortcut="backspace" />
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
