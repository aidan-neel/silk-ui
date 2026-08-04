<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';

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
    <header class="flex flex-col gap-4">
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
                Give users useful visibility into an assistant’s work without placing its trace
                ahead of the answer. Reasoning stays compact until someone chooses to inspect it.
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
            Use <code>streaming</code> while the model is thinking; use <code>duration</code> when it
            completes.
        </p>
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
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
        </div>
        <div id="incident-investigation" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Incident investigation
            </h3>
            <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
        </div>
        <div id="live-reasoning" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Live reasoning
            </h3>
            <ComponentPreview code={StreamingSrc}><Streaming /></ComponentPreview>
        </div>
    </section>
</div>
