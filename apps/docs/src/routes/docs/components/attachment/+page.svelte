<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import StatusVariants from './examples/status-variants.svelte';
    import StatusVariantsSrc from './examples/status-variants.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add attachment';
</script>

<svelte:head>
    <title>Sivir · Attachment</title>
    <meta
        name="description"
        content="Local file selection with drop handling, constraints, and composable attachment states."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Attachment </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Select, validate, preview, and remove local files before your application uploads
                them.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Bind selected files on the root and report rejected files from
            <Typography.InlineCode>onReject</Typography.InlineCode>. Selection is local only; your
            application owns uploading and upload state.
        </Typography.Text>
        <CodeBlock
            code={`import * as Attachment from '@sivir-ui/svelte/components/attachment';
import type { AttachmentRejection } from '@sivir-ui/svelte/components/attachment';

let files = $state<File[]>([]);

function handleReject(rejections: AttachmentRejection[]) {
  console.log(rejections);
}

<Attachment.Root
  bind:files
  accept="image/*,.pdf"
  maxFiles={3}
  maxSize={5 * 1024 * 1024}
  onReject={handleReject}
>
  <Attachment.Trigger>Choose files</Attachment.Trigger>
  <Attachment.List />
</Attachment.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Render standalone items when your upload client owns progress and completion state.
            </Typography.Text>
        </div>

        <div id="status-variants" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Upload status </Typography.H3>
            <ComponentPreview code={StatusVariantsSrc}><StatusVariants /></ComponentPreview>
        </div>
    </section>
</div>
