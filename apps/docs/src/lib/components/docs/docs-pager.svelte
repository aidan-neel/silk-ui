<script lang="ts">
    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { page } from '$app/stores';
    import { components, sanitizeComponent } from '$lib/components';

    type Page = { href: string; label: string };

    const docsPages: Page[] = [
        { href: '/docs/introduction', label: 'Introduction' },
        { href: '/docs/installation', label: 'Installation' },
        { href: '/docs/theming', label: 'Theming' },
        { href: '/docs/components', label: 'Components' }
    ];

    const pages = $derived([
        ...docsPages,
        ...components.map((component) => ({
            href: `/docs/components/${component}`,
            label: sanitizeComponent(component)
        }))
    ]);
    const pageIndex = $derived(pages.findIndex((item) => item.href === $page.url.pathname));
    const prevPage = $derived<Page | undefined>(pageIndex > 0 ? pages[pageIndex - 1] : undefined);
    const nextPage = $derived<Page | undefined>(pageIndex >= 0 ? pages[pageIndex + 1] : undefined);
</script>

{#if prevPage || nextPage}
    <nav class="flex items-center gap-1.5">
        {#if prevPage}
            <Button
                href={prevPage.href}
                variant="outline"
                size="icon"
                class="size-8"
                aria-label={`Previous: ${prevPage.label}`}
                title={`Previous: ${prevPage.label}`}
            >
                <ChevronLeft size={16} />
            </Button>
        {/if}
        {#if nextPage}
            <Button
                href={nextPage.href}
                variant="outline"
                size="icon"
                class="size-8"
                aria-label={`Next: ${nextPage.label}`}
                title={`Next: ${nextPage.label}`}
            >
                <ChevronRight size={16} />
            </Button>
        {/if}
    </nav>
{/if}
