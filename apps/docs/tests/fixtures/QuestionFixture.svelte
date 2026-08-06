<script lang="ts">
    import type {
        QuestionAnswer,
        QuestionStatus,
        QuestionType
    } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';
    import { untrack } from 'svelte';

    let {
        type = 'single',
        value = $bindable(),
        status = 'idle',
        required = true,
        autofocus = false,
        disabled = false,
        delayed = false,
        showActions = true,
        asyncSubmit = false
    }: {
        type?: QuestionType;
        value?: QuestionAnswer;
        status?: QuestionStatus;
        required?: boolean;
        autofocus?: boolean;
        disabled?: boolean;
        delayed?: boolean;
        showActions?: boolean;
        asyncSubmit?: boolean;
    } = $props();

    let submittedAnswer = $state<QuestionAnswer>();
    let submitCount = $state(0);
    let submitClickCount = $state(0);
    let cancelCount = $state(0);
    let showControls = $state(!untrack(() => delayed));
    let settle: (() => void) | undefined;

    async function submit(answer: QuestionAnswer) {
        submitCount += 1;
        submittedAnswer = answer;
        if (!asyncSubmit) {
            return;
        }

        await new Promise<void>((resolve) => {
            settle = resolve;
        });
        settle = undefined;
    }

    function resolveSubmission() {
        const resolve = settle;
        settle = undefined;
        resolve?.();
    }
</script>

<Question.Root
    bind:value
    {type}
    {status}
    {required}
    {autofocus}
    {disabled}
    onSubmit={submit}
    onCancel={() => (cancelCount += 1)}
>
    <Question.Title>How should the release be prepared?</Question.Title>
    <Question.Description>Select the answer that best matches this task.</Question.Description>

    {#if showControls}
        {#if type === 'text'}
            <Question.Input aria-label="Answer" />
        {:else}
            <Question.Options>
                <Question.Option
                    value="safe"
                    label="Safe rollout"
                    description="Use a canary and monitor the release."
                />
                <Question.Option
                    value="fast"
                    label="Fast rollout"
                    description="Deploy to every instance at once."
                />
                <Question.Option value="manual" label="Manual handoff" />
            </Question.Options>
        {/if}
    {/if}

    {#if showActions}
        <Question.Actions>
            <Question.Cancel>Skip question</Question.Cancel>
            <Question.Submit
                data-testid="question-submit"
                title="Submit the current answer"
                onclick={() => (submitClickCount += 1)}
            />
        </Question.Actions>
    {/if}
</Question.Root>

<p data-testid="question-value">{JSON.stringify(value)}</p>
<p data-testid="submitted-answer">{JSON.stringify(submittedAnswer)}</p>
<p data-testid="submit-count">{submitCount}</p>
<p data-testid="submit-click-count">{submitClickCount}</p>
<p data-testid="cancel-count">{cancelCount}</p>
<button type="button" onclick={resolveSubmission}>Resolve submission</button>
<button type="button" onclick={() => (type = 'multiple')}>Change to multiple</button>
<button type="button" onclick={() => (disabled = false)}>Enable question</button>
<button type="button" onclick={() => (showControls = true)}>Reveal controls</button>
<button type="button" onclick={() => (value = type === 'multiple' ? 'incompatible' : [])}>
    Set incompatible answer
</button>
<button type="button" onclick={() => (value = type === 'multiple' ? ['safe'] : 'safe')}>
    Set valid answer
</button>
