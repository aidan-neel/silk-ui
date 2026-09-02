<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
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
            <Typography.H1> Tabs </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A horizontal or vertical switcher for views that share a context. Comes in three
                variants.
            </Typography.Text>
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
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting"
            >Import Tabs and use it in your component:</Typography.Text
        >
        <CodeBlock
            code={`import * as Tabs from '$lib/sivir/components/tabs';\n\n<Tabs.Root bind:value={tab}>\n  <Tabs.List>\n    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>\n    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="tab1">Content 1</Tabs.Content>\n  <Tabs.Content value="tab2">Content 2</Tabs.Content>\n</Tabs.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Explore Tabs in different variants and orientations.
            </Typography.Text>
        </div>

        <div id="variant-default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Default</Typography.H3>
            <ComponentPreview code={VariantDefaultSrc}>
                <VariantDefault />
            </ComponentPreview>
        </div>

        <div id="variant-ghost" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Ghost</Typography.H3>
            <ComponentPreview code={VariantGhostSrc}>
                <VariantGhost />
            </ComponentPreview>
        </div>

        <div id="variant-segmented" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Segmented</Typography.H3>
            <ComponentPreview code={VariantSegmentedSrc}>
                <VariantSegmented />
            </ComponentPreview>
        </div>

        <div id="orientation-vertical" class="scroll-mt-20 flex flex-col gap-3">
            <div>
                <Typography.H3 class="docs-subsection-heading">Vertical</Typography.H3>
                <Typography.Text variant="supporting" class="mt-2">
                    Set <Typography.InlineCode>orientation="vertical"</Typography.InlineCode> for a
                    side-by-side layout. Use Up and Down Arrow to move between tabs; Home and End
                    jump to the first and last tab.
                </Typography.Text>
            </div>
            <ComponentPreview code={VerticalSrc}>
                <Vertical />
            </ComponentPreview>
        </div>
    </section>
</div>
