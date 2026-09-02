<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add reorder-list';
</script>

<svelte:head>
    <title>Sivir · Reorder List</title>
    <meta name="description" content="Reorder controlled items with pointer or keyboard input." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Reorder List </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The gap the neighboring rows open is the drop target.
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
            Bind the controlled array for live movement. Use
            <Typography.InlineCode>onCommit</Typography.InlineCode>
            for persistence so a drag writes once rather than on every crossing.
        </Typography.Text>
        <CodeBlock
            lang="svelte"
            copy="overlay"
            code={`<ReorderList bind:items getId={(item) => item.id} getLabel={(item) => item.name} label="Pipeline steps">
  {#snippet children(item)}
    <span>{item.name}</span>
  {/snippet}
</ReorderList>`}
        />
    </section>
</div>
