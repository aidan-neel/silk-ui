<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import ComposerTakeover from './examples/composer-takeover.svelte';
    import ComposerTakeoverSrc from './examples/composer-takeover.svelte?raw';
    import FreeText from './examples/free-text.svelte';
    import FreeTextSrc from './examples/free-text.svelte?raw';
    import Hero from './examples/hero.svelte';
    import HeroSrc from './examples/hero.svelte?raw';
    import MultipleChoice from './examples/multiple-choice.svelte';
    import MultipleChoiceSrc from './examples/multiple-choice.svelte?raw';

    const installCommand = 'bunx --package @sivir-ui/svelte sivir add question';
    const usageSnippet = `import * as Question from '@sivir-ui/svelte/components/question';
import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';

let answer = $state<QuestionAnswer>();

<Question.Root bind:value={answer} onSubmit={(value) => continueAgent(value)}>
  <Question.Title>Which environment should I use?</Question.Title>
  <Question.Description>Your prompt draft remains untouched.</Question.Description>
  <Question.Options>
    <Question.Option value="preview" label="Preview" />
    <Question.Option value="production" label="Production" />
  </Question.Options>
  <Question.Actions>
    <Question.Cancel onclick={() => skipQuestion()}>Skip question</Question.Cancel>
    <Question.Submit />
  </Question.Actions>
</Question.Root>`;
</script>

<svelte:head>
    <title>Sivir · Question</title>
    <meta
        name="description"
        content="An inline agent question that temporarily replaces the prompt composer with choice or free-text answers."
    />
</svelte:head>

<div data-docs-page class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
        <div>
            <h1
                class="m-0 text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] text-foreground leading-tight"
                style="font-family: var(--font-header);"
            >
                Question
            </h1>
            <p
                class="mt-2 max-w-2xl text-[1rem] leading-relaxed font-[var(--font-weight-description,450)] text-foreground-muted"
            >
                Pause an agent conversation for one structured answer, then return control to the
                prompt composer.
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
            Render <code>Question.Root</code> in the same layout slot as
            <code>PromptComposer.Root</code>. Keep the prompt value in their shared parent so
            swapping the forms never clears an unsent draft.
        </p>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
        <p class="text-sm text-foreground-muted">
            Use <code>type="single"</code> for one option, <code>type="multiple"</code> for several,
            or <code>type="text"</code> with <code>Question.Input</code>. Async submit handlers are
            awaited and cannot run twice while unresolved. Changing <code>type</code> resets the
            bound answer to the new mode's empty value.
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
                Collect multiple selections or place the question directly beneath a live
                transcript.
            </p>
        </div>

        <div id="multiple-choice" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Multiple choice
            </h3>
            <ComponentPreview code={MultipleChoiceSrc}><MultipleChoice /></ComponentPreview>
        </div>

        <div id="free-text" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Free text
            </h3>
            <ComponentPreview code={FreeTextSrc}><FreeText /></ComponentPreview>
        </div>

        <div id="composer-takeover" class="scroll-mt-20 flex flex-col gap-3">
            <h3
                class="text-[1rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-subsection-heading"
            >
                Conversation takeover
            </h3>
            <p class="text-sm text-foreground-muted">
                Answer or skip the question to restore the composer with its draft intact.
            </p>
            <ComponentPreview code={ComposerTakeoverSrc}>
                <ComposerTakeover />
            </ComponentPreview>
        </div>
    </section>
</div>
