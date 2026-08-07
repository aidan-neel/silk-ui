<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
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
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Badge
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                A compact label for status, counts, and tags.
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
        <p class="text-sm text-foreground-muted">Import the Badge and use it in your component:</p>
        <CodeBlock
            code={`import { Badge } from '$lib/sivir/components/badge';\n\n<Badge>New</Badge>\n<Badge variant="outline" dot>Label</Badge>\n<Badge variant="success">Active</Badge>\n<Badge variant="error">Failed</Badge>`}
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
                Explore Badge variants for different use cases.
            </p>
        </div>

        <div id="variant-primary" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Primary
            </h3>
            <ComponentPreview code={VariantPrimarySrc}>
                <VariantPrimary />
            </ComponentPreview>
        </div>

        <div id="variant-secondary" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Secondary
            </h3>
            <ComponentPreview code={VariantSecondarySrc}>
                <VariantSecondary />
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

        <div id="variant-outline" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Outline
            </h3>
            <ComponentPreview code={VariantOutlineSrc}>
                <VariantOutline />
            </ComponentPreview>
        </div>

        <div id="variant-destructive" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Destructive
            </h3>
            <ComponentPreview code={VariantDestructiveSrc}>
                <VariantDestructive />
            </ComponentPreview>
        </div>

        <div id="variant-info" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Info
            </h3>
            <ComponentPreview code={VariantInfoSrc}>
                <VariantInfo />
            </ComponentPreview>
        </div>

        <div id="variant-success" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Success
            </h3>
            <ComponentPreview code={VariantSuccessSrc}>
                <VariantSuccess />
            </ComponentPreview>
        </div>

        <div id="variant-warning" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Warning
            </h3>
            <ComponentPreview code={VariantWarningSrc}>
                <VariantWarning />
            </ComponentPreview>
        </div>

        <div id="variant-error" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Error
            </h3>
            <ComponentPreview code={VariantErrorSrc}>
                <VariantError />
            </ComponentPreview>
        </div>
    </section>
</div>
