<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Compound from './examples/compound.svelte';
    import CompoundSrc from './examples/compound.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Stacked from './examples/stacked.svelte';
    import StackedSrc from './examples/stacked.svelte?raw';
    import WithoutLineNumbers from './examples/without-line-numbers.svelte';
    import WithoutLineNumbersSrc from './examples/without-line-numbers.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add file-diff';

    const usageSnippet = `import * as FileDiff from '$lib/sivir/components/file-diff';

<FileDiff.Root file="src/auth.ts" lang="ts" diff={[
  { type: 'context', oldLineNumber: 12, newLineNumber: 12, content: 'export function getToken() {' },
  { type: 'remove', oldLineNumber: 13, content: '  return localStorage.token;' },
  { type: 'add', newLineNumber: 13, content: '  const t = cookies.get("session");' },
]} />`;
</script>

<svelte:head>
    <title>Sivir · File Diff</title>
    <meta
        name="description"
        content="Unified file diff with a path top bar, addition and deletion counts, dual line-number gutters, and per-row syntax highlighting."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> File Diff </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A unified diff viewer with a file top bar, change counts, and highlighted rows.
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
        <Typography.Text variant="supporting">
            The component depends on
            <Typography.InlineCode>highlight.js</Typography.InlineCode>. Install it if your project
            doesn't have it yet:
        </Typography.Text>
        <InstallCommand command="bun add highlight.js" />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Pass a <Typography.InlineCode>diff</Typography.InlineCode> array for the high-level
            form, or compose
            <Typography.InlineCode>TopBar</Typography.InlineCode>,
            <Typography.InlineCode>Content</Typography.InlineCode>, and
            <Typography.InlineCode>Row</Typography.InlineCode>
            by hand. A bare
            <Typography.InlineCode>TopBar</Typography.InlineCode>
            renders filename and counts; pass children to take over the row with
            <Typography.InlineCode>Filename</Typography.InlineCode>,
            <Typography.InlineCode>PlusMinus</Typography.InlineCode>, and your own actions. Addition
            and deletion counts are derived from the diff unless you pass them explicitly.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                From a single high-level diff to fully composed rows and stacked files.
            </Typography.Text>
        </div>

        <div id="compound" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Compound API </Typography.H3>
            <Typography.Text variant="supporting">
                Drop down to rows when you need a custom top-bar action or explicit counts.
                Recompose the header from
                <Typography.InlineCode>Filename</Typography.InlineCode>
                and
                <Typography.InlineCode>PlusMinus</Typography.InlineCode>
                parts.
            </Typography.Text>
            <ComponentPreview code={CompoundSrc}>
                <Compound />
            </ComponentPreview>
        </div>

        <div id="without-line-numbers" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Without line numbers </Typography.H3>
            <Typography.Text variant="supporting">
                Hide both gutters for compact embeds. The sign column stays so additions and
                deletions remain distinguishable without color.
            </Typography.Text>
            <ComponentPreview code={WithoutLineNumbersSrc}>
                <WithoutLineNumbers />
            </ComponentPreview>
        </div>

        <div id="stacked" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Stacked files </Typography.H3>
            <Typography.Text variant="supporting">
                Render one Root per file for pull-request style views. Each diff keeps its own
                language and counts.
            </Typography.Text>
            <ComponentPreview code={StackedSrc}>
                <Stacked />
            </ComponentPreview>
        </div>
    </section>
</div>
