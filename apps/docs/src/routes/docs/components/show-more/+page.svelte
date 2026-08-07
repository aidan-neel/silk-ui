<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import Capped from './examples/capped.svelte';
    import CappedSrc from './examples/capped.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Show More';
    const installCommand = 'bunx @sivir-ui/svelte add show-more';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Clamp long content and reveal the rest on demand." />
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
                class="mt-2 max-w-2xl text-[1rem] font-[var(--font-weight-description,450)] text-foreground-muted leading-relaxed"
            >
                Keeps long content scannable, then reveals the complete detail in place.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
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
            The disclosure is shown only when content exceeds <code>lines</code>. Bind
            <code>expanded</code>
            when another control needs to coordinate the state.
        </p>
        <CodeBlock
            code={`import { ShowMore } from '$lib/sivir/components/show-more';

let expanded = $state(false);

<ShowMore bind:expanded lines={3} maxHeight={320} label="Release notes">
  <p>{releaseNotes}</p>
</ShowMore>`}
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

        <div id="capped" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Capped content
            </h3>
            <p class="text-sm text-foreground-muted">
                When expanded content exceeds <code>maxHeight</code>, it becomes a
                keyboard-focusable scroll region.
            </p>
            <ComponentPreview code={CappedSrc}>
                <Capped />
            </ComponentPreview>
        </div>
    </section>
</div>
