<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext } from 'svelte';
    import type { FileDiffContext, FileDiffRootProps } from '.';
    import Content from './file-diff-content.svelte';
    import Row from './file-diff-row.svelte';
    import TopBar from './file-diff-top-bar.svelte';

    let {
        children,
        class: className,
        file = '',
        lang = '',
        additions,
        deletions,
        diff,
        showLineNumbers = true,
        theme = 'sivir',
        ...rest
    }: FileDiffRootProps = $props();

    const resolvedAdditions = $derived(
        additions ?? diff?.filter((line) => line.type === 'add').length ?? 0
    );
    const resolvedDeletions = $derived(
        deletions ?? diff?.filter((line) => line.type === 'remove').length ?? 0
    );
    const isHighLevel = $derived(diff != null);

    const context = $state({
        lang,
        showLineNumbers,
        file,
        additions: resolvedAdditions,
        deletions: resolvedDeletions,
        theme
    } satisfies FileDiffContext);
    setContext('file-diff', context);

    $effect(() => {
        context.lang = lang;
        context.showLineNumbers = showLineNumbers;
        context.file = file;
        context.additions = resolvedAdditions;
        context.deletions = resolvedDeletions;
        context.theme = theme;
    });
</script>

<div
    data-ui="file-diff"
    class={cn(
        className,
        'sivir-inset-frame flex w-full flex-col overflow-hidden text-foreground',
        '[--file-diff-line-height:1.7] [--file-diff-max-height:min(32rem,70vh)]',
        theme === 'sivir' &&
            '[--file-diff-token-comment:#6a737d] [--file-diff-token-keyword:#d73a49] [--file-diff-token-string:#032f62] [--file-diff-token-number:#005cc5] [--file-diff-token-function:#6f42c1] [--file-diff-token-property:#005cc5] [--file-diff-token-builtin:#e36209] [--file-diff-token-entity:#22863a] [--file-diff-token-meta:#005cc5]',
        theme === 'sivir' &&
            'dark:[--file-diff-token-comment:#8b949e] dark:[--file-diff-token-keyword:#ff7b72] dark:[--file-diff-token-string:#a5d6ff] dark:[--file-diff-token-number:#79c0ff] dark:[--file-diff-token-function:#d2a8ff] dark:[--file-diff-token-property:#79c0ff] dark:[--file-diff-token-builtin:#ffa657] dark:[--file-diff-token-entity:#7ee787] dark:[--file-diff-token-meta:#79c0ff]'
    )}
    {...rest}
>
    {#if isHighLevel}
        <TopBar />
        <Content>
            {#each diff as line, index (index)}
                <Row
                    type={line.type}
                    oldLine={line.oldLineNumber}
                    newLine={line.newLineNumber}
                    code={line.content}
                />
            {/each}
        </Content>
    {:else}
        {@render children?.()}
    {/if}
</div>
