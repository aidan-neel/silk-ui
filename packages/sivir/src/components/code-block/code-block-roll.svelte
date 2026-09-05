<!-- token-lint-disable-file -->
<script lang="ts">
    import type { ScrittoProps } from '@scritto/core';
    import type { TabsState } from '@sivir-ui/svelte/components/tabs';
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Component } from 'svelte';
    import { getContext } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { toTabIdPart } from '../tabs/id';
    import type { CodeBlockRegistry, CodeBlockTab } from '.';
    import Copy from './code-block-copy.svelte';
    import { highlight } from './highlight';

    const CODE_SURFACE =
        'flex min-w-full [&_:is(.hljs-comment,.hljs-quote)]:text-[var(--code-block-token-comment)] [&_:is(.hljs-comment,.hljs-quote)]:italic [&_:is(.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-section,.hljs-link,.hljs-doctag)]:text-[var(--code-block-token-keyword)] [&_:is(.hljs-string,.hljs-meta-string,.hljs-regexp,.hljs-template-tag)]:text-[var(--code-block-token-string)] [&_:is(.hljs-number,.hljs-symbol,.hljs-bullet)]:text-[var(--code-block-token-number)] [&_.hljs-title]:text-[var(--code-block-token-function)] [&_:is(.hljs-attr,.hljs-attribute,.hljs-property,.hljs-variable,.hljs-template-variable,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id)]:text-[var(--code-block-token-property)] [&_:is(.hljs-built_in,.hljs-type,.hljs-params)]:text-[var(--code-block-token-builtin)] [&_.hljs-class_.hljs-title]:text-[var(--code-block-token-builtin)] [&_.hljs-title.class\\_]:text-[var(--code-block-token-builtin)] [&_:is(.hljs-name,.hljs-selector-pseudo)]:text-[var(--code-block-token-entity)] [&_.hljs-meta]:text-[var(--code-block-token-meta)] [&_.hljs-meta_.hljs-keyword]:text-[var(--code-block-token-meta)] [&_.hljs-emphasis]:italic [&_.hljs-strong]:[font-weight:var(--font-weight-header)]';

    const ROLL_TRANSITION = { duration: 300 };
    const CODE_CLASSES =
        'm-0 min-w-0 flex-1 overflow-x-auto whitespace-pre px-[var(--code-block-padding-x)] py-[var(--code-block-padding-y)] text-[length:var(--font-size-label)] leading-[var(--code-block-line-height)]';

    let {
        tabs,
        showLineNumbers = false,
        copyPlacement
    }: {
        tabs?: CodeBlockTab[];
        showLineNumbers?: boolean;
        copyPlacement?: 'overlay' | 'inline';
    } = $props();

    const registry = getContext<CodeBlockRegistry>('code-block');
    const tabsState = getContext<TabsState>('tabs');

    $effect(() => {
        if (!registry || !tabs) {
            return;
        }
        const keys = tabs.map((tab) => tab.value ?? tab.lang);
        for (const tab of tabs) {
            const key = tab.value ?? tab.lang;
            registry.codes[key] = tab.code;
            registry.langs[key] = tab.lang;
        }
        return () => {
            for (const key of keys) {
                delete registry.codes[key];
                delete registry.langs[key];
            }
        };
    });

    const activeValue = $derived(tabsState ? tabsState.value : (registry?.active ?? ''));
    const activeCode = $derived.by(() => {
        if (tabs) {
            const match = tabs.find((tab) => (tab.value ?? tab.lang) === activeValue);
            return match?.code ?? '';
        }
        return registry?.codes[activeValue] ?? '';
    });
    const activeLang = $derived.by(() => {
        if (tabs) {
            const match = tabs.find((tab) => (tab.value ?? tab.lang) === activeValue);
            return match?.lang ?? '';
        }
        return registry?.langs[activeValue] ?? '';
    });
    const html = $derived(highlight(activeCode, activeLang));
    const themed = $derived(registry?.theme !== 'custom');
    const lineCount = $derived(activeCode.replace(/\n$/, '').split('\n').length);
    const layout = $derived(lineCount === 1 ? 'single-line' : 'multi-line');
    const newline = '\n';

    const panelId = $derived(
        tabsState ? `${tabsState.id}-content-${toTabIdPart(activeValue)}` : undefined
    );
    const tabId = $derived(
        tabsState ? `${tabsState.id}-trigger-${toTabIdPart(activeValue)}` : undefined
    );

    const canRoll =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        typeof Element !== 'undefined' &&
        typeof Element.prototype.getAnimations === 'function';

    // Load the roller client-side only. `@scritto/svelte` pulls in a `.css`
    // entry that plain Node SSR cannot evaluate, and the server always renders
    // the `<pre>` fallback below, so there is nothing to hydrate against.
    type ScrittoComponent = Component<ScrittoProps & HTMLAttributes<HTMLElement>>;
    let Scritto = $state<ScrittoComponent | null>(null);

    $effect(() => {
        if (!canRoll || lineCount !== 1) {
            return;
        }
        let cancelled = false;
        import('@scritto/svelte').then((module) => {
            if (!cancelled) {
                Scritto = module.default as ScrittoComponent;
            }
        });
        return () => {
            cancelled = true;
        };
    });

    let panelBox: HTMLDivElement | undefined;
    let fromHeight = $state(0);

    $effect.pre(() => {
        void activeValue;
        if (panelBox) {
            fromHeight = panelBox.offsetHeight;
        }
    });

    // Grow and shrink the panel through the tab switch instead of snapping,
    // so a taller snippet eases the block open around the rolling rows.
    $effect(() => {
        void activeValue;
        const box = panelBox;
        if (!box || typeof window === 'undefined' || !fromHeight) {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const toHeight = box.offsetHeight;
        if (toHeight === fromHeight) {
            return;
        }
        const animation = box.animate(
            [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
            {
                duration: getCssDuration(box, '--motion-duration-panel', 180),
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
            }
        );
        return () => {
            animation.cancel();
        };
    });
</script>

<div
    role="tabpanel"
    bind:this={panelBox}
    id={panelId}
    aria-labelledby={tabId}
    data-ui="code-block-content"
    data-state="active"
    data-layout={layout}
    class={cn(
        'w-full max-h-[var(--code-block-max-height,32rem)] overflow-auto font-mono font-medium text-foreground'
    )}
>
    <div class="relative w-full overflow-x-auto">
        {#if copyPlacement === 'inline'}
            <div class="flex min-w-full w-full items-center">
                {#if lineCount === 1 && Scritto}
                    <Scritto value={activeCode} transition={ROLL_TRANSITION} class={CODE_CLASSES} />
                {:else}
                    <div class={cn(themed && CODE_SURFACE, 'w-full items-center')}>
                        <pre class={CODE_CLASSES}><code>{@html html}</code></pre>
                    </div>
                {/if}
                <Copy class="mr-1.5 shrink-0" />
            </div>
        {:else}
            <div class="flex min-w-full w-full">
                {#if showLineNumbers}
                    <pre
                        aria-hidden="true"
                        class="m-0 shrink-0 select-none border-r border-border px-3 py-[var(--code-block-padding-y)] text-right text-[length:var(--font-size-label)] leading-[var(--code-block-line-height)] text-[var(--code-block-gutter)]"
                    >{#each Array.from({ length: lineCount }, (_, i) => i) as i (i)}{i +
                                1}{newline}{/each}</pre>
                {/if}
                {#if lineCount === 1 && Scritto}
                    <Scritto value={activeCode} transition={ROLL_TRANSITION} class={CODE_CLASSES} />
                {:else}
                    <div class={cn(themed && CODE_SURFACE, 'w-full')}>
                        <pre class={CODE_CLASSES}><code>{@html html}</code></pre>
                    </div>
                {/if}
            </div>
        {/if}
        {#if copyPlacement === 'overlay'}
            <Copy
                class={cn(
                    'absolute right-2 z-10 bg-card',
                    layout === 'single-line' ? 'top-1/2 -translate-y-1/2' : 'top-2'
                )}
            />
        {/if}
    </div>
</div>
