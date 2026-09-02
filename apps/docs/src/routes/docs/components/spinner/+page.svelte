<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Spinner </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A compact loading indicator with a paced rotation that keeps indeterminate work
                feeling active.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Use Spinner for work with an unknown duration. Set
            <Typography.InlineCode>aria-hidden</Typography.InlineCode>
            when adjacent text already describes the loading state. Set
            <Typography.InlineCode>ready</Typography.InlineCode>
            when work completes to resolve it into a checkmark, then blur and collapse it away.
        </Typography.Text>
        <CodeBlock
            code={`import { Spinner } from '@sivir-ui/svelte/components/spinner';\n\n<Spinner ready={saved} aria-hidden="true" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="ready-state" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Completion state</Typography.H2>
        <Typography.Text variant="supporting">
            Pass <Typography.InlineCode>ready</Typography.InlineCode> after a successful operation.
            The spinner resolves to a checkmark, holds it for two seconds, then blurs and collapses
            without requiring parent state to unmount it.
        </Typography.Text>
        <ComponentPreview code={ReadyStateSrc}><ReadyState /></ComponentPreview>
    </section>
</div>
