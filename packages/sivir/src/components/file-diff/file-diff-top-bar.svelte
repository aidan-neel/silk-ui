<script lang="ts">
    import FileDiffIcon from '@lucide/svelte/icons/file-diff';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { FileDiffContext, FileDiffTopBarProps } from '.';

    let {
        children,
        class: className,
        file,
        additions,
        deletions,
        ...rest
    }: FileDiffTopBarProps = $props();

    const context = getContext<FileDiffContext>('file-diff');
    const resolvedFile = $derived(file ?? context?.file ?? '');
    const resolvedAdditions = $derived(additions ?? context?.additions ?? 0);
    const resolvedDeletions = $derived(deletions ?? context?.deletions ?? 0);
</script>

<div
    data-ui="file-diff-top-bar"
    class={cn(className, 'flex w-full items-center gap-2 px-3 py-2')}
    {...rest}
>
    <FileDiffIcon size={14} class="shrink-0 text-foreground-muted" aria-hidden="true" />
    <span
        class="min-w-0 flex-1 truncate font-mono text-[length:var(--font-size-label)] font-medium text-foreground"
    >
        {resolvedFile}
    </span>
    <span
        class="flex shrink-0 items-center gap-2 font-mono text-[length:var(--font-size-label)] font-medium tabular-nums"
    >
        {#if resolvedAdditions > 0}
            <span class="text-success">+{resolvedAdditions}</span>
        {/if}
        {#if resolvedDeletions > 0}
            <span class="text-error">−{resolvedDeletions}</span>
        {/if}
    </span>
    {@render children?.()}
</div>
