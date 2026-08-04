<script lang="ts">
import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';

let {
    onCopy = () => {},
    onPaste = () => {},
    onDelete = () => {}
}: {
    onCopy?: () => void;
    onPaste?: () => void;
    onDelete?: () => void;
} = $props();
</script>

<ContextMenu.Root>
    <ContextMenu.Trigger>
        <div data-testid="ctx-trigger" style="padding: 20px; background: #eee;">
            Right-click here
        </div>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
        <ContextMenu.Item callback={onCopy}>
            <span data-testid="ctx-copy">Copy</span>
        </ContextMenu.Item>
        <ContextMenu.Item callback={onPaste}>
            <span data-testid="ctx-paste">Paste</span>
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item callback={onDelete}>
            <span data-testid="ctx-delete">Delete</span>
        </ContextMenu.Item>
    </ContextMenu.Content>
</ContextMenu.Root>
