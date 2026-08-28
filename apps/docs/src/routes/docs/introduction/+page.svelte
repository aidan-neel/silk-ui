<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    const packageQuick = `bun add @sivir-ui/svelte
# then in your CSS:
# @import '@sivir-ui/svelte/ui.css';`;

    const cliQuick = `bunx --package @sivir-ui/svelte sivir init -y
bunx --package @sivir-ui/svelte sivir add button`;
</script>

<svelte:head>
    <title>Sivir · Introduction</title>
    <meta name="description" content="Sivir UI is a Svelte 5 and Tailwind v4 component library." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Introduction
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                Sivir UI is a component library for Svelte 5 and Tailwind v4. It ships 54
                components, a CSS token sheet, and a small CLI.
            </p>
        </div>
        <DocsPager />
    </header>

    <section id="two-ways" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Two ways to use it
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            <strong>Package import.</strong>
            Install
            <code class="font-mono text-foreground">@sivir-ui/svelte</code>
            and import components from the package. Fastest path when you want a dependency, not
            source ownership.
        </p>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            <strong>CLI source copy.</strong>
            Run the
            <code class="font-mono text-foreground">sivir</code>
            CLI to copy component files into your repo. You own the markup and can edit it freely.
        </p>
    </section>

    <section id="requirements" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Requirements
        </h2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>Svelte 5 (SvelteKit is the usual host)</li>
            <li>Tailwind CSS v4</li>
        </ul>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            npm, pnpm, and bun all work for consumers. Bun is only required to develop this
            monorepo.
        </p>
    </section>

    <section id="quick-start" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Quick start
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">Package path:</p>
        <CodeBlock code={packageQuick} lang="shell" copy="overlay" />
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">CLI path:</p>
        <CodeBlock code={cliQuick} lang="shell" copy="overlay" />
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Next
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed">
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/installation')}
                >Installation</a
            >
            ·
            <a class="text-foreground underline underline-offset-2" href={resolve('/docs/theming')}
                >Theming</a
            >
            ·
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/components')}
                >Components</a
            >
        </p>
    </section>
</div>
