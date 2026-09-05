<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Controlled from './examples/controlled.svelte';
    import ControlledSrc from './examples/controlled.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import MaxTags from './examples/max-tags.svelte';
    import MaxTagsSrc from './examples/max-tags.svelte?raw';
    import Validation from './examples/validation.svelte';
    import ValidationSrc from './examples/validation.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add tag-input';

    const usageSnippet = `import * as TagInput from '$lib/sivir/components/tag-input';

let tags = $state(['svelte']);

<TagInput.Root bind:tags label="Topics">
  <TagInput.List />
  <TagInput.Input placeholder="Add a topic…" />
</TagInput.Root>`;
</script>

<svelte:head>
    <title>Sivir · Tag Input</title>
    <meta
        name="description"
        content="Tokenized tag entry with keyboard commits, paste splitting, duplicates and max-tag guards, validation, and full form support."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Tag Input </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A field that turns typed text into removable tags. Type a value, press Enter, and
                keep going.
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
        <Typography.Text variant="supporting">
            Bind <Typography.InlineCode>tags</Typography.InlineCode> for the tag list. Compose
            <Typography.InlineCode>List</Typography.InlineCode>
            for the tokens and
            <Typography.InlineCode>Input</Typography.InlineCode>
            for entry inside
            <Typography.InlineCode>Root</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Read changes through callbacks, guard the list with validation, and cap it with a
                maximum.
            </Typography.Text>
        </div>

        <div id="controlled" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Responding to changes </Typography.H3>
            <Typography.Text variant="supporting">
                <Typography.InlineCode>onAdd</Typography.InlineCode>
                and
                <Typography.InlineCode>onRemove</Typography.InlineCode>
                report single-tag edits;
                <Typography.InlineCode>onTagsChange</Typography.InlineCode>
                reports the whole list.
            </Typography.Text>
            <ComponentPreview code={ControlledSrc}>
                <Controlled />
            </ComponentPreview>
        </div>

        <div id="validation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Validation </Typography.H3>
            <Typography.Text variant="supporting">
                Return <Typography.InlineCode>false</Typography.InlineCode> or an error message from
                <Typography.InlineCode>validate</Typography.InlineCode>
                to reject a tag. Rejections arrive through
                <Typography.InlineCode>onReject</Typography.InlineCode>
                with a human-readable reason.
            </Typography.Text>
            <ComponentPreview code={ValidationSrc}>
                <Validation />
            </ComponentPreview>
        </div>

        <div id="max-tags" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Limiting tags </Typography.H3>
            <Typography.Text variant="supporting">
                <Typography.InlineCode>max</Typography.InlineCode>
                caps the list. Extra tags are rejected with a
                <Typography.InlineCode>max-tags</Typography.InlineCode>
                reason.
            </Typography.Text>
            <ComponentPreview code={MaxTagsSrc}>
                <MaxTags />
            </ComponentPreview>
        </div>
    </section>
</div>
