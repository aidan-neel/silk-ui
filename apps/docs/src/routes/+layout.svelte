<script lang="ts">
    import { Toaster } from '@sivir-ui/svelte/components/toast';
    import { getStoredLiveThemeCss, hydrateLiveThemeCss } from '@sivir-ui/svelte/themes/live';
    import { ModeWatcher } from 'mode-watcher';
    import DocsToolbar from '$lib/components/docs/docs-toolbar.svelte';
    import SideNavbar from '$lib/components/docs/side-navbar.svelte';
    import Navbar from '$lib/components/navbar.svelte';
    import '@sivir-ui/svelte/ui.css';
    import '../app.css';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
    import { onMount, type Snippet } from 'svelte';
    import { dev } from '$app/environment';
    import { afterNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import { DEFAULT_FONT, fonts, selectedFont } from '$lib/fonts.svelte';

    import type { LayoutData } from './$types';

    injectAnalytics({ mode: dev ? 'development' : 'production' });

    const { children, data }: { children: Snippet; data: LayoutData } = $props();

    const isHome = $derived($page.url.pathname === '/');
    const isDocs = $derived($page.url.pathname.startsWith('/docs'));
    const isThemeStudio = $derived($page.url.pathname.startsWith('/studio'));

    // `--font-header` defaults to `var(--font-sans)`, so one custom property re-skins every page.
    $effect(() => {
        if (getStoredLiveThemeCss()) {
            document.documentElement.style.removeProperty('--font-sans');
            return;
        }
        const font =
            fonts.find((entry) => entry.name === selectedFont.current) ??
            fonts.find((entry) => entry.name === DEFAULT_FONT);
        if (font) document.documentElement.style.setProperty('--font-sans', font.family);
    });

    onMount(() => {
        hydrateLiveThemeCss();
    });

    let docsScrollEl = $state<HTMLDivElement>();

    afterNavigate(() => {
        docsScrollEl?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    });
</script>

<svelte:head>
    <title>{dev ? 'Sivir UI - Dev' : 'Sivir UI'}</title>
    <link rel="canonical" href={`${data.origin}${$page.url.pathname}`} />
    <meta property="og:site_name" content="Sivir UI" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`${data.origin}${$page.url.pathname}`} />
    <meta property="og:image" content={`${data.origin}/og-default.png`} />
    <meta property="og:image:secure_url" content={`${data.origin}/og-default.png`} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta
        property="og:image:alt"
        content="Sivir UI social card showing a polished component library preview."
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={`${data.origin}/og-default.png`} />
    <meta
        name="twitter:image:alt"
        content="Sivir UI social card showing a polished component library preview."
    />
</svelte:head>

<ModeWatcher />
<Toaster />

<main
    class={`w-screen bg-background ${isDocs ? 'h-[100svh] overflow-hidden p-3' : isThemeStudio ? 'h-[100svh] overflow-hidden' : isHome ? 'min-h-screen' : 'min-h-screen p-3'}`}
>
    {#if isHome}
        <div class="relative mx-auto flex min-h-screen w-full max-w-none flex-col">
            {@render children?.()}
        </div>
    {:else if isDocs}
        <div class="flex h-[calc(100svh-1.5rem)] w-full gap-3">
            <SideNavbar class="hidden h-full w-[17.5rem] shrink-0 px-3 pt-5 lg:flex" />
            <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
                <DocsToolbar starCount={data?.starCount ?? null} />
                <div bind:this={docsScrollEl} class="min-h-0 flex-1 overflow-y-auto">
                    {@render children?.()}
                </div>
            </div>
        </div>
    {:else if isThemeStudio}
        <div class="flex h-[100svh] w-full flex-col overflow-hidden bg-background">
            <div class="shrink-0">
                <Navbar starCount={data?.starCount ?? null} />
            </div>
            <div class="flex min-h-0 flex-1">
                {@render children?.()}
            </div>
        </div>
    {:else}
        <div class="flex min-h-[calc(100svh-1.5rem)] w-full gap-3">
            <div
                class="flex min-w-0 flex-1 flex-col overflow-clip rounded-[calc(var(--radius-lg)+0.5rem)] border border-border bg-background"
            >
                <DocsToolbar starCount={data?.starCount ?? null} />
                <div
                    bind:this={docsScrollEl}
                    class="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-5 px-4 md:px-6 lg:flex-row lg:gap-0"
                >
                    {@render children?.()}
                </div>
            </div>
        </div>
    {/if}
</main>
