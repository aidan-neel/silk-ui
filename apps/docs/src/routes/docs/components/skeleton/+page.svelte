<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Card from './examples/card.svelte';
    import CardSrc from './examples/card.svelte?raw';
    import Circle from './examples/circle.svelte';
    import CircleSrc from './examples/circle.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Rectangle from './examples/rectangle.svelte';
    import RectangleSrc from './examples/rectangle.svelte?raw';

    const TITLE = 'Skeleton';

    const installCommand = 'bunx @sivir-ui/svelte add skeleton';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Loading content without flicker or layout shift." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Delay the placeholder, hold it long enough to read, then swap into reserved content.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} refreshable>
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
            Use <Typography.InlineCode>SkeletonSwap</Typography.InlineCode> around asynchronous
            content. Fast responses skip the placeholder; once shown, it stays visible long enough
            to avoid a flash.
        </Typography.Text>
        <CodeBlock
            code={`import { SkeletonSwap } from '$lib/sivir/components/skeleton';

<SkeletonSwap ready={profile !== null} lines={3} label="Profile">
  {#if profile}<p>{profile.bio}</p>{/if}
</SkeletonSwap>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Use the static Skeleton primitive when you need to compose a custom placeholder.
            </Typography.Text>
        </div>

        <!-- Rectangle -->
        <div id="rectangle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Rectangle</Typography.H3>
            <ComponentPreview code={RectangleSrc}>
                <Rectangle />
            </ComponentPreview>
        </div>

        <!-- Circle -->
        <div id="circle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Circle</Typography.H3>
            <ComponentPreview code={CircleSrc}>
                <Circle />
            </ComponentPreview>
        </div>

        <!-- Card composition -->
        <div id="card" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Card composition</Typography.H3>
            <ComponentPreview code={CardSrc}>
                <Card />
            </ComponentPreview>
        </div>
    </section>
</div>
