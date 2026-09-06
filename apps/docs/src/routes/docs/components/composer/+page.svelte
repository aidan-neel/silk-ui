<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Idle from './examples/idle.svelte';
    import IdleSrc from './examples/idle.svelte?raw';
    import ErrorExample from './examples/state-error.svelte';
    import ErrorSrc from './examples/state-error.svelte?raw';
    import Submitting from './examples/submitting.svelte';
    import SubmittingSrc from './examples/submitting.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add composer';
</script>

<svelte:head>
    <title>Sivir · Composer</title>
    <meta
        name="description"
        content="A composable prompt input with actions, submission state, and keyboard behavior built in."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Composer </Typography.H1>

            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                A focused prompt surface with growing input, composable actions, and submission
                state.
            </Typography.Text>
        </div>
        <DocsPager />
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Installation</Typography.H2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <Typography.H2 class="docs-section-heading">Usage</Typography.H2>
        <Typography.Text variant="supporting">
            Bind the prompt value and handle submission on the root. The component awaits async
            handlers and shows its submitting state automatically.
        </Typography.Text>
        <CodeBlock
            code={`import * as Composer from '@sivir-ui/svelte/components/composer';

let value = $state('');

async function sendPrompt(prompt: string) {
  await saveMessage(prompt);
  value = '';
}

<Composer.Root bind:value onSubmit={sendPrompt}>
  <Composer.Input placeholder="Ask anything..." />
  <Composer.Toolbar>
    <Composer.Actions>
      <!-- Add attachment, model, or permission controls here. -->
    </Composer.Actions>
    <Composer.Submit />
  </Composer.Toolbar>
</Composer.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <Typography.Text variant="supporting">
            By default, <Shortcut shortcut="enter" /> submits and
            <Shortcut shortcut="shift+enter" />
            inserts a new line. Set
            <Typography.InlineCode>submitOnEnter={false}</Typography.InlineCode>
            on
            <Typography.InlineCode>Input</Typography.InlineCode>
            when Enter should always create a new line.
        </Typography.Text>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Use explicit states when submission is managed outside the component.
            </Typography.Text>
        </div>

        <div id="idle" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Idle</Typography.H3>
            <ComponentPreview code={IdleSrc}><Idle /></ComponentPreview>
        </div>

        <div id="submitting" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Submitting</Typography.H3>
            <ComponentPreview code={SubmittingSrc}><Submitting /></ComponentPreview>
        </div>

        <div id="error" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Error</Typography.H3>
            <ComponentPreview code={ErrorSrc} refreshable><ErrorExample /></ComponentPreview>
        </div>
    </section>
</div>
