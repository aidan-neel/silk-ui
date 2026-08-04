<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';
import Card from './examples/card.svelte';
import CardSrc from './examples/card.svelte?raw';
import Circle from './examples/circle.svelte';
import CircleSrc from './examples/circle.svelte?raw';
import Hero from './examples/hero.svelte';
import HeroSrc from './examples/hero.svelte?raw';
import Rectangle from './examples/rectangle.svelte';
import RectangleSrc from './examples/rectangle.svelte?raw';

const TITLE = 'Skeleton';

const installCommand = 'bunx @sivir-ui/svelte add skeleton';
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Loading content without flicker or layout shift." />
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
                Delay the placeholder, hold it long enough to read, then swap into reserved content.
            </p>
        </div>
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc} refreshable>
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
            Use <code>SkeletonSwap</code> around asynchronous content. Fast responses skip the placeholder;
            once shown, it stays visible long enough to avoid a flash.
        </p>
        <CodeBlock
            code={`import { SkeletonSwap } from '$lib/sivir/components/skeleton';

<SkeletonSwap ready={profile !== null} lines={3} label="Profile">
  {#if profile}<p>{profile.bio}</p>{/if}
</SkeletonSwap>`}
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
            <p class="mt-2 text-sm text-foreground-muted">
                Use the static Skeleton primitive when you need to compose a custom placeholder.
            </p>
        </div>

        <!-- Rectangle -->
        <div id="rectangle" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Rectangle
            </h3>
            <ComponentPreview code={RectangleSrc}>
                <Rectangle />
            </ComponentPreview>
        </div>

        <!-- Circle -->
        <div id="circle" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Circle
            </h3>
            <ComponentPreview code={CircleSrc}>
                <Circle />
            </ComponentPreview>
        </div>

        <!-- Card composition -->
        <div id="card" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Card composition
            </h3>
            <ComponentPreview code={CardSrc}>
                <Card />
            </ComponentPreview>
        </div>
    </section>
</div>
