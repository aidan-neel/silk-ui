<script lang="ts">
    import { CodeBlock } from '@sivir-ui/svelte/components/code-block';
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import { ComponentPreview, InstallCommand } from '$lib/components/docs';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
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
    <header class="flex items-start justify-between gap-4">
        <div>
            <Typography.H1> Question </Typography.H1>
            <Typography.Text variant="lead" class="mt-2 max-w-2xl">
                Pause an agent conversation for one structured answer, then return control to the
                prompt composer.
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
            Render <Typography.InlineCode>Question.Root</Typography.InlineCode> in the same layout
            slot as <Typography.InlineCode>Composer.Root</Typography.InlineCode>. Keep the prompt
            value in their shared parent so swapping the forms never clears an unsent draft.
        </Typography.Text>
        <CodeBlock code={usageSnippet} lang="svelte" copy="overlay" />
        <Typography.Text variant="supporting">
            Use <Typography.InlineCode>type="single"</Typography.InlineCode> for one option,
            <Typography.InlineCode>type="multiple"</Typography.InlineCode>
            for several, or
            <Typography.InlineCode>type="text"</Typography.InlineCode>
            with
            <Typography.InlineCode>Question.Input</Typography.InlineCode>. Async submit handlers are
            awaited and cannot run twice while unresolved. Changing
            <Typography.InlineCode>type</Typography.InlineCode>
            resets the bound answer to the new mode's empty value.
        </Typography.Text>
    </section>

    <section id="examples" class="scroll-mt-20 flex flex-col gap-10">
        <div>
            <Typography.H2 class="docs-section-heading">Examples</Typography.H2>
            <Typography.Text variant="supporting" class="mt-2">
                Collect multiple selections or place the question directly beneath a live
                transcript.
            </Typography.Text>
        </div>

        <div id="multiple-choice" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Multiple choice</Typography.H3>
            <ComponentPreview code={MultipleChoiceSrc}><MultipleChoice /></ComponentPreview>
        </div>

        <div id="free-text" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Free text</Typography.H3>
            <ComponentPreview code={FreeTextSrc}><FreeText /></ComponentPreview>
        </div>

        <div id="composer-takeover" class="scroll-mt-20 flex flex-col gap-3">
            <Typography.H3 class="docs-subsection-heading">Conversation takeover</Typography.H3>
            <Typography.Text variant="supporting">
                Answer or skip the question to restore the composer with its draft intact.
            </Typography.Text>
            <ComponentPreview code={ComposerTakeoverSrc}>
                <ComposerTakeover />
            </ComponentPreview>
        </div>
    </section>
</div>
