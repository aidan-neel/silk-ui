<script lang="ts">
    import Frame from '@lucide/svelte/icons/frame';
    import MessageCircle from '@lucide/svelte/icons/message-circle';
    import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
    import PenTool from '@lucide/svelte/icons/pen-tool';
    import Square from '@lucide/svelte/icons/square';
    import Type from '@lucide/svelte/icons/type';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';

    let activeTool = $state<string>('move');

    const tools = [
        { id: 'move', label: 'Move', shortcut: 'V', icon: MousePointer2 },
        { id: 'frame', label: 'Frame', shortcut: 'F', icon: Frame },
        { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: Square },
        { id: 'pen', label: 'Pen', shortcut: 'P', icon: PenTool },
        { id: 'text', label: 'Text', shortcut: 'T', icon: Type },
        { id: 'comment', label: 'Comment', shortcut: 'C', icon: MessageCircle }
    ];
</script>

<div class="flex items-center justify-center p-10">
    <div class="flex gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-1 shadow-sm">
        {#each tools as tool (tool.id)}
            {@const Icon = tool.icon}
            <Tooltip.Root placement="top" delay={300}>
                <Tooltip.Trigger>
                    <button
                        type="button"
                        class="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] transition-colors"
                        class:bg-secondary={activeTool === tool.id}
                        class:text-foreground={activeTool === tool.id}
                        class:text-foreground-muted={activeTool !== tool.id}
                        class:hover:bg-secondary={activeTool !== tool.id}
                        class:hover:text-foreground={activeTool !== tool.id}
                        onclick={() => (activeTool = tool.id)}
                        aria-label={tool.label}
                    >
                        <Icon size={16} />
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <div class="flex items-center gap-2">
                        <span>{tool.label}</span>
                        <span class="text-foreground-muted text-opacity-60">{tool.shortcut}</span>
                    </div>
                </Tooltip.Content>
            </Tooltip.Root>
        {/each}
    </div>
</div>
