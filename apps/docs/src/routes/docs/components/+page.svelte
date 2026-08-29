<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import { components, sanitizeComponent } from '$lib/components';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
</script>

<svelte:head>
    <title>Sivir · Components</title>
    <meta
        name="description"
        content="Browse all 55 accessible, themeable Svelte 5 components in Sivir UI."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Components</Typography.H1>

            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Build with easy-to-style UI components.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {#each components as component (component)}
            <li>
                <a
                    href={resolve(`/docs/components/${component}` as '/docs/components/accordion')}
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
</div>
