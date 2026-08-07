<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import CustomTrigger from './examples/custom-trigger.svelte';
    import CustomTriggerSrc from './examples/custom-trigger.svelte?raw';
    import Grouped from './examples/grouped.svelte';
    import GroupedSrc from './examples/grouped.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const TITLE = 'Fullscreen Nav';
    const SLUG = 'fullscreen-nav';
    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="A mobile-focused navigation menu that fills the viewport." />
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
                A mobile navigation menu that opens as a focused, full-viewport layer.
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
            Compose the menu from a trigger, full-screen content, grouped links, and an optional
            close control.
        </p>
        <CodeBlock
            code={`import * as FullscreenNav from '$lib/sivir/components/fullscreen-nav';

<FullscreenNav.Root>
  <FullscreenNav.Trigger />
  <FullscreenNav.Content label="Site navigation">
    <FullscreenNav.Close />
    <FullscreenNav.Group heading="Menu">
      <FullscreenNav.Link href="/">Home</FullscreenNav.Link>
      <FullscreenNav.Link href="/docs">Docs</FullscreenNav.Link>
    </FullscreenNav.Group>
  </FullscreenNav.Content>
</FullscreenNav.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <section id="behavior" class="scroll-mt-20 flex flex-col gap-3">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Behavior
        </h2>
        <ul class="flex list-disc flex-col gap-2 pl-5 text-sm text-foreground-muted">
            <li>Focus is trapped inside the menu and restored to the trigger after it closes.</li>
            <li>Page scrolling is locked while the navigation is open.</li>
            <li>Press Escape, use Close, or activate a Link to dismiss the menu.</li>
            <li>
                Pass a descriptive label to Content when the default navigation label is not
                specific enough.
            </li>
        </ul>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Keep the menu structure close to the information architecture it represents.
            </p>
        </div>

        <div id="grouped-navigation" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Grouped navigation
            </h3>
            <p class="text-sm text-foreground-muted">
                Separate product destinations from documentation and community links with named
                groups.
            </p>
            <ComponentPreview code={GroupedSrc}>
                <Grouped />
            </ComponentPreview>
        </div>

        <div id="custom-trigger" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Custom trigger
            </h3>
            <p class="text-sm text-foreground-muted">
                Pass content to Trigger to pair the menu icon with a visible label without changing
                its behavior.
            </p>
            <ComponentPreview code={CustomTriggerSrc}>
                <CustomTrigger />
            </ComponentPreview>
        </div>
    </section>
</div>
