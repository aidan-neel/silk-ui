<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Adornments from './examples/adornments.svelte';
    import AdornmentsSrc from './examples/adornments.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Validation from './examples/validation.svelte';
    import ValidationSrc from './examples/validation.svelte?raw';
    import VariantOutline from './examples/variant-outline.svelte';
    import VariantOutlineSrc from './examples/variant-outline.svelte?raw';
    import VariantSecondary from './examples/variant-secondary.svelte';
    import VariantSecondarySrc from './examples/variant-secondary.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add input';
</script>

<svelte:head>
    <title>Sivir · Input</title>
    <meta
        name="description"
        content="Text input with labels, helper text, leading and trailing adornments, visual variants, and native validation."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Input </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A text field with optional labels, helper text, and decorative adornments. Comes in
                two variants.
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
            Import the Input and use it in your component:
        </Typography.Text>
        <CodeBlock
            code={`import { Input } from '$lib/sivir/components/input';\n\n<Input label="Email" placeholder="you@example.com" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Add context with adornments, choose a visual variant, and use native validation.
            </Typography.Text>
        </div>

        <div id="adornments" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Adornments </Typography.H3>
            <Typography.Text variant="supporting">
                Use non-interactive leading and trailing snippets with text-entry inputs for icons,
                units, or short context.
            </Typography.Text>
            <ComponentPreview code={AdornmentsSrc}>
                <Adornments />
            </ComponentPreview>
        </div>

        <!-- Variants -->
        <div id="variant-outline" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Outline </Typography.H3>
            <ComponentPreview code={VariantOutlineSrc}>
                <VariantOutline />
            </ComponentPreview>
        </div>

        <div id="variant-secondary" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Secondary </Typography.H3>
            <ComponentPreview code={VariantSecondarySrc}>
                <VariantSecondary />
            </ComponentPreview>
        </div>

        <div id="validation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Validation </Typography.H3>
            <Typography.Text variant="supporting">
                Use native constraints with error messages that respond to blur and form submission.
            </Typography.Text>
            <ComponentPreview code={ValidationSrc}>
                <Validation />
            </ComponentPreview>
        </div>
    </section>
</div>
