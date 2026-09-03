<!-- token-lint-disable-file -->
<script lang="ts">
    import type { TabsState } from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext, untrack } from 'svelte';
    import { toTabIdPart } from '../tabs/id';
    import type { CodeBlockContentProps, CodeBlockRegistry } from '.';
    import Copy from './code-block-copy.svelte';
    import { highlight } from './highlight';

    const CODE_SURFACE =
        'flex min-w-full [&_:is(.hljs-comment,.hljs-quote)]:text-[var(--code-block-token-comment)] [&_:is(.hljs-comment,.hljs-quote)]:italic [&_:is(.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-section,.hljs-link)]:text-[var(--code-block-token-keyword)] [&_:is(.hljs-string,.hljs-meta-string,.hljs-regexp,.hljs-template-tag)]:text-[var(--code-block-token-string)] [&_:is(.hljs-number,.hljs-symbol,.hljs-bullet)]:text-[var(--code-block-token-number)] [&_.hljs-title]:text-[var(--code-block-token-function)] [&_:is(.hljs-attr,.hljs-attribute,.hljs-property,.hljs-variable,.hljs-template-variable)]:text-[var(--code-block-token-property)] [&_:is(.hljs-built_in,.hljs-type,.hljs-params)]:text-[var(--code-block-token-builtin)] [&_.hljs-class_.hljs-title]:text-[var(--code-block-token-builtin)] [&_.hljs-title.class\\_]:text-[var(--code-block-token-builtin)] [&_.hljs-meta]:text-[var(--code-block-token-meta)] [&_.hljs-meta_.hljs-keyword]:text-[var(--code-block-token-meta)] [&_.hljs-emphasis]:italic [&_.hljs-strong]:[font-weight:var(--font-weight-header)]';

    let {
        value = 'default',
        code,
        lang,
        showLineNumbers = false,
        copyPlacement,
        class: className,
        ...rest
    }: CodeBlockContentProps = $props();

    const registry = getContext<CodeBlockRegistry>('code-block');
    const tabs = getContext<TabsState>('tabs');

    if (registry) {
        untrack(() => {
            registry.codes[value] = code;
            registry.langs[value] = lang ?? '';
            if (!registry.order.includes(value)) {
                registry.order = [...registry.order, value];
            }
        });
    }

    /**
     * Registers the raw code -- Copy reads the active one -- and records source
     * order so the slide direction can be derived from tab position.
     */
    $effect(() => {
        if (!registry) {
            return;
        }
        registry.codes[value] = code;
        registry.langs[value] = lang ?? '';
        if (!registry.order.includes(value)) {
            registry.order = [...registry.order, value];
        }
        return () => {
            delete registry.codes[value];
            delete registry.langs[value];
        };
    });

    const html = $derived(highlight(code, lang));
    const lineCount = $derived(code.replace(/\n$/, '').split('\n').length);
    const layout = $derived(lineCount === 1 ? 'single-line' : 'multi-line');

    const activeValue = $derived(tabs ? tabs.value : (registry?.active ?? value));
    const isActive = $derived(activeValue === value);
    const myIndex = $derived(registry ? registry.order.indexOf(value) : 0);
    const activeIndex = $derived(registry ? registry.order.indexOf(activeValue) : 0);
    /**
     * Panels left of the active one rest off to the left, panels to its right rest
     * off to the right. Switching tabs slides the incoming text in from its own
     * side while the outgoing text slides out the opposite way.
     */
    const shift = $derived(isActive ? 0 : myIndex < activeIndex ? -1 : 1);
    const newline = '\n';

    const panelId = $derived(tabs ? `${tabs.id}-content-${toTabIdPart(value)}` : undefined);
    const tabId = $derived(tabs ? `${tabs.id}-trigger-${toTabIdPart(value)}` : undefined);
</script>

{#if !registry?.tabbed}
    <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        data-ui="code-block-content"
        data-state={isActive ? 'active' : 'inactive'}
        data-layout={layout}
        aria-hidden={!isActive}
        inert={!isActive}
        class={cn(
        className,
        'w-full max-h-[var(--code-block-max-height,32rem)] overflow-auto font-mono font-medium text-foreground',
        !registry?.contained && 'sivir-inset-surface',
        !isActive && !registry?.contained && 'hidden',
        registry?.contained &&
            'max-h-none overflow-visible rounded-none border-0 bg-transparent shadow-none ring-0 transition-[transform,opacity] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none will-change-[transform,opacity]',
        registry?.contained && isActive && 'relative z-[1]',
        registry?.contained && !isActive && 'pointer-events-none absolute inset-0 block'
    )}
        style:transform={`translateX(calc(${shift} * var(--code-block-slide)))`}
        style:opacity={isActive ? '1' : '0'}
        {...rest}
    >
        <div class="relative w-full overflow-x-auto">
            <!-- Keep the highlighted markup on this element so the descendant Tailwind selectors apply. -->
            {#if copyPlacement === 'inline'}
                <div class={cn(CODE_SURFACE, 'w-full items-center')}>
                    <pre
                        class="m-0 min-w-0 flex-1 overflow-x-auto whitespace-pre px-[var(--code-block-padding-x)] py-[var(--code-block-padding-y)] text-[length:var(--font-size-label)] leading-[var(--code-block-line-height)]"
                    ><code
                        >{@html html}</code
                    ></pre>
                    <Copy class="mr-1.5 shrink-0" />
                </div>
            {:else}
                <div class={cn(CODE_SURFACE, 'w-full')}>
                    {#if showLineNumbers}
                        <pre
                            aria-hidden="true"
                            class="m-0 shrink-0 select-none border-r border-border px-3 py-[var(--code-block-padding-y)] text-right text-[length:var(--font-size-label)] leading-[var(--code-block-line-height)] text-[var(--code-block-gutter)]"
                        >{#each Array.from({ length: lineCount }, (_, i) => i) as i (i)}{i +
                                1}{newline}{/each}</pre>
                    {/if}
                    <pre
                        class="m-0 min-w-0 flex-1 overflow-x-auto px-[var(--code-block-padding-x)] py-[var(--code-block-padding-y)] text-[length:var(--font-size-label)] leading-[var(--code-block-line-height)]"
                    ><code
                        >{@html html}</code
                    ></pre>
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
{/if}
