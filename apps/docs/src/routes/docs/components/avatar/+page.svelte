<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Shapes from './examples/shapes.svelte';
    import ShapesSrc from './examples/shapes.svelte?raw';
    import Sizes from './examples/sizes.svelte';
    import SizesSrc from './examples/sizes.svelte?raw';
    import WithImage from './examples/with-image.svelte';
    import WithImageSrc from './examples/with-image.svelte?raw';

    const TITLE = 'Avatar';
    const SLUG = 'avatar';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="An image with graceful fallback to initials." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                An image with initials as a fallback. Comes in two shapes and several sizes.
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
        <Typography.Text variant="supporting">Import and use the Avatar component:</Typography.Text>
        <CodeBlock
            code={`import * as Avatar from '$lib/sivir/components/avatar';\n\n<Avatar.Root>\n  <Avatar.Image src="/avatar.jpg" alt="User" />\n  <Avatar.Fallback>AB</Avatar.Fallback>\n</Avatar.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Sizes -->
        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Sizes </Typography.H3>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
            </ComponentPreview>
        </div>

        <!-- Shapes -->
        <div id="shapes" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Shapes </Typography.H3>
            <ComponentPreview code={ShapesSrc}>
                <Shapes />
            </ComponentPreview>
        </div>

        <!-- With image -->
        <div id="with-image" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With image </Typography.H3>
            <ComponentPreview code={WithImageSrc}>
                <WithImage />
            </ComponentPreview>
        </div>
    </section>
</div>
