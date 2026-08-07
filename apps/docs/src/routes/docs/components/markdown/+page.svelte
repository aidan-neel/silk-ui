<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import SafeHtml from './examples/safe-html.svelte';
    import SafeHtmlSrc from './examples/safe-html.svelte?raw';
    import Streaming from './examples/streaming.svelte';
    import StreamingSrc from './examples/streaming.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add markdown';
    const usageSnippet = `import { Markdown } from '@sivir-ui/svelte/components/markdown';

const content = [
  '## Result',
  '',
  '| File | Status |',
  '| --- | --- |',
  '| app.ts | Updated |',
  '',
  '- [x] Run checks'
].join('\\n');

<Markdown {content} />`;
</script>

<svelte:head>
    <title>Sivir · Markdown</title>
    <meta
        name="description"
        content="A safe GFM renderer for polished agent prose, tables, task lists, links, and code."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Markdown
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                Render structured agent output with safe links, useful typography, and first-class
                code blocks.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            The GFM lexer supports tables, task lists, and strikethrough. Fenced code is rendered
            with Sivir <code>CodeBlock</code>, and raw HTML is always displayed as text instead of
            being injected into the page.
        </p>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Show incomplete output honestly and keep untrusted model content inert.
            </p>
        </div>

        <div id="streaming" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Streaming response
            </h3>
            <ComponentPreview code={StreamingSrc}><Streaming /></ComponentPreview>
        </div>

        <div id="safe-html" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Raw HTML safety
            </h3>
            <ComponentPreview code={SafeHtmlSrc}><SafeHtml /></ComponentPreview>
        </div>
    </section>
</div>
