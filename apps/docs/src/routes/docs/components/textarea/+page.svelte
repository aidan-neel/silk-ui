<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';
import Basic from './examples/basic.svelte';
import BasicSrc from './examples/basic.svelte?raw';
import Disabled from './examples/disabled.svelte';
import DisabledSrc from './examples/disabled.svelte?raw';
import Hero from './examples/hero.svelte';
import HeroSrc from './examples/hero.svelte?raw';
import Labeled from './examples/labeled.svelte';
import LabeledSrc from './examples/labeled.svelte?raw';

const TITLE = 'Textarea';

const installCommand = 'bunx @sivir-ui/svelte add textarea';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Multi-line text input that shares Input's grammar." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                {TITLE}
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                A multi-line text input that shares the Input styling.
            </p>
        </div>
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            Import Textarea and bind its value. Add <code>autoresize</code> for message composers that
            grow with their content.
        </p>
        <CodeBlock
            code={`import { Textarea } from '$lib/sivir/components/textarea';\n\n<Textarea bind:value autoresize label="Message" />`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">Textarea in different configurations.</p>
        </div>

        <!-- Basic -->
        <div id="basic" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Basic
            </h3>
            <ComponentPreview code={BasicSrc}>
                <Basic />
            </ComponentPreview>
        </div>

        <!-- With label and description -->
        <div id="labeled" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                With label and description
            </h3>
            <ComponentPreview code={LabeledSrc}>
                <Labeled />
            </ComponentPreview>
        </div>

        <!-- Disabled -->
        <div id="disabled" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Disabled
            </h3>
            <ComponentPreview code={DisabledSrc}>
                <Disabled />
            </ComponentPreview>
        </div>
    </section>
</div>
