<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
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
            <Typography.H1 class="m-0">Introduction</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Sivir UI is a component library for Svelte 5 and Tailwind v4. It ships 55
                components, a CSS token sheet, and a small CLI.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="two-ways" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Two ways to use it</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <strong>Package import.</strong>
            Install
            <Typography.InlineCode>@sivir-ui/svelte</Typography.InlineCode>
            and import components from the package. Fastest path when you want a dependency, not
            source ownership.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <strong>CLI source copy.</strong>
            Run the
            <Typography.InlineCode>sivir</Typography.InlineCode>
            CLI to copy component files into your repo. You own the markup and can edit it freely.
        </Typography.Text>
    </section>

    <section id="requirements" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Requirements</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>Svelte 5 (SvelteKit is the usual host)</li>
            <li>Tailwind CSS v4</li>
        </ul>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            npm, pnpm, and bun all work for consumers. Bun is only required to develop this
            monorepo.
        </Typography.Text>
    </section>

    <section id="quick-start" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Quick start</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">Package path:</Typography.Text>
        <CodeBlock code={packageQuick} lang="shell" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">CLI path:</Typography.Text>
        <CodeBlock code={cliQuick} lang="shell" copy="overlay" />
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
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
        </Typography.Text>
    </section>
</div>
