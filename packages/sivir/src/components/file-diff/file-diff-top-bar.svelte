<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { FileDiffTopBarProps } from '.';
    import Filename from './file-diff-filename.svelte';
    import PlusMinus from './file-diff-plus-minus.svelte';

    let {
        children,
        class: className,
        file,
        additions,
        deletions,
        ...rest
    }: FileDiffTopBarProps = $props();
</script>

<div
    data-ui="file-diff-top-bar"
    class={cn(className, 'flex w-full items-center gap-2 px-3 py-2')}
    {...rest}
>
    {#if children}
        {@render children?.()}
    {:else}
        <Filename {file} />
        <PlusMinus {additions} {deletions} />
    {/if}
</div>
