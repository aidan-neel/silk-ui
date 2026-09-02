<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import VariantError from './examples/variant-error.svelte';
    import VariantErrorSrc from './examples/variant-error.svelte?raw';
    import VariantInfo from './examples/variant-info.svelte';
    import VariantInfoSrc from './examples/variant-info.svelte?raw';
    import VariantSuccess from './examples/variant-success.svelte';
    import VariantSuccessSrc from './examples/variant-success.svelte?raw';
    import VariantWarning from './examples/variant-warning.svelte';
    import VariantWarningSrc from './examples/variant-warning.svelte?raw';

    const TITLE = 'Alert';
    const SLUG = 'alert';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Tinted callouts for inline status, confirmation, and warnings."
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
                An inline callout for contextual messages. Comes in four variants.
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
        <Typography.Text variant="supporting">Import and use the Alert components:</Typography.Text>
        <CodeBlock
            code={`import * as Alert from '$lib/sivir/components/alert';\n\n<Alert.Root>\n  <Alert.Title>Title</Alert.Title>\n  <Alert.Description>Description</Alert.Description>\n</Alert.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Variants — each its own example piece -->
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
