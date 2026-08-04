<script lang="ts">
import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
import { ComponentPreview, InstallCommand } from '$lib/components/docs';
import AsLink from './examples/as-link.svelte';
import AsLinkSrc from './examples/as-link.svelte?raw';
import Disabled from './examples/disabled.svelte';
import DisabledSrc from './examples/disabled.svelte?raw';
import Hero from './examples/hero.svelte';
import HeroSrc from './examples/hero.svelte?raw';
import IconGroup from './examples/icon-group.svelte';
import IconGroupSrc from './examples/icon-group.svelte?raw';
import LeadingIcon from './examples/leading-icon.svelte';
import LeadingIconSrc from './examples/leading-icon.svelte?raw';
import Loading from './examples/loading.svelte';
import LoadingSrc from './examples/loading.svelte?raw';
import Sizes from './examples/sizes.svelte';
import SizesSrc from './examples/sizes.svelte?raw';
import TrailingIcon from './examples/trailing-icon.svelte';
import TrailingIconSrc from './examples/trailing-icon.svelte?raw';
import VariantDestructive from './examples/variant-destructive.svelte';
import VariantDestructiveSrc from './examples/variant-destructive.svelte?raw';
import VariantGhost from './examples/variant-ghost.svelte';
import VariantGhostSrc from './examples/variant-ghost.svelte?raw';
import VariantOutline from './examples/variant-outline.svelte';
import VariantOutlineSrc from './examples/variant-outline.svelte?raw';
import VariantPanel from './examples/variant-panel.svelte';
import VariantPanelSrc from './examples/variant-panel.svelte?raw';
import VariantPrimary from './examples/variant-primary.svelte';
import VariantPrimarySrc from './examples/variant-primary.svelte?raw';
import VariantQuiet from './examples/variant-quiet.svelte';
import VariantQuietSrc from './examples/variant-quiet.svelte?raw';
import VariantSecondary from './examples/variant-secondary.svelte';
import VariantSecondarySrc from './examples/variant-secondary.svelte?raw';

const installCommand = 'bunx @sivir-ui/svelte add button';
</script>

<svelte:head>
    <title>Sivir · Button</title>
    <meta
        name="description"
        content="Displays an action or link with stable loading, success, and error states."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Button
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground-muted leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                A clickable action in several variants and sizes. Pick a variant for what the action
                means.
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
            Use <code>status</code> for async feedback. Every label occupies the same grid cell, so state
            changes never resize the button; success and error switch to a matching semantic surface.
        </p>
        <CodeBlock
            code={`import { Button } from '$lib/sivir/components/button';

let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');

<Button {status} loadingLabel="Publishing…" successLabel="Published">
  Publish
</Button>`}
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
                Explore the Button in different variants, sizes, and compositions.
            </p>
        </div>

        <!-- Variants — each its own example piece -->
        <div id="variant-primary" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Primary
            </h3>
            <ComponentPreview code={VariantPrimarySrc}>
                <VariantPrimary />
            </ComponentPreview>
        </div>

        <div id="variant-secondary" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Secondary
            </h3>
            <ComponentPreview code={VariantSecondarySrc}>
                <VariantSecondary />
            </ComponentPreview>
        </div>

        <div id="variant-outline" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Outline
            </h3>
            <ComponentPreview code={VariantOutlineSrc}>
                <VariantOutline />
            </ComponentPreview>
        </div>

        <div id="variant-ghost" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Ghost
            </h3>
            <ComponentPreview code={VariantGhostSrc}>
                <VariantGhost />
            </ComponentPreview>
        </div>

        <div id="variant-quiet" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Quiet
            </h3>
            <ComponentPreview code={VariantQuietSrc}>
                <VariantQuiet />
            </ComponentPreview>
        </div>

        <div id="variant-destructive" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Destructive
            </h3>
            <ComponentPreview code={VariantDestructiveSrc}>
                <VariantDestructive />
            </ComponentPreview>
        </div>

        <div id="variant-panel" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Panel
            </h3>
            <ComponentPreview code={VariantPanelSrc}>
                <VariantPanel />
            </ComponentPreview>
        </div>

        <!-- Sizes (consolidated) -->
        <div id="sizes" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Sizes
            </h3>
            <ComponentPreview code={SizesSrc}>
                <Sizes />
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

        <!-- Composition -->
        <!-- Leading icon -->
        <div id="comp-leading" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Leading icon
            </h3>
            <ComponentPreview code={LeadingIconSrc}>
                <LeadingIcon />
            </ComponentPreview>
        </div>

        <!-- Trailing icon -->
        <div id="comp-trailing" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Trailing icon
            </h3>
            <ComponentPreview code={TrailingIconSrc}>
                <TrailingIcon />
            </ComponentPreview>
        </div>

        <!-- Loading -->
        <div id="comp-loading" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Loading
            </h3>
            <ComponentPreview code={LoadingSrc}>
                <Loading />
            </ComponentPreview>
        </div>

        <!-- As link -->
        <div id="comp-link" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                As link
            </h3>
            <ComponentPreview code={AsLinkSrc}>
                <AsLink />
            </ComponentPreview>
        </div>

        <!-- Icon group -->
        <div id="comp-group" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Icon group
            </h3>
            <ComponentPreview code={IconGroupSrc}>
                <IconGroup />
            </ComponentPreview>
        </div>
    </section>
</div>
