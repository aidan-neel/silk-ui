<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Streaming from './examples/streaming.svelte';
    import StreamingSrc from './examples/streaming.svelte?raw';

    const TITLE = 'Reasoning';
    const SLUG = 'reasoning';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta
        name="description"
        content="A concise, expandable reasoning trace for AI assistant responses."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>{TITLE}</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Give users useful visibility into an assistant’s work without placing its trace
                ahead of the answer. Reasoning stays compact until someone chooses to inspect it.
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
        <Typography.Text variant="supporting">
            Use <Typography.InlineCode>streaming</Typography.InlineCode> while the model is
            thinking; use <Typography.InlineCode>duration</Typography.InlineCode> when it completes.
        </Typography.Text>
        <CodeBlock
            code={`import * as Reasoning from '@sivir-ui/svelte/components/reasoning';

<Reasoning.Root>
  <Reasoning.Trigger title="Searched the release history" duration="2.4s" />
  <Reasoning.Content>
    <p>Compared the incident timestamp with the last five deployments.</p>
  </Reasoning.Content>
</Reasoning.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
        </div>
        <div id="incident-investigation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Incident investigation</Typography.H3>
            <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
        </div>
        <div id="live-reasoning" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Live reasoning</Typography.H3>
            <ComponentPreview code={StreamingSrc}><Streaming /></ComponentPreview>
        </div>
    </section>
</div>
