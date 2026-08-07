<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as FullscreenNav from '@sivir-ui/svelte/components/fullscreen-nav';
    import { mode, toggleMode } from 'mode-watcher';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';

    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';
    import SideNavbar from './side-navbar.svelte';

    const { starCount = null }: { starCount?: number | null } = $props();
    let mobileMenuOpen = $state(false);

    const breadcrumbs = $derived.by(() => {
        const segments = page.url.pathname.split('/').filter(Boolean);

        return segments.map((segment, index) => ({
            href: `/${segments.slice(0, index + 1).join('/')}`,
            label: formatSegment(segment)
        }));
    });

    function formatSegment(segment: string): string {
        const labels: Record<string, string> = {
            docs: 'Docs',
            components: 'Components'
        };

        if (labels[segment]) {
            return labels[segment];
        }

        return segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function formatStarCount(count: number | null): string {
        if (count === null || Number.isNaN(count)) {
            return 'Star';
        }

        if (count >= 1000) {
            const thousands = count / 1000;

            return `${thousands >= 10 ? Math.round(thousands) : thousands.toFixed(1)}k`;
        }

        return String(count);
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<FullscreenNav.Root bind:open={mobileMenuOpen}>
    <header
        class="sticky top-0 z-20 flex min-h-[3.75rem] w-full items-center justify-between gap-4 border-b border-border bg-background/72 px-4 py-3 backdrop-blur-[14px] sm:px-5"
    >
        <FullscreenNav.Trigger class="size-9 rounded-[var(--radius-md)] sm:hidden" />

        <nav aria-label="Breadcrumb" class="hidden min-w-0 sm:block">
            <ol
                class="flex min-w-0 items-center gap-1 overflow-hidden text-sm text-foreground-muted [font-weight:var(--font-weight-label,500)]"
            >
                {#each breadcrumbs as breadcrumb, index (breadcrumb.href)}
                    <li class="flex min-w-0 items-center gap-1">
                        {#if index < breadcrumbs.length - 1}
                            <a
                                href={breadcrumb.href}
                                class="truncate transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                            >
                                {breadcrumb.label}
                            </a>
                        {:else}
                            <span class="truncate text-foreground" aria-current="page"
                                >{breadcrumb.label}</span
                            >
                        {/if}
                        {#if index < breadcrumbs.length - 1}
                            <ChevronRight size={14} class="shrink-0" aria-hidden="true" />
                        {/if}
                    </li>
                {/each}
            </ol>
        </nav>

        <div class="flex shrink-0 items-center gap-1">
            <a
                class="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-md)] px-[0.55rem] text-[0.8125rem] font-[var(--font-weight-label,500)] tabular-nums text-foreground-muted no-underline transition-colors duration-150 hover:cursor-default hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                href="https://github.com/aidan-neel/sivir-ui"
                target="_blank"
                rel="noreferrer"
                aria-label={starCount === null
                    ? 'Star Sivir UI on GitHub'
                    : `${formatStarCount(starCount)} GitHub stars`}
            >
                <img
                    src={mode.current === 'dark' ? GitHubWhite : GitHubBlack}
                    alt=""
                    class="size-[0.9375rem]"
                />
                <span>{formatStarCount(starCount)}</span>
            </a>

            <Button
                class="size-9 rounded-[var(--radius-md)]"
                variant="ghost"
                onclick={() => {
                    toggleMode();
                }}
                size="icon"
                aria-label={mode.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <span class="relative block size-4" aria-hidden="true">
                    <Sun
                        size={16}
                        class={mode.current === 'dark'
                            ? 'absolute inset-0 scale-[0.25] opacity-0 blur-[4px] transition-[filter,opacity,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none'
                            : 'absolute inset-0 transition-[filter,opacity,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none'}
                    />
                    <Moon
                        size={16}
                        class={mode.current === 'dark'
                            ? 'absolute inset-0 transition-[filter,opacity,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none'
                            : 'absolute inset-0 scale-[0.25] opacity-0 blur-[4px] transition-[filter,opacity,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none'}
                    />
                </span>
            </Button>
        </div>
    </header>

    <FullscreenNav.Content label="Browse documentation" class="p-0 sm:hidden">
        <header
            class="flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3"
        >
            <a href={resolve('/')} class="font-semibold tracking-tight text-foreground no-underline"
                >Sivir UI</a
            >
            <FullscreenNav.Close />
        </header>

        <SideNavbar class="min-h-0 flex-1 px-4 pt-5" onNavigate={closeMobileMenu} />
    </FullscreenNav.Content>
</FullscreenNav.Root>
