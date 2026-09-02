<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Basic from './examples/basic.svelte';
    import BasicSrc from './examples/basic.svelte?raw';
    import Context from './examples/context.svelte';
    import ContextSrc from './examples/context.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Modifiers from './examples/modifiers.svelte';
    import ModifiersSrc from './examples/modifiers.svelte?raw';

    const TITLE = 'Shortcut';

    const installCommand = 'bunx @sivir-ui/svelte add shortcut';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Inline keyboard-shortcut badge." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A key chip for keyboard shortcuts, including inside buttons.
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
            Import Shortcut and pass a keyboard shortcut string:
        </Typography.Text>
        <CodeBlock
            code={`import Shortcut from '$lib/sivir/components/shortcut';\n\n<Shortcut shortcut="cmd+K" />\n<Shortcut shortcut="shift+/" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Shortcut in various compositions and contexts.
            </Typography.Text>
        </div>

        <!-- Basic -->
        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Basic</Typography.H3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <!-- With modifiers -->
        <div id="modifiers" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">With modifiers</Typography.H3>
            <ComponentPreview code={ModifiersSrc}>
                <Modifiers />
            </ComponentPreview>
        </div>

        <!-- In context -->
        <div id="context" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">In context</Typography.H3>
            <ComponentPreview code={ContextSrc}>
                <Context />
            </ComponentPreview>
        </div>
    </section>
</div>
