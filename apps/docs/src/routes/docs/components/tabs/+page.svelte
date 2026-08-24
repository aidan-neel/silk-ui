<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import VariantDefault from './examples/variant-default.svelte';
    import VariantDefaultSrc from './examples/variant-default.svelte?raw';
    import VariantGhost from './examples/variant-ghost.svelte';
    import VariantGhostSrc from './examples/variant-ghost.svelte?raw';
    import VariantSegmented from './examples/variant-segmented.svelte';
    import VariantSegmentedSrc from './examples/variant-segmented.svelte?raw';
    import Vertical from './examples/vertical.svelte';
    import VerticalSrc from './examples/vertical.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add tabs';
</script>

<svelte:head>
    <title>Sivir · Tabs</title>
    <meta
        name="description"
        content="Switch between mutually-exclusive views with horizontal or vertical tabs and a sliding indicator."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Tabs
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                A horizontal or vertical switcher for views that share a context. Comes in three
                variants.
            </p>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">Import Tabs and use it in your component:</p>
        <CodeBlock
            code={`import * as Tabs from '$lib/sivir/components/tabs';\n\n<Tabs.Root bind:value={tab}>\n  <Tabs.List>\n    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>\n    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="tab1">Content 1</Tabs.Content>\n  <Tabs.Content value="tab2">Content 2</Tabs.Content>\n</Tabs.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Explore Tabs in different variants and orientations.
            </p>
        </div>

        <div id="variant-default" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Default
            </h3>
            <ComponentPreview code={VariantDefaultSrc}>
                <VariantDefault />
            </ComponentPreview>
        </div>

        <div id="variant-ghost" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Ghost
            </h3>
            <ComponentPreview code={VariantGhostSrc}>
                <VariantGhost />
            </ComponentPreview>
        </div>

        <div id="variant-segmented" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Segmented
            </h3>
            <ComponentPreview code={VariantSegmentedSrc}>
                <VariantSegmented />
            </ComponentPreview>
        </div>

        <div id="orientation-vertical" class="scroll-mt-20 flex flex-col gap-3">
            <div>
                <h3
                    class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
                >
                    Vertical
                </h3>
                <p class="mt-2 text-sm text-foreground-muted">
                    Set <code>orientation="vertical"</code> for a side-by-side layout. Use Up and
                    Down Arrow to move between tabs; Home and End jump to the first and last tab.
                </p>
            </div>
            <ComponentPreview code={VerticalSrc}>
                <Vertical />
            </ComponentPreview>
        </div>
    </section>
</div>
