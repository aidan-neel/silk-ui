<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { resolve } from '$app/paths';

    const overrideCss = `@theme {
  --color-primary: #155eef;
  --color-background: #fcfcfd;
  --color-foreground: #101828;
  --radius-lg: 0.55rem;
    --font-sans: 'Inter', sans-serif;
}

.dark {
  --color-background: #0d1118;
  --color-foreground: #f5f7fb;
  --color-primary: #7aa2ff;
}`;

    const themeImport = `@import './lib/sivir/ui.css';
@import './lib/sivir/theme.css';`;

    const classExample = '<Button class="w-full rounded-2xl">Continue</Button>';

    const dataUiExample = `[data-ui='button'][data-variant='primary'] {
  border-radius: 999px;
}

[data-ui='badge'][data-variant='secondary'] {
  text-transform: uppercase;
}`;

    const sourceExample = `# after: bunx --package @sivir-ui/svelte sivir add button
src/lib/sivir/components/button/
├── button.svelte
└── index.ts`;
</script>

<svelte:head>
    <title>Sivir · Theming</title>
    <meta
        name="description"
        content="Theme and style Sivir UI with CSS variables, classes, and data-ui selectors."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-16">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Theming
            </h1>
            <p
                class="mt-2 text-[1rem] text-foreground leading-relaxed max-w-2xl font-[var(--font-weight-description,450)]"
            >
                Components read CSS variables. Change tokens for system-wide look, or override a
                single component with classes and selectors.
            </p>
        </div>
    </header>

    <section id="where-tokens-live" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Where tokens live
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Package installs use <code class="font-mono">@sivir-ui/svelte/ui.css</code>. CLI
            installs use
            <code class="font-mono">src/lib/sivir/ui.css</code>. Both define the same public axes:
            color, type, radius, and motion.
        </p>
    </section>

    <section id="override-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Override tokens
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Set values in your app CSS after importing Sivir’s sheet. Light defaults go in
            <code class="font-mono">@theme</code>. Dark values go under
            <code class="font-mono">.dark</code>.
        </p>
        <CodeBlock code={overrideCss} lang="css" copy="overlay" />
    </section>

    <section id="useful-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Useful public tokens
        </h2>
        <ul
            class="m-0 flex list-disc flex-col gap-2 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>
                Color:
                <code class="font-mono">--color-background</code>,
                <code class="font-mono">--color-foreground</code>,
                <code class="font-mono">--color-primary</code>,
                <code class="font-mono">--color-border</code>,
                <code class="font-mono">--color-ring</code>
            </li>
            <li>
                Type:
                <code class="font-mono">--font-sans</code>,
                <code class="font-mono">--font-header</code>,
                <code class="font-mono">--font-mono</code>
            </li>
            <li>
                Radius:
                <code class="font-mono">--radius-md</code>,
                <code class="font-mono">--radius-lg</code>,
                <code class="font-mono">--radius-xl</code>
            </li>
            <li>
                Motion:
                <code class="font-mono">--motion-duration-hover</code>,
                <code class="font-mono">--motion-duration-panel</code>
            </li>
        </ul>
    </section>

    <section id="built-in-presets" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Built-in presets
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            With the CLI, install a built-in preset into
            <code class="font-mono">theme.css</code>:
        </p>
        <CodeBlock
            code="bunx --package @sivir-ui/svelte sivir add theme default"
            lang="shell"
            copy="overlay"
        />
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Import it after <code class="font-mono">ui.css</code> so it wins:
        </p>
        <CodeBlock code={themeImport} lang="css" copy="overlay" />
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            <code class="font-mono">sivir list</code>
            shows available built-in theme slugs. Community theme registry hosting is not part of
            v1.
        </p>
    </section>

    <section id="dark-mode" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Dark mode
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Toggle a <code class="font-mono">.dark</code> class on
            <code class="font-mono">&lt;html&gt;</code>. Components do not manage the class for you.
        </p>
    </section>

    <section id="class-prop" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            class prop
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Every primitive accepts <code class="font-mono">class</code>. Use Tailwind utilities or
            your own classes for one-off tweaks.
        </p>
        <CodeBlock code={classExample} lang="svelte" copy="overlay" />
    </section>

    <section id="data-ui" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            data-ui selectors
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            Components render <code class="font-mono">data-ui</code> (and often
            <code class="font-mono">data-variant</code>
            /
            <code class="font-mono">data-size</code>). Scope CSS to a family without forking files.
        </p>
        <CodeBlock code={dataUiExample} lang="css" copy="overlay" />
    </section>

    <section id="edit-source" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Edit the source
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed max-w-2xl">
            With the CLI path, files live under
            <code class="font-mono">src/lib/sivir/components/&lt;name&gt;/</code>. Edit them when
            you need behavior changes, not just style.
        </p>
        <CodeBlock code={sourceExample} lang="shell" copy="overlay" />
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-5">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Next
        </h2>
        <p class="m-0 text-[1rem] text-foreground leading-relaxed">
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/components')}
                >Components</a
            >
        </p>
    </section>
</div>
