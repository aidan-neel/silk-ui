<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add task-steps';
</script>

<svelte:head>
    <title>Sivir · Task Steps</title>
    <meta name="description" content="Narrate ordered asynchronous work without noisy updates." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Task Steps </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                The system narrates its work one settled step at a time.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} refreshable><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Set <Typography.InlineCode>current</Typography.InlineCode> to the running step. Values
            before it are complete; the array length means the whole run is complete.
        </Typography.Text>
        <CodeBlock
            lang="svelte"
            copy="overlay"
            code={`import { TaskSteps } from '@sivir-ui/svelte/components/task-steps';

<TaskSteps
  steps={[{ id: 'build', label: 'Building' }, { id: 'test', label: 'Testing' }]}
  current={1}
  label="Deploy progress"
/>`}
        />
    </section>
</div>
