<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { FileDiffContext, FileDiffPlusMinusProps } from '.';

    let { class: className, additions, deletions, ...rest }: FileDiffPlusMinusProps = $props();

    const context = getContext<FileDiffContext>('file-diff');
    const resolvedAdditions = $derived(additions ?? context?.additions ?? 0);
    const resolvedDeletions = $derived(deletions ?? context?.deletions ?? 0);
</script>

<span
    data-ui="file-diff-plus-minus"
    class={cn(
        className,
        'flex shrink-0 items-center gap-2 font-mono text-[length:var(--font-size-label)] font-medium tabular-nums'
    )}
    {...rest}
>
    {#if resolvedAdditions > 0}
        <span class="text-success">+{resolvedAdditions}</span>
    {/if}
    {#if resolvedDeletions > 0}
        <span class="text-error">−{resolvedDeletions}</span>
    {/if}
</span>
