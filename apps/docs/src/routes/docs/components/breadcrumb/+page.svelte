<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Separators from './examples/separators.svelte';
    import SeparatorsSrc from './examples/separators.svelte?raw';
    import WithIcon from './examples/with-icon.svelte';
    import WithIconSrc from './examples/with-icon.svelte?raw';

    const TITLE = 'Breadcrumb';
    const SLUG = 'breadcrumb';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A trail of links showing the user's position in a hierarchy."
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
                A trail of links showing the current position in a hierarchy.
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
            Import and use the Breadcrumb components:
        </Typography.Text>
        <CodeBlock
            code={`import * as Breadcrumb from '$lib/sivir/components/breadcrumb';\n\n<Breadcrumb.Root>\n  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>\n  <Breadcrumb.Separator>/</Breadcrumb.Separator>\n  <Breadcrumb.Item>Current</Breadcrumb.Item>\n</Breadcrumb.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Separator styles -->
        <div id="separators" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Separator styles </Typography.H3>
            <ComponentPreview code={SeparatorsSrc}>
                <Separators />
            </ComponentPreview>
        </div>

        <!-- With home icon -->
        <div id="with-icon" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With home icon </Typography.H3>
            <ComponentPreview code={WithIconSrc}>
                <WithIcon />
            </ComponentPreview>
        </div>
    </section>
</div>
