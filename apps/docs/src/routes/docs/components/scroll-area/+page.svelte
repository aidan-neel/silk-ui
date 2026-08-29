<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Horizontal from './examples/horizontal.svelte';
    import HorizontalSrc from './examples/horizontal.svelte?raw';

    const TITLE = 'Scroll Area';

    const installCommand = 'bunx @sivir-ui/svelte add scroll-area';
</script>

<svelte:head>
    <title>Sivir · Scroll Area</title>
    <meta
        name="description"
        content="A scroll container that styles its scrollbar to match the theme. Pure CSS, no shadow DOM, no measurement loops."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A scroll container with a theme-styled scrollbar. Supports vertical and horizontal
                orientation.
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
        <Typography.Text variant="supporting">
            Import the Scroll Area and use it to wrap content:
        </Typography.Text>
        <CodeBlock
            code={`import { ScrollArea } from '$lib/sivir/components/scroll-area';\n\n<ScrollArea class="h-48 w-64 rounded-lg border">\n  <div>Your content here</div>\n</ScrollArea>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Explore the Scroll Area in each orientation.
            </Typography.Text>
        </div>

        <div id="horizontal" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Horizontal</Typography.H3>
            <ComponentPreview code={HorizontalSrc}>
                <Horizontal />
            </ComponentPreview>
        </div>
    </section>
</div>
