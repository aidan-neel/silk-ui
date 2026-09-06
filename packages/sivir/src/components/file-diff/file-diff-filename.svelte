<script lang="ts">
    import FileDiffIcon from '@lucide/svelte/icons/file-diff';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { FileDiffContext, FileDiffFilenameProps } from '.';

    let { class: className, file, ...rest }: FileDiffFilenameProps = $props();

    const context = getContext<FileDiffContext>('file-diff');
    const resolvedFile = $derived(file ?? context?.file ?? '');
</script>

<span
    data-ui="file-diff-filename"
    class={cn(className, 'flex min-w-0 flex-1 items-center gap-2')}
    {...rest}
>
    <FileDiffIcon size={14} class="shrink-0 text-foreground-muted" aria-hidden="true" />
    <span
        class="min-w-0 flex-1 truncate font-mono text-[length:var(--font-size-label)] font-medium text-foreground"
    >
        {resolvedFile}
    </span>
</span>
