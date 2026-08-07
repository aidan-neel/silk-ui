<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview } from '$lib/components/docs';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Reply from './examples/reply.svelte';
    import ReplySrc from './examples/reply.svelte?raw';
    import SupportNote from './examples/support-note.svelte';
    import SupportNoteSrc from './examples/support-note.svelte?raw';
</script>

<svelte:head>
    <title>Sivir · Toolbar</title>
    <meta
        name="description"
        content="A semantic action row for message composers, replies, and other text entry surfaces."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Toolbar
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                A semantic action row for the controls beneath a message composer, reply field, or
                note editor.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            Place Toolbar inside Textarea to create one composer surface. Give the Toolbar an
            accessible label that describes its actions.
        </p>
        <CodeBlock
            code={`import { Textarea } from '@sivir-ui/svelte/components/textarea';\nimport { Toolbar } from '@sivir-ui/svelte/components/toolbar';\n\n<Textarea autoresize aria-label="New message">\n\t<Toolbar aria-label="Message actions">\n\t\t<!-- Icon actions and send control -->\n\t</Toolbar>\n</Textarea>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Compose the action row with the controls your workflow needs.
            </p>
        </div>

        <div id="issue-reply" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Issue reply
            </h3>
            <ComponentPreview code={ReplySrc}>
                <Reply />
            </ComponentPreview>
        </div>

        <div id="support-reply" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Support reply
            </h3>
            <ComponentPreview code={SupportNoteSrc}>
                <SupportNote />
            </ComponentPreview>
        </div>
    </section>
</div>
