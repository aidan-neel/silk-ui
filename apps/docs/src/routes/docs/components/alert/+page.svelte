<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';

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
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                {TITLE}
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                An inline callout for contextual messages. Comes in four variants.
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
        <p class="text-sm text-foreground-muted">Import and use the Alert components:</p>
        <CodeBlock
            code={`import * as Alert from '$lib/sivir/components/alert';\n\n<Alert.Root>\n  <Alert.Title>Title</Alert.Title>\n  <Alert.Description>Description</Alert.Description>\n</Alert.Root>`}
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
        </div>

        <!-- Variants — each its own example piece -->
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
