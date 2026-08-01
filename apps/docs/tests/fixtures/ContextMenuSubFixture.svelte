<script lang="ts">
    import * as ContextMenu from '@sivir-ui/svelte/components/context-menu';

    let {
        onOpen = () => {},
        onRename = () => {},
        onTrash = () => {}
    }: {
        onOpen?: () => void;
        onRename?: () => void;
        onTrash?: () => void;
    } = $props();
</script>

<!--
  Cone of nested points:
    Copy
    └─ More
       ├─ Rename
       └─ Move
          └─ Trash
-->
<ContextMenu.Root>
    <ContextMenu.Trigger>
        <div data-testid="ctx-sub-trigger" style="padding: 24px; background: #eee;">
            Right-click
        </div>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
        <ContextMenu.Item callback={onOpen}>
            <span data-testid="ctx-open">Open</span>
        </ContextMenu.Item>
        <ContextMenu.Sub>
            <ContextMenu.SubTrigger>
                <span data-testid="ctx-more">More</span>
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
                <ContextMenu.Item callback={onRename}>
                    <span data-testid="ctx-rename">Rename</span>
                </ContextMenu.Item>
                <ContextMenu.Sub>
                    <ContextMenu.SubTrigger>
                        <span data-testid="ctx-move">Move</span>
                    </ContextMenu.SubTrigger>
                    <ContextMenu.SubContent>
                        <ContextMenu.Item callback={onTrash}>
                            <span data-testid="ctx-trash">Trash</span>
                        </ContextMenu.Item>
                    </ContextMenu.SubContent>
                </ContextMenu.Sub>
            </ContextMenu.SubContent>
        </ContextMenu.Sub>
    </ContextMenu.Content>
</ContextMenu.Root>
