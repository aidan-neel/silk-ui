<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Left from './examples/left.svelte';
    import LeftSrc from './examples/left.svelte?raw';
    import Right from './examples/right.svelte';
    import RightSrc from './examples/right.svelte?raw';

    const TITLE = 'Sheet';

    const installCommand = 'bunx @sivir-ui/svelte add sheet';
</script>

<svelte:head>
    <title>Sivir · Sheet</title>
    <meta
        name="description"
        content="An edge-anchored drawer for mobile menus, filters, and side panels."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A drawer that slides in from any side of the screen.
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
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Import Sheet and compose it with sub-components:
        </Typography.Text>
        <CodeBlock
            code={`import * as Sheet from '$lib/sivir/components/sheet';\n\n<Sheet.Root>\n  <Sheet.Trigger>Open</Sheet.Trigger>\n  <Sheet.Content>\n    <Sheet.Header>\n      <Sheet.Title>Title</Sheet.Title>\n    </Sheet.Header>\n    {/* content */}\n  </Sheet.Content>\n</Sheet.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Sheet with different sides and compositions.
            </Typography.Text>
        </div>

        <!-- Left side -->
        <div id="left" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Left side</Typography.H3>
            <ComponentPreview code={LeftSrc}>
                <Left />
            </ComponentPreview>
        </div>

        <!-- Right side -->
        <div id="right" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Right side</Typography.H3>
            <ComponentPreview code={RightSrc}>
                <Right />
            </ComponentPreview>
        </div>
    </section>
</div>
