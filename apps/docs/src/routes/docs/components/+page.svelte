<script lang="ts">
    import { resolve } from '$app/paths';
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { components, sanitizeComponent } from '$lib/components';
</script>

<svelte:head>
    <title>Sivir · Components</title>
    <meta
        name="description"
        content="Browse all 54 accessible, themeable Svelte 5 components in Sivir UI."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Components
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                Build with easy-to-style UI components.
            </p>
        </div>
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
