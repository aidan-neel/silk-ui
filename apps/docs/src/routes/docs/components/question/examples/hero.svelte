<script lang="ts">
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let answer = $state<QuestionAnswer>();
    let submitted = $state('');

    function submit(value: QuestionAnswer) {
        submitted = Array.isArray(value) ? value.join(', ') : value;
    }
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    <Question.Root bind:value={answer} onSubmit={submit}>
        <Question.Title>How should I structure the authentication work?</Question.Title>
        <Question.Description>
            I found two viable approaches. Choose one so I can continue with the implementation.
        </Question.Description>
        <Question.Options>
            <Question.Option
                value="focused"
                label="Focused change"
                description="Add the current provider with the smallest public API."
            />
            <Question.Option
                value="extensible"
                label="Extensible foundation"
                description="Create a provider interface before adding the first integration."
            />
            <Question.Option
                value="explain"
                label="Explain the trade-offs first"
                description="Pause implementation and compare both approaches in detail."
            />
        </Question.Options>
        <Question.Actions>
            <Question.Cancel onclick={() => (submitted = 'Question skipped')}
                >Answer later</Question.Cancel
            >
            <Question.Submit />
        </Question.Actions>
    </Question.Root>

    <p class="min-h-5 text-sm text-foreground-muted" role="status">
        {submitted ? `Answer: ${submitted}` : 'Waiting for an answer'}
    </p>
</div>
