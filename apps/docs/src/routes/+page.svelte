<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { resolve } from '$app/paths';
    import Navbar from '$lib/components/navbar.svelte';

    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();
    const installCommand = 'bun add @sivir-ui/svelte';
</script>

<svelte:head>
    <title>Sivir UI · Themed Svelte components</title>
    <meta
        name="description"
        content="55 Svelte 5 components. Restyle all of them from a handful of design tokens, with no forks or overrides."
    />
</svelte:head>

<section
    class="flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden bg-background"
    aria-label="Sivir UI introduction"
>
    <Navbar starCount={data.starCount ?? null} />

    <div
        class="mx-auto flex w-full max-w-[72rem] flex-1 flex-col items-center px-5 pt-[clamp(4.5rem,13vh,9rem)] pb-16 text-center sm:px-8"
    >
        <Badge
            variant="outline"
            href={resolve('/docs/components')}
            class="motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both]"
        >
            55 Svelte components
        </Badge>

        <h1
            class="mt-10 max-w-[15ch] font-[var(--font-header)] text-[clamp(2.75rem,5.8vw,5.5rem)] leading-[0.92] font-medium! tracking-[-0.055em] text-foreground motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:45ms] motion-safe:[transform-origin:top_center]"
        >
            Restyle everything from a few tokens.
        </h1>
        <p
            class="mt-7 max-w-[38rem] text-[1.0625rem] leading-[1.65] text-foreground-muted motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:80ms] motion-safe:[transform-origin:top_center] sm:text-lg"
        >
            Choose from 55 Svelte 5 components that take on your visual system without forks,
            overrides, or a fight.
        </p>
        <div
            class="mt-9 flex w-full max-w-[28rem] flex-wrap justify-center gap-3 motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:115ms] motion-safe:[transform-origin:top_center]"
        >
            <Button href={resolve('/docs/components')} size="lg" class="max-sm:flex-1">
                Browse components
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

        <div
            class="mt-[clamp(5rem,11vh,8rem)] w-full max-w-[46rem] text-left motion-safe:[animation:docs-block-in_280ms_var(--ease-out)_both] motion-safe:[animation-delay:150ms] motion-safe:[transform-origin:top_center]"
        >
            <CodeBlock code={installCommand} lang="shell" copy="overlay" />
        </div>
    </div>
</section>
