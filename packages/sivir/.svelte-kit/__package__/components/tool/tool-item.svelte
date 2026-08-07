<script lang="ts">
    import Document from '@lucide/svelte/icons/file-text';
    import Magnifer from '@lucide/svelte/icons/search';
    import Command from '@lucide/svelte/icons/wrench';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolItemProps } from '.';

    let { name, detail, kind = 'command', class: className, ...rest }: ToolItemProps = $props();

    const Icon = $derived(kind === 'search' ? Magnifer : kind === 'read' ? Document : Command);
    const color = $derived(
        kind === 'search' ? 'text-primary' : kind === 'read' ? 'text-success' : 'text-foreground'
    );
</script>

<div
    data-ui="tool-item"
    data-kind={kind}
    class={cn(className, 'flex min-w-0 items-center gap-2')}
    {...rest}
>
    <Icon size={14} aria-hidden="true" class="shrink-0 text-foreground-muted" />
    <span class={`shrink-0 font-[var(--font-weight-label)] ${color}`}>{name}</span>
    {#if detail}
        <span class="min-w-0 truncate font-mono text-xs text-foreground-muted">{detail}</span>
    {/if}
</div>
