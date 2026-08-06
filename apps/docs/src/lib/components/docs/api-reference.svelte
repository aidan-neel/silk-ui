<script lang="ts">
    import type { ApiReferenceItem } from './api-reference-types';

    const {
        title,
        component,
        items,
        description
    }: {
        title: string;
        component: string;
        items: ApiReferenceItem[];
        description: string;
    } = $props();
</script>

<div class="w-full flex flex-col gap-6">
    <header class="flex flex-col gap-4">
        <h1
            class="h2 bg-secondary font-mono w-fit rounded-lg px-3 py-1 text-lg"
            data-toc-label={component}
        >
            <span class="text-foreground-muted">
                {title}
            </span>.<span
                class="[font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]"
            >
                {component}
            </span>
        </h1>
        <p class="text-[0.98rem] leading-7 text-foreground-muted">
            {description}
        </p>
    </header>

    {#if items.length !== 0}
        <div
            class="w-full overflow-x-auto rounded-[1rem] border border-border bg-card shadow-[var(--elevation-1)] ring-1 ring-inset ring-white/30 dark:ring-white/5"
        >
            <table class="min-w-[42rem] w-full border-collapse text-left">
                <thead>
                    <tr class="border-b">
                        <th
                            class="p-3 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
                        >
                            Property
                        </th>
                        <th
                            class="p-3 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
                        >
                            Type
                        </th>
                        <th
                            class="p-3 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
                        >
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as { property, type, description, defaults } (property)}
                        <tr class="border-t">
                            <td class="w-[11rem] p-3 font-mono align-top">
                                <span
                                    class="bg-secondary px-2 p-1 rounded-lg [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-sm"
                                >
                                    {property}
                                </span>
                            </td>
                            <td class="w-[11rem] p-3 font-mono align-top">
                                <span
                                    class="bg-secondary px-2 p-1 rounded-lg [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-sm"
                                >
                                    {type}
                                </span>
                            </td>
                            <td class="p-3 align-top text-sm">
                                {description}<br />
                                <span class="font-mono text-foreground-muted text-sm mt-2">
                                    Default: {defaults ?? '-'}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
