<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import ContentOnly from './examples/content-only.svelte';
    import ContentOnlySrc from './examples/content-only.svelte?raw';
    import Full from './examples/full.svelte';
    import FullSrc from './examples/full.svelte?raw';
    import HeaderFooter from './examples/header-footer.svelte';
    import HeaderFooterSrc from './examples/header-footer.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Panel from './examples/panel.svelte';
    import PanelSrc from './examples/panel.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add card';
</script>

<svelte:head>
    <title>Sivir · Card</title>
    <meta name="description" content="Surface container for grouping related content." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Card </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A surface for grouping related content, composed of header, content, and footer.
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
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Import Card and compose it with sub-components:
        </Typography.Text>
        <CodeBlock
            code={`import * as Card from '$lib/sivir/components/card';\n\n<Card.Root>\n  <Card.Header>\n    <Card.Title>Title</Card.Title>\n  </Card.Header>\n  <Card.Content>Content here</Card.Content>\n  <Card.Footer>\n    <Button>Action</Button>\n  </Card.Footer>\n</Card.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Card with different structures and compositions.
            </Typography.Text>
        </div>

        <div id="full" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Full composition </Typography.H3>
            <ComponentPreview code={FullSrc}>
                <Full />
            </ComponentPreview>
        </div>

        <div id="content-only" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Content only </Typography.H3>
            <ComponentPreview code={ContentOnlySrc}>
                <ContentOnly />
            </ComponentPreview>
        </div>

        <div id="header-footer" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Header and footer </Typography.H3>
            <ComponentPreview code={HeaderFooterSrc}>
                <HeaderFooter />
            </ComponentPreview>
        </div>

        <div id="panel" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Panel frame </Typography.H3>
            <ComponentPreview code={PanelSrc}>
                <Panel />
            </ComponentPreview>
        </div>
    </section>
</div>
