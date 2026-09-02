<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Conversation </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Keep live agent transcripts readable while respecting where someone has chosen to
                scroll.
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
            Give <Typography.InlineCode>Root</Typography.InlineCode> a bounded height so
            <Typography.InlineCode>Content</Typography.InlineCode>
            can scroll. Bind
            <Typography.InlineCode>follow</Typography.InlineCode>
            when the surrounding interface needs to reflect whether new output is being followed.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Compose the viewport around an empty start or continuously arriving output.
            </Typography.Text>
        </div>

        <div id="empty-state" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Empty state </Typography.H3>
            <ComponentPreview code={EmptyStateSrc}><EmptyState /></ComponentPreview>
        </div>

        <div id="follow-output" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Follow live output </Typography.H3>
            <ComponentPreview code={FollowOutputSrc}><FollowOutput /></ComponentPreview>
        </div>
    </section>
</div>
