<!-- token-lint-disable-file -->
<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import { setContext, untrack } from 'svelte';
    import type { CodeBlockProps, CodeBlockRegistry, CodeBlockTab } from '.';
    import Actions from './code-block-actions.svelte';
    import Content from './code-block-content.svelte';
    import Header from './code-block-header.svelte';
    import List from './code-block-list.svelte';
    import Roll from './code-block-roll.svelte';
    import Trigger from './code-block-trigger.svelte';

    let {
        children,
        class: className,
        value = $bindable(),
        tabs,
        code,
        lang,
        showLineNumbers = false,
        copy = 'actionbar',
        actions,
        theme = 'sivir',
        ...rest
    }: CodeBlockProps = $props();

    const SINGLE = '__single__';

    /**
     * High-level when `tabs` (multi-language) or `code` (single snippet) is given.
     * Otherwise the caller composes the subparts as children.
     */
    const resolvedTabs = $derived<CodeBlockTab[]>(
        (tabs ?? []).map((t) => {
            return {
                ...t,
                value: t.value ?? t.lang
            };
        })
    );
    const isHighLevel = $derived(tabs != null || code != null);
    const hasTabRow = $derived(resolvedTabs.length > 0);
    const bodyCopy = $derived<'overlay' | 'inline' | undefined>(
        copy === 'actionbar' ? undefined : copy
    );

    /**
     * Seeds the active tab before the first render, reading the raw props because
     * the derived above is not ready during init.
     */
    const initialValue = untrack(() => {
        const firstTab = tabs?.[0];
        return firstTab ? (firstTab.value ?? firstTab.lang) : code != null ? SINGLE : '';
    });
    value ??= initialValue;

    /**
     * Raw code per tab -- Copy reads the active one -- plus the active/order
     * tracking that drives the directional slide between tabs.
     */
    const registry = $state({
        codes: {},
        langs: {},
        active: untrack(() => value ?? ''),
        order: [],
        contained: untrack(() => isHighLevel),
        tabbed: false,
        theme: untrack(() => theme)
    } as CodeBlockRegistry);
    setContext('code-block', registry);

    $effect(() => {
        registry.active = value ?? '';
        registry.contained = isHighLevel;
        registry.theme = theme;
    });
</script>

<div
    data-ui="code-block"
    class={cn(
        className,
        'sivir-inset-frame flex max-h-[var(--code-block-max-height)] w-full flex-col overflow-hidden text-foreground',
        '[--code-block-gutter:var(--color-foreground-muted)] [--code-block-padding-x:1.1rem] [--code-block-padding-y:0.9rem] [--code-block-line-height:1.7] [--code-block-max-height:min(32rem,70vh)] [--code-block-slide:1.25rem]',
        theme === 'sivir' &&
            '[--code-block-token-comment:#6a737d] [--code-block-token-keyword:#d73a49] [--code-block-token-string:#032f62] [--code-block-token-number:#005cc5] [--code-block-token-function:#6f42c1] [--code-block-token-property:#005cc5] [--code-block-token-builtin:#e36209] [--code-block-token-entity:#22863a] [--code-block-token-meta:#005cc5]',
        theme === 'sivir' &&
            'dark:[--code-block-token-comment:#8b949e] dark:[--code-block-token-keyword:#ff7b72] dark:[--code-block-token-string:#a5d6ff] dark:[--code-block-token-number:#79c0ff] dark:[--code-block-token-function:#d2a8ff] dark:[--code-block-token-property:#79c0ff] dark:[--code-block-token-builtin:#ffa657] dark:[--code-block-token-entity:#7ee787] dark:[--code-block-token-meta:#79c0ff]'
    )}
    {...rest}
>
    <Tabs.Root bind:value variant="segmented" class="contents">
        {#if isHighLevel}
            {#if hasTabRow || actions || copy === 'actionbar'}
                <Header>
                    {#if hasTabRow}
                        <List>
                            {#each resolvedTabs as t (t.value)}
                                <Trigger value={t.value as string}>{t.label}</Trigger>
                            {/each}
                        </List>
                    {/if}
                    <Actions copy={copy === 'actionbar'}> {@render actions?.()} </Actions>
                </Header>
            {/if}
            {#if hasTabRow || code != null}
                <!-- The static card: holds the background/ring while only the text
				     panels slide inside it (and clips the slide). -->
                <div
                    data-ui="code-block-surface"
                    class={cn(
                        'sivir-inset-surface relative flex min-h-0 w-full self-stretch flex-1 overflow-auto'
                    )}
                >
                    {#if hasTabRow}
                        <Roll tabs={resolvedTabs} {showLineNumbers} copyPlacement={bodyCopy} />
                    {:else if code != null}
                        <Content
                            value={SINGLE}
                            {code}
                            {lang}
                            {showLineNumbers}
                            copyPlacement={bodyCopy}
                        />
                    {/if}
                </div>
            {/if}
        {:else}
            {@render children?.()}
            {#if registry.tabbed}
                <div
                    data-ui="code-block-surface"
                    class={cn(
                        'sivir-inset-surface relative flex min-h-0 w-full self-stretch flex-1 overflow-auto'
                    )}
                >
                    <Roll {showLineNumbers} copyPlacement={bodyCopy} />
                </div>
            {/if}
        {/if}
    </Tabs.Root>
</div>
