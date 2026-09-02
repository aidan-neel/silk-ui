<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { mode, toggleMode } from 'mode-watcher';
    import { resolve } from '$app/paths';
    import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
    import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';
    import { components } from '$lib/components';

    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    function formatStarCount(n: number | null): string {
        if (n === null || Number.isNaN(n)) {
            return 'Star';
        }

        if (n >= 1000) {
            const k = n / 1000;

            return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
        }

        return String(n);
    }

    function pascalCase(slug: string): string {
        return slug
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }

    function chunkNames(names: string[], size: number): string[][] {
        const rows: string[][] = [];

        for (let i = 0; i < names.length; i += size) {
            rows.push(names.slice(i, i + size));
        }

        return rows;
    }

    const cloudRows = chunkNames(components.map(pascalCase), 5);
    const rowDurations = [72, 54, 78, 48, 84, 60, 66, 50, 76, 56, 68];
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta
        name="description"
        content="55 Svelte 5 components. Restyle all of them from a handful of design tokens."
    />
</svelte:head>

<section
    class="relative flex min-h-screen flex-col overflow-hidden bg-background"
    aria-label="Sivir UI introduction"
>
    <header
        class="relative z-10 flex w-full items-center justify-between px-8 py-4 motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both]"
    >
        <div class="flex items-center">
            <a
                href={resolve('/')}
                class="font-semibold tracking-tight text-foreground no-underline"
                aria-label="Sivir UI home"
            >
                Sivir UI
            </a>
            <nav aria-label="Primary" class="ml-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    href={resolve('/docs/introduction')}
                    style="border-radius: var(--radius-md); padding-inline: 10px;"
                >
                    <span class="text-label">Docs</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    href={resolve('/docs/components')}
                    style="border-radius: var(--radius-md); padding-inline: 10px;"
                >
                    <span class="text-label">Components</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    href={resolve('/studio')}
                    style="border-radius: var(--radius-md); padding-inline: 10px;"
                >
                    <span class="text-label">Studio</span>
                </Button>
            </nav>
        </div>
        <div class="flex items-center gap-2 bg-background p-1">
            <Button
                variant="outline"
                size="sm"
                style="border-radius: var(--radius-md);"
                href="https://github.com/aidan-neel/sivir-ui"
                target="_blank"
                rel="noreferrer"
                aria-label="Star Sivir UI on GitHub"
            >
                <img
                    src={mode.current === 'dark' ? GitHubWhite : GitHubBlack}
                    alt="GitHub"
                    class="size-4"
                />
                <span class="text-label tabular-nums"
                    >{formatStarCount(data.starCount ?? null)}</span
                >
            </Button>
            <Button
                variant="outline"
                size="icon"
                style="border-radius: var(--radius-md);"
                onclick={() => {
                        toggleMode();
                    }}
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
        </div>
    </header>
    <div
        class="relative flex w-full flex-1 flex-col items-start justify-end px-8 pt-16 pb-16 text-left"
    >
        <Typography.H1
            class="motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both]"
            style="font-size: 18px; font-weight: var(--font-weight-label);"
        >
            Themed Svelte components
        </Typography.H1>
        <Typography.Description
            class="mt-1 max-w-[38rem] motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:80ms]"
            style="font-size: 18px; font-weight: var(--font-weight-label);"
        >
            Restyle 55 components from a handful of tokens.
        </Typography.Description>
        <div
            class="mt-3 flex flex-wrap justify-start gap-3 motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:115ms]"
        >
            <Button href={resolve('/docs/components')} size="lg">
                Browse all 55 components
                <ArrowRight size={16} />
            </Button>
            <Button
                href="https://github.com/aidan-neel/sivir-ui"
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="lg"
            >
                View on GitHub
            </Button>
        </div>
    </div>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 right-0 hidden w-[55rem] flex-col justify-between gap-6 overflow-hidden py-4 text-5xl text-foreground-muted opacity-20 blur-[1px] select-none md:flex [mask-image:linear-gradient(to_right,transparent,black_25%)]"
    >
        {#each cloudRows as row, i (i)}
            <div
                class="flex w-max motion-safe:[animation:hero-cloud-drift_linear_infinite]"
                style={`animation-duration: ${rowDurations[i % rowDurations.length]}s; animation-direction: ${i % 2 === 0 ? 'normal' : 'reverse'};`}
            >
                {#each [0, 1] as half (half)}
                    <span class="flex">
                        {#each row as name (name)}
                            <span class="mr-10 whitespace-nowrap">{name}</span>
                        {/each}
                    </span>
                {/each}
            </div>
        {/each}
    </div>
</section>
