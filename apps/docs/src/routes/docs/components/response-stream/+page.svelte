<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
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
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                {TITLE}
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                Render complete responses at a chosen pace, while asynchronously arriving AI chunks
                appear immediately as the model yields them.
            </p>
        </div>
        <DocsPager />
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
        <div class="flex flex-col gap-3">
            <div>
                <h3 class="text-sm font-[var(--font-weight-header,600)] text-foreground">
                    Live responses
                </h3>
                <p class="mt-1 text-sm text-foreground-muted">
                    Pass the async iterable returned by your model. Chunks render as soon as they
                    arrive.
                </p>
            </div>
            <CodeBlock
                code={`import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';\n\n<ResponseStream textStream={modelResponse} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>

        <div class="flex flex-col gap-3">
            <div>
                <h3 class="text-sm font-[var(--font-weight-header,600)] text-foreground">
                    Complete responses
                </h3>
                <p class="mt-1 text-sm text-foreground-muted">
                    For a complete string, use <code>speed</code> from 1 (slowest) to 100 (fastest)
                    to control the reveal pace.
                </p>
            </div>
            <CodeBlock
                code={`<ResponseStream textStream="Draft saved." speed={70} />`}
                lang="svelte"
                copy="overlay"
            />
        </div>
    </section>
</div>
