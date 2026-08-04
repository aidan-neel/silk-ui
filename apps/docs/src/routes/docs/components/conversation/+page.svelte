<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';
import EmptyState from './examples/empty-state.svelte';
import EmptyStateSrc from './examples/empty-state.svelte?raw';
import FollowOutput from './examples/follow-output.svelte';
import FollowOutputSrc from './examples/follow-output.svelte?raw';
import Hero from './examples/hero.svelte';
import HeroSrc from './examples/hero.svelte?raw';

const installCommand = 'bunx @sivir-ui/svelte add conversation';
const usageSnippet = `import * as Conversation from '@sivir-ui/svelte/components/conversation';
import * as Message from '@sivir-ui/svelte/components/message';

let follow = $state(true);

<Conversation.Root bind:follow class="h-[32rem]">
  <Conversation.Content aria-label="Support conversation">
    <Message.Root from="assistant">
      <Message.Content>I found the failed request.</Message.Content>
    </Message.Root>
  </Conversation.Content>
  <Conversation.ScrollButton />
</Conversation.Root>`;
</script>

<svelte:head>
    <title>Sivir · Conversation</title>
    <meta
        name="description"
        content="An auto-following, accessible conversation viewport with empty and jump-to-latest states."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Conversation
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
            >
                Keep live agent transcripts readable while respecting where someone has chosen to
                scroll.
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
            Give <code>Root</code> a bounded height so <code>Content</code> can scroll. Bind
            <code>follow</code> when the surrounding interface needs to reflect whether new output is
            being followed.
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
                Compose the viewport around an empty start or continuously arriving output.
            </p>
        </div>

        <div id="empty-state" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Empty state
            </h3>
            <ComponentPreview code={EmptyStateSrc}><EmptyState /></ComponentPreview>
        </div>

        <div id="follow-output" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Follow live output
            </h3>
            <ComponentPreview code={FollowOutputSrc}><FollowOutput /></ComponentPreview>
        </div>
    </section>
</div>
