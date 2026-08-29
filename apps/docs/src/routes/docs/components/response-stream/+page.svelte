<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Response Stream';
    const SLUG = 'response-stream';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="Animate AI response text with typewriter and word-fade modes."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Render complete responses at a chosen pace, while asynchronously arriving AI chunks
                appear immediately as the model yields them.
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
        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Live responses</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    Pass the async iterable returned by your model. Chunks render as soon as they
                    arrive.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';\n\n<ResponseStream textStream={modelResponse} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <Typography.H3>Complete responses</Typography.H3>
                <Typography.Text variant="supporting" class="mt-1">
                    For a complete string, use
                    <Typography.InlineCode>speed</Typography.InlineCode>
                    from 1 (slowest) to 100 (fastest) to control the reveal pace.
                </Typography.Text>
            </div>
            <CodeBlock
                code={`<ResponseStream textStream="Draft saved." speed={70} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>
    </section>
</div>
