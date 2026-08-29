<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import AllTypes from './examples/all-types.svelte';
    import AllTypesSrc from './examples/all-types.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add toast';
</script>

<svelte:head>
    <title>Sivir · Toast</title>
    <meta name="description" content="Transient notifications fired from anywhere in your app." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Toast </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A notification that stacks, auto-dismisses, and can carry an action.
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
            Import and fire toasts from your component:
        </Typography.Text>
        <CodeBlock
            code={`import { toast } from '$lib/sivir/components/toast';\n\ntoast.success('Profile updated', {\n  description: 'Your changes have been saved.'\n});\ntoast.error('Request failed', {\n  description: 'Could not connect.'\n});`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Toast variants for different notification types.
            </Typography.Text>
        </div>

        <div id="types" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">All types</Typography.H3>
            <ComponentPreview code={AllTypesSrc}>
                <AllTypes />
            </ComponentPreview>
        </div>
    </section>
</div>
