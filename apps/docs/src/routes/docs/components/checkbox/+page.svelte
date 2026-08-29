<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Checked from './examples/checked.svelte';
    import CheckedSrc from './examples/checked.svelte?raw';
    import Disabled from './examples/disabled.svelte';
    import DisabledSrc from './examples/disabled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import LabelOnly from './examples/label-only.svelte';
    import LabelOnlySrc from './examples/label-only.svelte?raw';
    import WithDescription from './examples/with-description.svelte';
    import WithDescriptionSrc from './examples/with-description.svelte?raw';

    const TITLE = 'Checkbox';
    const SLUG = 'checkbox';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="A binary option presented as a labeled box." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A checkbox with an optional label and description. Bindable and disableable.
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
            Import and use the Checkbox component:
        </Typography.Text>
        <CodeBlock
            code={`import { Checkbox } from '$lib/sivir/components/checkbox';\n\nlet checked = $state();\n\n<Checkbox bind:checked label="Accept" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Label only -->
        <div id="label-only" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Label only </Typography.H3>
            <ComponentPreview code={LabelOnlySrc}>
                <LabelOnly />
            </ComponentPreview>
        </div>

        <!-- With description -->
        <div id="with-description" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With description </Typography.H3>
            <ComponentPreview code={WithDescriptionSrc}>
                <WithDescription />
            </ComponentPreview>
        </div>

        <!-- Disabled -->
        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Disabled </Typography.H3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>

        <!-- Checked -->
        <div id="checked" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Checked </Typography.H3>
            <ComponentPreview code={CheckedSrc}>
                <Checked />
            </ComponentPreview>
        </div>
    </section>
</div>
