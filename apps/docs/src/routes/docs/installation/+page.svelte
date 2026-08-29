<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    const packageInstall = `bun add @sivir-ui/svelte
# npm i @sivir-ui/svelte
# pnpm add @sivir-ui/svelte`;

    const packageCss = `@import '@sivir-ui/svelte/ui.css';`;

    const packageUse = `<script>
  import { Button } from '@sivir-ui/svelte';
<${'/'}script>

<Button>Get started</Button>`;

    const cliCss = `/* src/app.css */
@import './lib/sivir/ui.css';`;

    const cliAdd = `bunx --package @sivir-ui/svelte sivir add button
bunx --package @sivir-ui/svelte sivir list`;

    const cliUse = `<script>
  import { Button } from '$lib/sivir/components/button';
<${'/'}script>

<Button>Get started</Button>`;
</script>

<svelte:head>
    <title>Sivir · Installation</title>
    <meta name="description" content="Install Sivir UI with the npm package or the sivir CLI." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Installation</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Install Sivir UI into your project.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="prerequisites" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Prerequisites</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>Svelte 5 or SvelteKit</li>
            <li>Tailwind CSS v4</li>
        </ul>
    </section>

    <section id="package-import" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Option A: Package import</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Install the library and import components from
            <Typography.InlineCode>@sivir-ui/svelte</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={packageInstall} lang="shell" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Import the stylesheet once (for example in
            <Typography.InlineCode>src/app.css</Typography.InlineCode>):
        </Typography.Text>
        <CodeBlock code={packageCss} lang="css" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">Use a component:</Typography.Text>
        <CodeBlock code={packageUse} lang="svelte" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Compound components use a namespace export (for example
            <Typography.InlineCode>Modal</Typography.InlineCode>
            with
            <Typography.InlineCode>Modal.Root</Typography.InlineCode>,
            <Typography.InlineCode>Modal.Content</Typography.InlineCode>, …).
        </Typography.Text>
    </section>

    <section id="cli-source-copy" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Option B: CLI source copy</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            The CLI copies source into your project. The package name is
            <Typography.InlineCode>@sivir-ui/svelte</Typography.InlineCode>; the binary is
            <Typography.InlineCode>sivir</Typography.InlineCode>.
        </Typography.Text>

        <Typography.H3 class="m-0 docs-subsection-heading">
            1. Create a project (optional)
        </Typography.H3>
        <CodeBlock code="bunx sv create my-app" lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">2. Add Tailwind v4</Typography.H3>
        <CodeBlock code="cd my-app && bunx sv add tailwindcss" lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">3. Initialize Sivir</Typography.H3>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Creates <Typography.InlineCode>src/lib/sivir/</Typography.InlineCode> (tokens +
            utilities) and <Typography.InlineCode>sivir.json</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock
            code="bunx --package @sivir-ui/svelte sivir init -y"
            lang="shell"
            copy="overlay"
        />

        <Typography.H3 class="m-0 docs-subsection-heading">
            4. Import the stylesheet
        </Typography.H3>
        <CodeBlock code={cliCss} lang="css" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">5. Add components</Typography.H3>
        <CodeBlock code={cliAdd} lang="shell" copy="overlay" />

        <Typography.H3 class="m-0 docs-subsection-heading">6. Use them</Typography.H3>
        <CodeBlock code={cliUse} lang="svelte" copy="overlay" />
    </section>

    <section id="notes" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Notes</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>
                Tailwind v3 is not supported. Sivir needs v4
                <Typography.InlineCode>@theme</Typography.InlineCode>
                and
                <Typography.InlineCode>color-mix</Typography.InlineCode>.
            </li>
            <li>
                Dark mode uses a <Typography.InlineCode>.dark</Typography.InlineCode> class on
                <Typography.InlineCode>&lt;html&gt;</Typography.InlineCode>.
            </li>
            <li>
                Built-in theme presets install with
                <Typography.InlineCode
                    >bunx --package @sivir-ui/svelte sivir add theme &lt;slug&gt;</Typography.InlineCode
                >
                (for example <Typography.InlineCode>default</Typography.InlineCode>).
            </li>
        </ul>
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
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
