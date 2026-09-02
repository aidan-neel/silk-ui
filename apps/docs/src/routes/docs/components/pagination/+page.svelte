<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Siblings from './examples/siblings.svelte';
    import SiblingsSrc from './examples/siblings.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add pagination';
</script>

<svelte:head>
    <title>Sivir · Pagination</title>
    <meta
        name="description"
        content="A compact pager that truncates with an ellipsis. Always shows the first and last page so users know how big the data set is."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Pagination </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A compact pager that truncates long ranges with an ellipsis.
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
            Import the Pagination component and use it:
        </Typography.Text>
        <CodeBlock
            code={`import { Pagination } from '$lib/sivir/components/pagination';\n\nlet page = $state(1);\n\n<Pagination bind:page total={20} />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Tune how many pages surround the current one.
            </Typography.Text>
        </div>

        <div id="siblings" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Sibling count</Typography.H3>
            <ComponentPreview code={SiblingsSrc}>
                <Siblings />
            </ComponentPreview>
        </div>
    </section>
</div>
