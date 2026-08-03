<script lang="ts">
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import RoleVariants from './examples/role-variants.svelte';
    import RoleVariantsSrc from './examples/role-variants.svelte?raw';
    import States from './examples/states.svelte';
    import StatesSrc from './examples/states.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add message';
    const usageSnippet = `import * as Message from '@sivir-ui/svelte/components/message';

<Message.Root from="assistant" status="idle">
  <Message.Content>
    I found three sources that agree on the release date.
  </Message.Content>
  <Message.Actions aria-label="Assistant response actions">
    <!-- Add labeled actions such as copy or rate -->
  </Message.Actions>
</Message.Root>`;
</script>

<svelte:head>
    <title>Sivir · Message</title>
    <meta
        name="description"
        content="Content-first conversation messages with readable role-aware alignment and contextual actions."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Message
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                Present user, assistant, and system output without adding identity chrome to every
                turn.
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
            <code>Content</code> adapts its layout to <code>from</code>. Use <code>status</code> for streaming
            or failed output, and give every icon-only action an accessible label.
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
                Use role and status to communicate structure before adding custom presentation.
            </p>
        </div>

        <div id="role-variants" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Role variants
            </h3>
            <ComponentPreview code={RoleVariantsSrc}><RoleVariants /></ComponentPreview>
        </div>

        <div id="message-states" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Streaming and error states
            </h3>
            <ComponentPreview code={StatesSrc}><States /></ComponentPreview>
        </div>
    </section>
</div>
