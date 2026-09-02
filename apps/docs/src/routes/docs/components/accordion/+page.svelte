<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import MultipleMode from './examples/multiple-mode.svelte';
    import MultipleModeSrc from './examples/multiple-mode.svelte?raw';
    import SingleMode from './examples/single-mode.svelte';
    import SingleModeSrc from './examples/single-mode.svelte?raw';

    const TITLE = 'Accordion';
    const SLUG = 'accordion';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Stacked collapsible sections with single- and multi-open modes."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A vertical stack of collapsible sections. Single mode opens one at a time; multiple
                allows any combination.
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
            Import the Accordion components and use them:
        </Typography.Text>
        <CodeBlock
            code={`import * as Accordion from '$lib/sivir/components/accordion';\n\n<Accordion.Root type="single">\n  <Accordion.Item value="a">\n    <Accordion.Trigger>Trigger</Accordion.Trigger>\n    <Accordion.Content>Content</Accordion.Content>\n  </Accordion.Item>\n</Accordion.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Single mode -->
        <div id="single-mode" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Single mode </Typography.H3>
            <ComponentPreview code={SingleModeSrc}>
                <SingleMode />
            </ComponentPreview>
        </div>

        <!-- Multiple mode -->
        <div id="multiple-mode" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Multiple mode </Typography.H3>
            <ComponentPreview code={MultipleModeSrc}>
                <MultipleMode />
            </ComponentPreview>
        </div>
    </section>
</div>
