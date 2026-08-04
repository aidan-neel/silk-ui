<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';
import Hero from './examples/hero.svelte';
import HeroSrc from './examples/hero.svelte?raw';

const installCommand = 'bunx @sivir-ui/svelte add task-steps';
</script>

<svelte:head>
    <title>Sivir · Task Steps</title>
    <meta name="description" content="Narrate ordered asynchronous work without noisy updates." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Task Steps
            </h1>
            <p class="mt-2 max-w-2xl text-[1rem] leading-relaxed text-foreground-muted">
                The system narrates its work one settled step at a time.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} refreshable><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2 class="docs-section-heading">Installation</h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2 class="docs-section-heading">Usage</h2>
        <p class="text-sm text-foreground-muted">
            Set <code>current</code> to the running step. Values before it are complete; the array length
            means the whole run is complete.
        </p>
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
