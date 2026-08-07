<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import ReadyState from './examples/ready-state.svelte';
    import ReadyStateSrc from './examples/ready-state.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add spinner';
</script>

<svelte:head>
    <title>Sivir · Spinner</title>
    <meta name="description" content="An animated loading indicator for indeterminate work." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Spinner
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                A compact loading indicator with a paced rotation that keeps indeterminate work
                feeling active.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            Use Spinner for work with an unknown duration. Set <code>aria-hidden</code> when
            adjacent text already describes the loading state. Set <code>ready</code> when work
            completes to resolve it into a checkmark, then blur and collapse it away.
        </p>
        <CodeBlock
            code={`import { Spinner } from '@sivir-ui/svelte/components/spinner';\n\n<Spinner ready={saved} aria-hidden="true" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="ready-state" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Completion state
        </h2>
        <p class="text-sm text-foreground-muted">
            Pass <code>ready</code> after a successful operation. The spinner resolves to a
            checkmark, holds it for two seconds, then blurs and collapses without requiring parent
            state to unmount it.
        </p>
        <ComponentPreview code={ReadyStateSrc}><ReadyState /></ComponentPreview>
    </section>
</div>
