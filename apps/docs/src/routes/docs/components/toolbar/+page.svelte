<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Toolbar </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A semantic action row for the controls beneath a message composer, reply field, or
                note editor.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Place Toolbar inside Textarea to create one composer surface. Give the Toolbar an
            accessible label that describes its actions.
        </Typography.Text>
        <CodeBlock
            code={`import { Textarea } from '@sivir-ui/svelte/components/textarea';\nimport { Toolbar } from '@sivir-ui/svelte/components/toolbar';\n\n<Textarea autoresize aria-label="New message">\n\t<Toolbar aria-label="Message actions">\n\t\t<!-- Icon actions and send control -->\n\t</Toolbar>\n</Textarea>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Compose the action row with the controls your workflow needs.
            </Typography.Text>
        </div>

        <div id="issue-reply" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Issue reply</Typography.H3>
            <ComponentPreview code={ReplySrc}>
                <Reply />
            </ComponentPreview>
        </div>

        <div id="support-reply" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Support reply</Typography.H3>
            <ComponentPreview code={SupportNoteSrc}>
                <SupportNote />
            </ComponentPreview>
        </div>
    </section>
</div>
