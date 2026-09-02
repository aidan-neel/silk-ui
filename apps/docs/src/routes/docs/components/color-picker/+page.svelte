<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import Default from './examples/default.svelte';
    import DefaultSrc from './examples/default.svelte?raw';
    import Formats from './examples/formats.svelte';
    import FormatsSrc from './examples/formats.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import WithPresets from './examples/with-presets.svelte';
    import WithPresetsSrc from './examples/with-presets.svelte?raw';

    const TITLE = 'Color Picker';
    const SLUG = 'color-picker';

    const installCommand = `bunx @sivir-ui/svelte add ${SLUG}`;
</script>

<svelte:head>
    <title>Sivir · {TITLE}</title>
    <meta name="description" content="Inline hex color picker with optional presets." />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <!-- ─── Header ────────────────────────────────────────────────── -->
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1>
                {TITLE}
            </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A hex color picker with HSL, RGB, or HSV channel controls and optional preset
                swatches.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <!-- ─── Hero Example ──────────────────────────────────────────── -->
    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}>
            <Hero />
        </ComponentPreview>
    </section>

    <!-- ─── Installation ──────────────────────────────────────────── -->
    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Installation </Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <!-- ─── Usage ─────────────────────────────────────────────────── -->
    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading"> Usage </Typography.H2>
        <Typography.Text variant="supporting">
            Compose the Color Picker from its <Typography.InlineCode>Root</Typography.InlineCode>,
            <Typography.InlineCode>Trigger</Typography.InlineCode>, and
            <Typography.InlineCode>Content</Typography.InlineCode>
            parts:
        </Typography.Text>
        <CodeBlock
            code={`import * as ColorPicker from '$lib/sivir/components/color-picker';\n\nlet value = $state('#5e6ad2');\n\n<ColorPicker.Root value={value} onValueChange={(v) => (value = v)} format="hsl">\n\t<ColorPicker.Trigger />\n\t<ColorPicker.Content />\n</ColorPicker.Root>`}
            lang="svelte"
            copy="overlay"
        />
    </section>

    <!-- ─── Examples ──────────────────────────────────────────────── -->
    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading"> Examples </Typography.H2>
        </div>

        <!-- Default -->
        <div id="default" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Default </Typography.H3>
            <ComponentPreview code={DefaultSrc}>
                <Default />
            </ComponentPreview>
        </div>

        <!-- Channel formats -->
        <div id="formats" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> Channel formats </Typography.H3>
            <ComponentPreview code={FormatsSrc}>
                <Formats />
            </ComponentPreview>
        </div>

        <!-- With presets -->
        <div id="with-presets" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading"> With preset swatches </Typography.H3>
            <ComponentPreview code={WithPresetsSrc}>
                <WithPresets />
            </ComponentPreview>
        </div>
    </section>
</div>
