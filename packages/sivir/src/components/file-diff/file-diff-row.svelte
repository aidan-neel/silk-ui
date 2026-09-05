<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { FileDiffContext, FileDiffRowProps } from '.';
    import LineNumber from './file-diff-line-number.svelte';
    import { highlight } from './highlight';

    const CODE_SURFACE =
        '[&_:is(.hljs-comment,.hljs-quote)]:text-[var(--file-diff-token-comment)] [&_:is(.hljs-comment,.hljs-quote)]:italic [&_:is(.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-section,.hljs-link,.hljs-doctag)]:text-[var(--file-diff-token-keyword)] [&_:is(.hljs-string,.hljs-meta-string,.hljs-regexp,.hljs-template-tag)]:text-[var(--file-diff-token-string)] [&_:is(.hljs-number,.hljs-symbol,.hljs-bullet)]:text-[var(--file-diff-token-number)] [&_.hljs-title]:text-[var(--file-diff-token-function)] [&_:is(.hljs-attr,.hljs-attribute,.hljs-property,.hljs-variable,.hljs-template-variable,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id)]:text-[var(--file-diff-token-property)] [&_:is(.hljs-built_in,.hljs-type,.hljs-params)]:text-[var(--file-diff-token-builtin)] [&_.hljs-class_.hljs-title]:text-[var(--file-diff-token-builtin)] [&_.hljs-title.class\\_]:text-[var(--file-diff-token-builtin)] [&_:is(.hljs-name,.hljs-selector-pseudo)]:text-[var(--file-diff-token-entity)] [&_.hljs-meta]:text-[var(--file-diff-token-meta)] [&_.hljs-meta_.hljs-keyword]:text-[var(--file-diff-token-meta)] [&_.hljs-emphasis]:italic [&_.hljs-strong]:[font-weight:var(--font-weight-header)]';

    let {
        children,
        class: className,
        type = 'context',
        oldLine,
        newLine,
        code = '',
        lang,
        ...rest
    }: FileDiffRowProps = $props();

    const context = getContext<FileDiffContext>('file-diff');
    const themed = $derived(context?.theme !== 'custom');
    const resolvedLang = $derived(lang ?? context?.lang ?? '');
    const showLineNumbers = $derived(context?.showLineNumbers ?? true);
    const html = $derived(highlight(code, resolvedLang));
    const sign = $derived(type === 'add' ? '+' : type === 'remove' ? '−' : ' ');
    const columns = $derived(
        showLineNumbers
            ? 'grid-cols-[2.75rem_2.75rem_1.5rem_minmax(0,1fr)]'
            : 'grid-cols-[1.5rem_minmax(0,1fr)]'
    );
</script>

<div
    data-ui="file-diff-row"
    data-type={type}
    class={cn(
        className,
        'grid min-w-full items-stretch',
        columns,
        type === 'add' &&
            'bg-success-soft shadow-[inset_2px_0_0_var(--color-success)] dark:bg-success-soft/60',
        type === 'remove' &&
            'bg-error-soft shadow-[inset_2px_0_0_var(--color-error)] dark:bg-error-soft/60'
    )}
    {...rest}
>
    {#if showLineNumbers}
        <span class="flex min-w-0 items-stretch py-0.5 pl-3">
            <LineNumber value={oldLine} tone={type === 'remove' ? 'remove' : 'context'} />
        </span>
        <span class="flex min-w-0 items-stretch py-0.5">
            <LineNumber value={newLine} tone={type === 'add' ? 'add' : 'context'} />
        </span>
    {/if}
    <span
        aria-hidden="true"
        class={cn(
            'flex items-stretch justify-center py-0.5 font-medium select-none',
            type === 'add' && 'text-success',
            type === 'remove' && 'text-error',
            type === 'context' && 'text-foreground-muted'
        )}
    >
        {sign}
    </span>
    <span class="min-w-0 overflow-x-auto py-0.5 pr-4 whitespace-pre">
        {#if children}
            {@render children?.()}
        {:else}
            <code class={cn(themed && CODE_SURFACE)}>{@html html}</code>
        {/if}
    </span>
</div>
