<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Shapes from './examples/shapes.svelte';
    import ShapesSrc from './examples/shapes.svelte?raw';
    import VariantDestructive from './examples/variant-destructive.svelte';
    import VariantDestructiveSrc from './examples/variant-destructive.svelte?raw';
    import VariantError from './examples/variant-error.svelte';
    import VariantErrorSrc from './examples/variant-error.svelte?raw';
    import VariantGhost from './examples/variant-ghost.svelte';
    import VariantGhostSrc from './examples/variant-ghost.svelte?raw';
    import VariantInfo from './examples/variant-info.svelte';
    import VariantInfoSrc from './examples/variant-info.svelte?raw';
    import VariantOutline from './examples/variant-outline.svelte';
    import VariantOutlineSrc from './examples/variant-outline.svelte?raw';
    import VariantPrimary from './examples/variant-primary.svelte';
    import VariantPrimarySrc from './examples/variant-primary.svelte?raw';
    import VariantSecondary from './examples/variant-secondary.svelte';
    import VariantSecondarySrc from './examples/variant-secondary.svelte?raw';
    import VariantSuccess from './examples/variant-success.svelte';
    import VariantSuccessSrc from './examples/variant-success.svelte?raw';
    import VariantWarning from './examples/variant-warning.svelte';
    import VariantWarningSrc from './examples/variant-warning.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add badge';
</script>

<svelte:head>
    <title>Sivir · Badge</title>
    <meta name="description" content="Small status tags and metadata pills for any UI surface." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Badge </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A compact label for status, counts, and tags.
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
            Import the Badge and use it in your component:
        </Typography.Text>
        <CodeBlock
            code={`import { Badge } from '$lib/sivir/components/badge';\n\n<Badge>New</Badge>\n<Badge variant="outline" dot>Label</Badge>\n<Badge variant="success">Active</Badge>\n<Badge variant="error">Failed</Badge>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Explore Badge variants and shapes for different use cases.
            </Typography.Text>
        </div>

        <div id="shapes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Shapes </Typography.H3>
            <Typography.Text variant="supporting">
                Pill, circular, square-ish, and a rounded square with a 1px border.
            </Typography.Text>
            <ComponentPreview code={ShapesSrc}>
                <Shapes />
            </ComponentPreview>
        </div>

        <div id="variant-primary" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Primary </Typography.H3>
            <ComponentPreview code={VariantPrimarySrc}>
                <VariantPrimary />
            </ComponentPreview>
        </div>

        <div id="variant-secondary" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Secondary </Typography.H3>
            <ComponentPreview code={VariantSecondarySrc}>
                <VariantSecondary />
            </ComponentPreview>
        </div>

        <div id="variant-ghost" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Ghost </Typography.H3>
            <ComponentPreview code={VariantGhostSrc}>
                <VariantGhost />
            </ComponentPreview>
        </div>

        <div id="variant-outline" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Outline </Typography.H3>
            <ComponentPreview code={VariantOutlineSrc}>
                <VariantOutline />
            </ComponentPreview>
        </div>

        <div id="variant-destructive" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Destructive </Typography.H3>
            <ComponentPreview code={VariantDestructiveSrc}>
                <VariantDestructive />
            </ComponentPreview>
        </div>

        <div id="variant-info" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Info </Typography.H3>
            <ComponentPreview code={VariantInfoSrc}>
                <VariantInfo />
            </ComponentPreview>
        </div>

        <div id="variant-success" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Success </Typography.H3>
            <ComponentPreview code={VariantSuccessSrc}>
                <VariantSuccess />
            </ComponentPreview>
        </div>

        <div id="variant-warning" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Warning </Typography.H3>
            <ComponentPreview code={VariantWarningSrc}>
                <VariantWarning />
            </ComponentPreview>
        </div>

        <div id="variant-error" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Error </Typography.H3>
            <ComponentPreview code={VariantErrorSrc}>
                <VariantError />
            </ComponentPreview>
        </div>
    </section>
</div>
