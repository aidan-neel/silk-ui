<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';

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
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Attachment
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] leading-relaxed font-[var(--font-weight-description,450)] text-foreground-muted"
            >
                Select, validate, preview, and remove local files before your application uploads
                them.
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
            Bind selected files on the root and report rejected files from <code>onReject</code>.
            Selection is local only; your application owns uploading and upload state.
        </p>
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
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Render standalone items when your upload client owns progress and completion state.
            </p>
        </div>

        <div id="status-variants" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Upload status
            </h3>
            <ComponentPreview code={StatusVariantsSrc}><StatusVariants /></ComponentPreview>
        </div>
    </section>
</div>
