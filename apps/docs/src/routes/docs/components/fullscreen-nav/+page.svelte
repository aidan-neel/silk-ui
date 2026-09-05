<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A mobile navigation menu that opens as a focused, full-viewport layer.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Compose the menu from a trigger, full-screen content, grouped links, and an optional
            close control.
        </Typography.Text>
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
        <Typography.H2 class="docs-section-heading"> Behavior </Typography.H2>
        <ul class="flex list-disc flex-col gap-2 pl-5 text-sm text-foreground-muted">
            <li>Focus is trapped inside the menu and restored to the trigger after it closes.</li>
            <li>Page scrolling is locked while the navigation is open.</li>
            <li>Press Escape, use Close, or activate a Link to dismiss the menu.</li>
            <li>
                Links are sized for touch, scale on press, and give a short haptic pulse on tap.
            </li>
            <li>
                Pass a descriptive label to Content when the default navigation label is not
                specific enough.
            </li>
        </ul>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Keep the menu structure close to the information architecture it represents.
            </Typography.Text>
        </div>

        <div id="grouped-navigation" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Grouped navigation </Typography.H3>
            <Typography.Text variant="supporting">
                Separate product destinations from documentation and community links with named
                groups.
            </Typography.Text>
            <ComponentPreview code={GroupedSrc}>
                <Grouped />
            </ComponentPreview>
        </div>

        <div id="custom-trigger" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Custom trigger </Typography.H3>
            <Typography.Text variant="supporting">
                Pass content to Trigger to pair the menu icon with a visible label without changing
                its behavior.
            </Typography.Text>
            <ComponentPreview code={CustomTriggerSrc}>
                <CustomTrigger />
            </ComponentPreview>
        </div>
    </section>
</div>
