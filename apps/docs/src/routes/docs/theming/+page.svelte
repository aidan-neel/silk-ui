<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { resolve } from '$app/paths';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    const overrideCss = `@theme {
  --color-primary: #155eef;
  --color-background: #fcfcfd;
  --color-foreground: #101828;
  --radius-lg: 0.55rem;
    --font-sans: 'DM Sans', sans-serif;
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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1 class="m-0">Theming</Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Components read CSS variables. Change tokens for system-wide look, or override a
                single component with classes and selectors.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="where-tokens-live" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Where tokens live</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Package installs use
            <Typography.InlineCode>@sivir-ui/svelte/ui.css</Typography.InlineCode>. CLI installs use
            <Typography.InlineCode>src/lib/sivir/ui.css</Typography.InlineCode>. Both define the
            same public axes: color, type, radius, and motion.
        </Typography.Text>
    </section>

    <section id="theme-studio" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Theme Studio</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            The
            <a class="text-foreground underline underline-offset-2" href={resolve('/studio')}
                >Theme Studio</a
            >
            is the visual way to build a theme. Start from a built-in preset and adjust the shared
            axes — brand, neutral temperature, radius, density, motion, and fonts — plus typography
            (header size and per-role weights for body, label, button, badge, and description),
            per-mode foundation colors, and chrome flags (surface, control, and dialog shadows, the
            traveling highlight, primary stroke, and the interactive cursor). The Advanced section
            overrides individual color, spacing, and animation tokens per light and dark mode.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Copy the generated <Typography.InlineCode>theme.css</Typography.InlineCode> to use the
            theme in your app, or copy the theme JSON to share it. The studio keeps your draft in
            local storage between visits.
        </Typography.Text>
    </section>

    <section id="override-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Override tokens</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Set values in your app CSS after importing Sivir’s sheet. Light defaults go in
            <Typography.InlineCode>@theme</Typography.InlineCode>. Dark values go under
            <Typography.InlineCode>.dark</Typography.InlineCode>.
        </Typography.Text>
        <CodeBlock code={overrideCss} lang="css" copy="overlay" />
    </section>

    <section id="useful-tokens" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Useful public tokens</Typography.H2>
        <ul
            class="m-0 flex list-disc flex-col gap-2 pl-5 text-[1rem] text-foreground leading-relaxed"
        >
            <li>
                Color:
                <Typography.InlineCode>--color-background</Typography.InlineCode>,
                <Typography.InlineCode>--color-card</Typography.InlineCode>,
                <Typography.InlineCode>--color-panel</Typography.InlineCode>,
                <Typography.InlineCode>--color-secondary</Typography.InlineCode>,
                <Typography.InlineCode>--color-foreground</Typography.InlineCode>,
                <Typography.InlineCode>--color-foreground-muted</Typography.InlineCode>,
                <Typography.InlineCode>--color-primary</Typography.InlineCode>,
                <Typography.InlineCode>--color-on-primary</Typography.InlineCode>,
                <Typography.InlineCode>--color-border</Typography.InlineCode>,
                <Typography.InlineCode>--color-input</Typography.InlineCode>,
                <Typography.InlineCode>--color-ring</Typography.InlineCode>
            </li>
            <li>
                Type:
                <Typography.InlineCode>--font-sans</Typography.InlineCode>,
                <Typography.InlineCode>--font-mono</Typography.InlineCode>,
                <Typography.InlineCode>--font-header</Typography.InlineCode>,
                <Typography.InlineCode>--font-size-header</Typography.InlineCode>, and role weights
                like <Typography.InlineCode>--font-weight-body</Typography.InlineCode>,
                <Typography.InlineCode>--font-weight-label</Typography.InlineCode>,
                <Typography.InlineCode>--font-weight-button</Typography.InlineCode>
            </li>
            <li>
                Radius and density:
                <Typography.InlineCode>--radius-sm</Typography.InlineCode>,
                <Typography.InlineCode>--radius-md</Typography.InlineCode>,
                <Typography.InlineCode>--radius-lg</Typography.InlineCode>,
                <Typography.InlineCode>--radius-xl</Typography.InlineCode>, and the base spacing
                unit <Typography.InlineCode>--sivir-space-unit</Typography.InlineCode>
            </li>
            <li>
                Motion:
                <Typography.InlineCode>--motion-duration-hover</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-menu</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-panel</Typography.InlineCode>,
                <Typography.InlineCode>--motion-duration-sheet</Typography.InlineCode>
            </li>
            <li>
                Elevation:
                <Typography.InlineCode>--elevation-1</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-float</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-control</Typography.InlineCode>,
                <Typography.InlineCode>--elevation-modal</Typography.InlineCode>
            </li>
        </ul>
    </section>

    <section id="built-in-presets" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Built-in presets</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Four presets ship with Sivir: <Typography.InlineCode>default</Typography.InlineCode>,
            <Typography.InlineCode>magic</Typography.InlineCode>,
            <Typography.InlineCode>bitsy</Typography.InlineCode>, and
            <Typography.InlineCode>open</Typography.InlineCode>. Preview them live on the
            <a class="text-foreground underline underline-offset-2" href={resolve('/themes')}
                >themes page</a
            >, where you can copy each preset’s CSS or JSON.
        </Typography.Text>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            With the CLI, install a preset into
            <Typography.InlineCode>theme.css</Typography.InlineCode>:
        </Typography.Text>
        <CodeBlock
            code="bunx --package @sivir-ui/svelte sivir add theme open"
            lang="shell"
            copy="overlay"
        />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Import it after <Typography.InlineCode>ui.css</Typography.InlineCode> so it wins:
        </Typography.Text>
        <CodeBlock code={themeImport} lang="css" copy="overlay" />
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            <Typography.InlineCode>sivir list</Typography.InlineCode>
            shows available built-in theme slugs. Community theme registry hosting is not part of
            v1.
        </Typography.Text>
    </section>

    <section id="dark-mode" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Dark mode</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Toggle a <Typography.InlineCode>.dark</Typography.InlineCode> class on
            <Typography.InlineCode>&lt;html&gt;</Typography.InlineCode>. Components do not manage
            the class for you.
        </Typography.Text>
    </section>

    <section id="theme-json" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Theme JSON</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Theme JSON (version 4) captures a theme as data, so the studio, the CLI, and the theme
            registry all speak the same format. Beyond the shared axes, theme JSON accepts per-mode
            surfaces in <Typography.InlineCode>foundation.light</Typography.InlineCode>
            /
            <Typography.InlineCode>foundation.dark</Typography.InlineCode>
            (<Typography.InlineCode>base</Typography.InlineCode>,
            <Typography.InlineCode>border</Typography.InlineCode>,
            <Typography.InlineCode>background</Typography.InlineCode>,
            <Typography.InlineCode>secondary</Typography.InlineCode>,
            <Typography.InlineCode>foreground</Typography.InlineCode>,
            <Typography.InlineCode>foregroundMuted</Typography.InlineCode>,
            <Typography.InlineCode>onPrimary</Typography.InlineCode>), typography under
            <Typography.InlineCode>typography</Typography.InlineCode>
            (<Typography.InlineCode>headerSize</Typography.InlineCode>,
            <Typography.InlineCode>headerWeight</Typography.InlineCode>, and
            <Typography.InlineCode>roleWeights</Typography.InlineCode>
            for body, label, button, badge, and description), raw token overrides under
            <Typography.InlineCode>tokens.shared</Typography.InlineCode>
            /
            <Typography.InlineCode>tokens.light</Typography.InlineCode>
            /
            <Typography.InlineCode>tokens.dark</Typography.InlineCode>
            (for example per-mode primary colors overriding
            <Typography.InlineCode>--color-primary</Typography.InlineCode>), and chrome flags under
            <Typography.InlineCode>chrome</Typography.InlineCode>:
            <Typography.InlineCode>surfaceShadows</Typography.InlineCode>,
            <Typography.InlineCode>controlShadows</Typography.InlineCode>,
            <Typography.InlineCode>dialogShadows</Typography.InlineCode>,
            <Typography.InlineCode>travelingHighlight: false</Typography.InlineCode>
            (item fill stays, the slide does not),
            <Typography.InlineCode>primaryStroke</Typography.InlineCode>, and
            <Typography.InlineCode>interactiveCursor</Typography.InlineCode>. Setting
            <Typography.InlineCode>motion: "none"</Typography.InlineCode>
            disables every animation, including dialogs, menus, and the traveling highlight.
        </Typography.Text>
    </section>

    <section id="class-prop" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">class prop</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Every primitive accepts <Typography.InlineCode>class</Typography.InlineCode>. Use
            Tailwind utilities or your own classes for one-off tweaks.
        </Typography.Text>
        <CodeBlock code={classExample} lang="svelte" copy="overlay" />
    </section>

    <section id="data-ui" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">data-ui selectors</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            Components render <Typography.InlineCode>data-ui</Typography.InlineCode> (and often
            <Typography.InlineCode>data-variant</Typography.InlineCode>
            /
            <Typography.InlineCode>data-size</Typography.InlineCode>). Scope CSS to a family without
            forking files.
        </Typography.Text>
        <CodeBlock code={dataUiExample} lang="css" copy="overlay" />
    </section>

    <section id="edit-source" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Edit the source</Typography.H2>
        <Typography.Text variant="body" class="m-0 max-w-2xl">
            With the CLI path, files live under
            <Typography.InlineCode>src/lib/sivir/components/&lt;name&gt;/</Typography.InlineCode>.
            Edit them when you need behavior changes, not just style.
        </Typography.Text>
        <CodeBlock code={sourceExample} lang="shell" copy="overlay" />
    </section>

    <section id="next" class="scroll-mt-20 flex flex-col gap-5">
        <Typography.H2 class="docs-section-heading">Next</Typography.H2>
        <Typography.Text variant="body" class="m-0">
            <a
                class="text-foreground underline underline-offset-2"
                href={resolve('/docs/components')}
                >Components</a
            >
        </Typography.Text>
    </section>
</div>
