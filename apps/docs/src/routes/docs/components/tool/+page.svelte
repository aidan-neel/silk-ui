<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Quiet from './examples/quiet.svelte';
    import QuietSrc from './examples/quiet.svelte?raw';
    import ToolStates from './examples/tool-states.svelte';
    import ToolStatesSrc from './examples/tool-states.svelte?raw';

    const TITLE = 'Tool';
    const SLUG = 'tool';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Expandable AI tool calls designed for inline chat transcripts."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Group related tool calls into one compact task summary without overwhelming the
                transcript.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Use <Typography.InlineCode>Item</Typography.InlineCode> to list the commands, searches,
            and reads completed within a task.
        </Typography.Text>
        <CodeBlock
            code={`import * as Tool from '@sivir-ui/svelte/components/tool';\n\n<Tool.Root name="1 file, 1 search, and 1 command" state="complete" duration="6s" variant="quiet">\n  <Tool.Item name="Bash" detail="pnpm lint" />\n  <Tool.Item name="Grep" detail="InputBar" kind="search" />\n  <Tool.Item name="Read" detail="/lib/input-bar.tsx" kind="read" />\n</Tool.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>
        <div id="research-assistant" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Research assistant</Typography.H3>
            <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
        </div>
        <div id="tool-states" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">
                Tool states in a support flow
            </Typography.H3>
            <ComponentPreview code={ToolStatesSrc}><ToolStates /></ComponentPreview>
        </div>
        <div id="quiet" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Quiet</Typography.H3>
            <Typography.Text variant="supporting">
                Use <Typography.InlineCode>variant="quiet"</Typography.InlineCode> when tool details
                should stay visually secondary to the response.
            </Typography.Text>
            <ComponentPreview code={QuietSrc}><Quiet /></ComponentPreview>
        </div>
    </section>
</div>
