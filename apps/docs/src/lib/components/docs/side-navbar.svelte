<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { travelingHighlight } from '@sivir-ui/svelte/utils';
    import { page } from '$app/stores';
    import { components, sanitizeComponent } from '$lib/components';
    import Logo from '$lib/components/logo.svelte';

    let { class: classProp = '', onNavigate }: { class?: string; onNavigate?: () => void } =
        $props();
    const pageName = $derived($page.url.pathname);
    const sortedComponents = $derived(
        [...components].sort((a, b) => sanitizeComponent(a).localeCompare(sanitizeComponent(b)))
    );

    const gettingStartedItems = [
        { href: '/docs/introduction', label: 'Introduction' },
        { href: '/docs/installation', label: 'Installation' },
        { href: '/docs/theming', label: 'Theming' },
        { href: '/docs/changelog', label: 'Changelog' },
        { href: '/studio', label: 'Studio' },
        { href: '/docs/components', label: 'Components' }
    ];

    function isActive(path: string) {
        return pageName === path;
    }
</script>

<aside class={`${classProp} hide-scrollbar flex flex-col overflow-y-auto overscroll-contain pb-6`}>
    <div class="px-2">
        <Logo />
    </div>

    <div class="mt-5 mb-5 h-px bg-border" aria-hidden="true"></div>

    <section class="flex flex-col gap-2">
        <h3 class="px-2 text-xs text-foreground-muted [font-weight:var(--font-weight-label,500)]">
            Getting Started
        </h3>
        <div use:travelingHighlight class="ml-2 flex flex-col border-l border-border pl-2">
            {#each gettingStartedItems as item (item.href)}
                {@const active = isActive(item.href)}
                <Button
                    variant="quiet"
                    size="md"
                    href={item.href}
                    onclick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    data-collection-item
                    data-collection-active={active ? 'true' : undefined}
                    class={`w-full justify-start rounded-[var(--radius-md)] px-3 text-left text-sm ${
                        active
                            ? 'text-foreground [font-weight:var(--font-weight-label,500)]'
                            : 'text-foreground-muted hover:bg-secondary/70 hover:text-foreground'
                    }`}
                >
                    {item.label}
                </Button>
            {/each}
        </div>
    </section>

    <section class="mt-5 flex flex-col gap-2">
        <div class="flex items-center justify-between px-2">
            <h3 class="text-xs text-foreground-muted [font-weight:var(--font-weight-label,500)]">
                Components
            </h3>
            <span class="text-[11px] tabular-nums text-foreground-muted/70"
                >{components.length}</span
            >
        </div>
        <div use:travelingHighlight class="ml-2 flex flex-col border-l border-border pl-2">
            {#each sortedComponents as component (component)}
                {@const active = pageName === `/docs/components/${component}`}
                <Button
                    variant="quiet"
                    size="md"
                    href={`/docs/components/${component}`}
                    onclick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    data-collection-item
                    data-collection-active={active ? 'true' : undefined}
                    class={`w-full justify-start rounded-[var(--radius-md)] px-3 text-left text-sm ${
                        active
                            ? 'text-foreground [font-weight:var(--font-weight-label,500)]'
                            : 'text-foreground-muted hover:bg-secondary/70 hover:text-foreground'
                    }`}
                >
                    {sanitizeComponent(component)}
                </Button>
            {/each}
        </div>
    </section>
</aside>
