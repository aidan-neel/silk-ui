<script lang="ts">
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';

    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import Error from './examples/state-error.svelte';
    import ErrorSrc from './examples/state-error.svelte?raw';
    import Idle from './examples/idle.svelte';
    import IdleSrc from './examples/idle.svelte?raw';
    import Submitting from './examples/submitting.svelte';
    import SubmittingSrc from './examples/submitting.svelte?raw';

    const installCommand = 'bunx @sivir-ui/svelte add prompt-composer';
</script>

<svelte:head>
    <title>Sivir · Prompt Composer</title>
    <meta
        name="description"
        content="A composable prompt input with actions, submission state, and keyboard behavior built in."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Prompt Composer
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] leading-relaxed font-[var(--font-weight-description,450)] text-foreground-muted"
            >
                A focused prompt surface with growing input, composable actions, and submission
                state.
            </p>
        </div>
    </header>

    <section id="hero" class="scroll-mt-20 flex flex-col gap-4">
        <ComponentPreview code={HeroSrc}><Hero /></ComponentPreview>
    </section>

    <section id="installation" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Installation
        </h2>
        <InstallCommand command={installCommand} />
    </section>

    <section id="usage" class="scroll-mt-20 flex flex-col gap-4">
        <h2
            class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
        >
            Usage
        </h2>
        <p class="text-sm text-foreground-muted">
            Bind the prompt value and handle submission on the root. The component awaits async
            handlers and shows its submitting state automatically.
        </p>
        <CodeBlock
            code={`import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';

let value = $state('');

async function sendPrompt(prompt: string) {
  await saveMessage(prompt);
  value = '';
}

<PromptComposer.Root bind:value onSubmit={sendPrompt}>
  <PromptComposer.Input placeholder="Ask anything..." />
  <PromptComposer.Toolbar>
    <PromptComposer.Actions>
      <!-- Add attachment, model, or permission controls here. -->
    </PromptComposer.Actions>
    <PromptComposer.Submit />
  </PromptComposer.Toolbar>
</PromptComposer.Root>`}
            lang="svelte"
            copy="overlay"
        />
        <p class="text-sm text-foreground-muted">
            By default, <kbd>Enter</kbd> submits and <kbd>Shift</kbd> + <kbd>Enter</kbd> inserts a
            new line. Set <code>submitOnEnter={false}</code> on <code>Input</code> when Enter should always
            create a new line.
        </p>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <h2
                class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
            >
                Examples
            </h2>
            <p class="mt-2 text-sm text-foreground-muted">
                Use explicit states when submission is managed outside the component.
            </p>
        </div>

        <div id="idle" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Idle
            </h3>
            <ComponentPreview code={IdleSrc}><Idle /></ComponentPreview>
        </div>

        <div id="submitting" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Submitting
            </h3>
            <ComponentPreview code={SubmittingSrc}><Submitting /></ComponentPreview>
        </div>

        <div id="error" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Error
            </h3>
            <ComponentPreview code={ErrorSrc} refreshable><Error /></ComponentPreview>
        </div>
    </section>
</div>
