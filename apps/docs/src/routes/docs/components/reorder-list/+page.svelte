<script lang="ts">
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add reorder-list';
</script>

<svelte:head>
    <title>Sivir · Reorder List</title>
    <meta name="description" content="Reorder controlled items with pointer or keyboard input." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Reorder List
            </h1>
            <p class="mt-2 max-w-2xl text-[1rem] leading-relaxed text-foreground-muted">
                The gap the neighboring rows open is the drop target.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2 class="docs-section-heading">Installation</h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2 class="docs-section-heading">Usage</h2>
        <p class="text-sm text-foreground-muted">
            Bind the controlled array for live movement. Use <code>onCommit</code> for persistence so
            a drag writes once rather than on every crossing.
        </p>
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
