<script lang="ts">
    import BookOpen from '@lucide/svelte/icons/book-open';
    import Component from '@lucide/svelte/icons/component';
    import Download from '@lucide/svelte/icons/download';
    import Palette from '@lucide/svelte/icons/palette';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { travelingHighlight } from '@sivir-ui/svelte/utils';
    import { page } from '$app/stores';
    import { components, sanitizeComponent } from '$lib/components';
    import Logo from '$lib/components/logo.svelte';

    let { class: classProp = '', onNavigate }: { class?: string; onNavigate?: () => void } =
        $props();
    const pageName = $derived($page.url.pathname);

    const gettingStartedItems = [
        { href: '/docs/introduction', label: 'Introduction', icon: BookOpen },
        { href: '/docs/installation', label: 'Installation', icon: Download },
        { href: '/docs/theming', label: 'Theming', icon: Palette },
        { href: '/docs/components', label: 'Components', icon: Component }
    ];

    function isActive(path: string) {
        return pageName === path;
    }
</script>

<aside
    use:travelingHighlight
    class={`${classProp} sivir-docs-sidebar hide-scrollbar flex flex-col gap-5 overflow-y-auto pb-8 pr-4`}
>
    <div class="relative z-10 px-3">
        <Logo />
    </div>

    <section class="relative z-10 flex flex-col gap-1.5">
        <h3
            class="px-2 text-[12px] text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
        >
            Getting Started
        </h3>
        <div class="flex flex-col gap-0.5">
            {#each gettingStartedItems as item (item.href)}
                {@const active = isActive(item.href)}
                <Button
                    variant="quiet"
                    href={item.href}
                    onclick={onNavigate}
                    data-collection-item
                    data-collection-active={active}
                    aria-current={active ? 'page' : undefined}
                    class={`relative z-10 h-8 w-fit justify-start gap-2 rounded-lg px-3 text-left text-sm ${
                        active
                            ? '[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]'
                            : 'hover:text-foreground'
                    }`}
                >
                    <item.icon size={14} />
                    {item.label}
                </Button>
            {/each}
        </div>
    </section>

    <section class="relative z-10 flex flex-col gap-1.5">
        <div class="flex items-center justify-between px-2">
            <h3
                class="text-[12px] text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
            >
                Components
            </h3>
            <span class="text-[11px] text-foreground-muted/70">{components.length}</span>
        </div>
        <div class="flex flex-col gap-0.5">
            {#each components as component (component)}
                {@const active = pageName === `/docs/components/${component}`}
                <Button
                    variant="quiet"
                    href={`/docs/components/${component}`}
                    onclick={onNavigate}
                    data-collection-item
                    data-collection-active={active}
                    aria-current={active ? 'page' : undefined}
                    class={`relative z-10 h-8.5 w-fit justify-start rounded-lg px-3 text-left text-sm ${
                        active
                            ? '[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]'
                            : 'hover:text-foreground'
                    }`}
                >
                    {sanitizeComponent(component)}
                </Button>
            {/each}
        </div>
    </section>
</aside>

<style>
    .sivir-docs-sidebar {
        overscroll-behavior: contain;
    }
    :global(.sivir-docs-sidebar > .sivir-item-highlight) {
        background-color: color-mix(in srgb, var(--color-secondary) 70%, transparent);
    }
</style>
