<script lang="ts">
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import Button from '@sivir-ui/svelte/components/button';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
    import { mode, toggleMode } from 'mode-watcher';
    import { onMount } from 'svelte';
    import { resolve } from '$app/paths';
    import { page } from '$app/stores';
    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';
    import { components, sanitizeComponent } from '$lib/components';
    import Logo from './logo.svelte';
    import Navbutton from './navbutton.svelte';

    const { starCount = null }: { starCount?: number | null } = $props();

    function formatStarCount(n: number | null): string {
        if (n === null || Number.isNaN(n)) return 'Star';
        if (n >= 1000) {
            const k = n / 1000;
            return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
        }
        return String(n);
    }

    let scrolled = $state(false);
    let mobileMenuOpen = $state(false);
    const isHome = $derived($page.url.pathname === '/');
    const isDocs = $derived(
        $page.url.pathname.startsWith('/docs') || $page.url.pathname.startsWith('/fonts')
    );

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/docs/introduction', label: 'Docs' }
    ];
    const docsPages = [
        { title: 'Introduction', href: resolve('/docs/introduction') },
        { title: 'Installation', href: resolve('/docs/installation') },
        { title: 'Theming', href: resolve('/docs/theming') },
        { title: 'Components', href: resolve('/docs/components') }
    ];

    onMount(() => {
        const updateScroll = () => {
            scrolled = window.scrollY > 10;
        };

        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    });

    function openGithub() {
        window.open('https://github.com/aidan-neel/sivir-ui', '_blank', 'noopener,noreferrer');
    }
</script>

<FullscreenNav.Root bind:open={mobileMenuOpen}>
    <nav
        class={`sticky inset-x-0 top-0 z-20 transition-[background-color,backdrop-filter] duration-200 ${
            isDocs
                ? 'bg-background/72 backdrop-blur-[14px]'
                : scrolled
                  ? 'bg-background/58 backdrop-blur-[14px]'
                  : 'bg-transparent'
        }`}
    >
        <div
            class={`relative mx-auto flex h-16 w-full items-center justify-between ${
                isHome
                    ? 'nav-home-in max-w-[1400px] px-4 md:px-6'
                    : isDocs
                      ? 'max-w-[1400px] px-4 md:px-6'
                      : 'px-4 md:px-6'
            }`}
        >
            <div class="flex min-w-0 flex-row items-center gap-2 md:gap-5">
                <FullscreenNav.Trigger class="size-9 rounded-lg md:hidden" />
                <a
                    href={resolve('/')}
                    class="font-semibold tracking-tight text-foreground no-underline md:hidden"
                >
                    Sivir UI
                </a>
                <div class="hidden md:block">
                    <Logo />
                </div>
                <div class="hidden items-center gap-1 md:flex">
                    {#each navItems as item (item.href)}
                        <Navbutton href={item.href}>{item.label}</Navbutton>
                    {/each}
                    <Navbutton href={resolve('/docs/components/accordion')}>Components</Navbutton>
                </div>
            </div>

            <div class="flex flex-row items-center gap-2 md:gap-2.5">
                <Button
                    class="size-9 rounded-lg"
                    variant="ghost"
                    onclick={() => {
                        toggleMode();
                    }}
                    size="icon"
                    aria-label={mode.current === 'dark'
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'}
                >
                    <span class="relative size-4" aria-hidden="true">
                        <Sun
                            size="16"
                            class={`absolute inset-0 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                                mode.current === 'dark'
                                    ? 'scale-[0.25] opacity-0 blur-[4px]'
                                    : 'scale-100 opacity-100 blur-0'
                            }`}
                        />
                        <Moon
                            size="16"
                            class={`absolute inset-0 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                                mode.current === 'dark'
                                    ? 'scale-100 opacity-100 blur-0'
                                    : 'scale-[0.25] opacity-0 blur-[4px]'
                            }`}
                        />
                    </span>
                </Button>
                <Button
                    class="h-9 gap-1.5 rounded-lg px-2.5 md:px-3"
                    variant="ghost"
                    onclick={openGithub}
                    aria-label="Star Sivir UI on GitHub"
                >
                    <img
                        src={mode.current === 'dark' ? GitHubWhite : GitHubBlack}
                        alt="GitHub"
                        class="size-4 flex items-center justify-center"
                    />
                    <span
                        class="mt-[1px] font-mono text-[14px] tabular-nums text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
                        >{formatStarCount(starCount)}</span
                    >
                </Button>
            </div>
        </div>
    </nav>

    <FullscreenNav.Content label="Browse Sivir UI" class="p-0 md:hidden">
        <header
            class="flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3"
        >
            <a href={resolve('/')} class="font-semibold tracking-tight text-foreground no-underline"
                >Sivir UI</a
            >
            <FullscreenNav.Close />
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <FullscreenNav.Group heading="Navigate">
                {#each navItems as item (item.href)}
                    <FullscreenNav.Link href={item.href}>{item.label}</FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Getting Started" class="mt-10">
                {#each docsPages as item (item.href)}
                    <FullscreenNav.Link href={item.href}>{item.title}</FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>

            <FullscreenNav.Group heading="Components" class="mt-10">
                {#each components as component (component)}
                    <FullscreenNav.Link href={`/docs/components/${component}`}>
                        {sanitizeComponent(component)}
                    </FullscreenNav.Link>
                {/each}
            </FullscreenNav.Group>
        </div>
    </FullscreenNav.Content>
</FullscreenNav.Root>

<style>
    @media (prefers-reduced-motion: no-preference) {
        :global(.nav-home-in) {
            animation: nav-home-in 0.35s var(--ease-out) 0.04s both;
        }
    }

    @keyframes nav-home-in {
        from {
            opacity: 0;
            transform: translateY(-6px);
        }
    }
</style>
