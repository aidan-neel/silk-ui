<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { mode, toggleMode } from 'mode-watcher';
    import { resolve } from '$app/paths';

    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';

    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

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
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta
        name="description"
        content="55 Svelte 5 components. Restyle all of them from a handful of design tokens, with no forks or overrides."
    />
</svelte:head>

<section
    class="flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[calc(var(--radius-lg)+0.5rem)] border border-border bg-background"
    aria-label="Sivir UI introduction"
>
    <header
        class="flex min-h-[3.75rem] w-full items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5"
    >
        <a
            class="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-md)] px-[0.55rem] text-[0.8125rem] font-[var(--font-weight-label,500)] tabular-nums text-foreground-muted no-underline transition-colors duration-150 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
            href="https://github.com/aidan-neel/sivir-ui"
            target="_blank"
            rel="noreferrer"
            aria-label={data.starCount === null
                ? 'Star Sivir UI on GitHub'
                : `${formatStarCount(data.starCount)} GitHub stars`}
        >
            <img
                src={mode.current === 'dark' ? GitHubWhite : GitHubBlack}
                alt=""
                class="size-[0.9375rem]"
            />
            <span>GitHub</span>
            <span>{formatStarCount(data.starCount ?? null)}</span>
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
    </header>

    <div
        class="mx-auto flex w-[calc(100%-2.5rem)] max-w-[37rem] flex-1 flex-col items-center justify-start py-[5rem] text-center sm:w-[calc(100%-3rem)] sm:py-[clamp(6rem,21vh,14rem)] sm:pb-16"
    >
        <h1
            class="w-full font-[var(--font-header)] text-[clamp(1.8rem,5.2vw,3.75rem)] leading-[0.98] font-medium! tracking-[-0.045em] text-foreground motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[transform-origin:top_center]"
        >
            <span class="block text-nowrap">Restyle everything from</span>
            <span class="block">a few tokens.</span>
        </h1>
        <p
            class="mt-6 max-w-[33rem] text-base leading-[1.6] text-foreground-muted motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:45ms] motion-safe:[transform-origin:top_center]"
        >
            Choose from 55 Svelte 5 components that take on your visual system without forks,
            overrides, or a fight.
        </p>
        <div
            class="mt-8 flex flex-wrap justify-center gap-3 motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:80ms] motion-safe:[transform-origin:top_center]"
        >
            <Button href={resolve('/docs/components')} size="lg" class="max-sm:flex-1">
                Browse all 55 components
                <ArrowRight size={16} />
            </Button>
            <Button
                href="https://github.com/aidan-neel/sivir-ui"
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="lg"
                class="max-sm:flex-1"
            >
                View on GitHub
            </Button>
        </div>
    </div>
</section>
