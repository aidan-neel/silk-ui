<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Search from '@lucide/svelte/icons/search';
    import type { ScrittoProps } from '@scritto/core';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Combobox from '@sivir-ui/svelte/components/combobox';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Component } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { components, sanitizeComponent } from '$lib/components';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    type Group = {
        id: string;
        heading: string;
        items: string[];
    };

    const groups: Group[] = [
        {
            id: 'inputs',
            heading: 'Inputs',
            items: [
                'button',
                'checkbox',
                'color-picker',
                'combobox',
                'input',
                'label',
                'radio-group',
                'select',
                'slider',
                'switch',
                'textarea',
                'toggle',
                'toggle-group'
            ]
        },
        {
            id: 'overlays',
            heading: 'Overlays',
            items: [
                'alert-dialog',
                'command',
                'context-menu',
                'dropdown-menu',
                'hover-card',
                'modal',
                'popover',
                'sheet',
                'tooltip'
            ]
        },
        {
            id: 'feedback',
            heading: 'Feedback',
            items: [
                'alert',
                'badge',
                'gauge',
                'progress',
                'skeleton',
                'spinner',
                'task-steps',
                'toast'
            ]
        },
        {
            id: 'navigation',
            heading: 'Navigation',
            items: ['breadcrumb', 'fullscreen-nav', 'pagination', 'tabs', 'toolbar']
        },
        {
            id: 'layout',
            heading: 'Layout',
            items: [
                'accordion',
                'avatar',
                'card',
                'collapsible',
                'reorder-list',
                'scroll-area',
                'show-more'
            ]
        },
        {
            id: 'content',
            heading: 'Content',
            items: ['code-block', 'copy-button', 'markdown', 'shortcut', 'typography']
        },
        {
            id: 'ai',
            heading: 'AI',
            items: [
                'attachment',
                'conversation',
                'message',
                'prompt-composer',
                'question',
                'reasoning',
                'response-stream',
                'tool'
            ]
        }
    ];

    const ROLL_TRANSITION = { duration: 300 };

    const canRoll =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        typeof Element !== 'undefined' &&
        typeof Element.prototype.getAnimations === 'function';

    type ScrittoComponent = Component<ScrittoProps & HTMLAttributes<HTMLElement>>;
    let Scritto = $state<ScrittoComponent | null>(null);

    $effect(() => {
        if (!canRoll) {
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

    let query = $state('');

    function matches(component: string): boolean {
        const needle = query.trim().toLowerCase();
        if (needle === '') {
            return true;
        }
        return (
            component.includes(needle) ||
            sanitizeComponent(component).toLowerCase().includes(needle)
        );
    }

    const visibleGroups = $derived(
        groups
            .map((group) => ({ ...group, items: group.items.filter(matches) }))
            .filter((group) => group.items.length > 0)
    );
    const visibleTotal = $derived(
        visibleGroups.reduce((sum, group) => sum + group.items.length, 0)
    );
    const countLabel = $derived(
        query.trim() === ''
            ? `${components.length} components`
            : `${visibleTotal} of ${components.length} components`
    );

    function componentHref(component: string): string {
        return `/docs/components/${component}`;
    }
</script>

<svelte:head>
    <title>Sivir · Components</title>
    <meta
        name="description"
        content="Browse all 55 accessible, themeable Svelte 5 components in Sivir UI."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Components</Typography.H1>

            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Build with easy-to-style UI components.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section aria-label="Search components" class="flex flex-col gap-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Combobox.Root bind:value={query}>
                <Combobox.Trigger
                    appearance="input"
                    placeholder="Search components"
                    class="w-full sm:max-w-sm"
                >
                    {#snippet trailing()}
                        <Search size={16} />
                    {/snippet}
                </Combobox.Trigger>
                <Combobox.Content class="max-h-56">
                    <Combobox.Results>
                        {#each visibleGroups as group (group.id)}
                            {#each group.items as component (component)}
                                <Combobox.Item
                                    value={component}
                                    label={sanitizeComponent(component)}
                                    callback={() => {
                                        void goto(componentHref(component));
                                    }}
                                />
                            {/each}
                        {/each}
                    </Combobox.Results>
                </Combobox.Content>
            </Combobox.Root>
            <Typography.Metadata class="tabular-nums" aria-live="polite">
                {#if Scritto}
                    <Scritto value={countLabel} transition={ROLL_TRANSITION} />
                {:else}
                    {countLabel}
                {/if}
            </Typography.Metadata>
        </div>
    </section>

    {#if visibleTotal === 0}
        <section aria-label="No matching components" class="flex flex-col items-start gap-3">
            <Typography.Text variant="supporting">
                No components match “{query.trim()}”.
            </Typography.Text>
            <Button variant="outline" size="sm" onclick={() => (query = '')}>Clear search</Button>
        </section>
    {/if}

    {#each visibleGroups as group (group.id)}
        <section aria-labelledby={group.id} class="flex flex-col gap-4">
            <div class="flex items-baseline gap-2">
                <Typography.H2 id={group.id} class="m-0">{group.heading}</Typography.H2>
                <Typography.Metadata class="tabular-nums">{group.items.length}</Typography.Metadata>
            </div>
            <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {#each group.items as component, i (component)}
                    <li
                        class="motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both]"
                        style={`animation-delay: ${Math.min(i * 24, 240)}ms;`}
                    >
                        <a
                            href={resolve(
                                `/docs/components/${component}` as '/docs/components/accordion'
                            )}
                            class="group flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card px-4 py-3 text-foreground transition-[border-color,background-color] duration-200 hover:border-border-strong hover:bg-secondary/45 motion-reduce:transition-none"
                        >
                            <span class="font-medium">{sanitizeComponent(component)}</span>
                            <ArrowRight
                                size={15}
                                class="text-foreground-muted transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                                aria-hidden="true"
                            />
                        </a>
                    </li>
                {/each}
            </ul>
        </section>
    {/each}
</div>
