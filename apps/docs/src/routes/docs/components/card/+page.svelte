<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
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
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Card
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                A surface for grouping related content, composed of header, content, and footer.
            </p>
        </div>
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
        <p class="text-sm text-foreground-muted">Import Card and compose it with sub-components:</p>
        <CodeBlock
            code={`import * as Card from '$lib/sivir/components/card';\n\n<Card.Root>\n  <Card.Header>\n    <Card.Title>Title</Card.Title>\n  </Card.Header>\n  <Card.Content>Content here</Card.Content>\n  <Card.Footer>\n    <Button>Action</Button>\n  </Card.Footer>\n</Card.Root>`}
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
                Card with different structures and compositions.
            </p>
        </div>

        <div id="full" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Full composition
            </h3>
            <ComponentPreview code={FullSrc}>
                <Full />
            </ComponentPreview>
        </div>

        <div id="content-only" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Content only
            </h3>
            <ComponentPreview code={ContentOnlySrc}>
                <ContentOnly />
            </ComponentPreview>
        </div>

        <div id="header-footer" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Header and footer
            </h3>
            <ComponentPreview code={HeaderFooterSrc}>
                <HeaderFooter />
            </ComponentPreview>
        </div>

        <div id="panel" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Panel frame
            </h3>
            <ComponentPreview code={PanelSrc}>
                <Panel />
            </ComponentPreview>
        </div>
    </section>
</div>
