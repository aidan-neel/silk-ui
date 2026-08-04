<script lang="ts">
import * as Question from '@sivir-ui/svelte/components/question';

let answer = $state('');
let submitted = $state('');
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    <Question.Root
        type="text"
        bind:value={answer}
        onSubmit={(value) => {
            submitted = Array.isArray(value) ? value.join(', ') : value;
        }}
    >
        <Question.Title>What constraint should I preserve?</Question.Title>
        <Question.Description>
            Add any implementation detail that is not captured by the current plan.
        </Question.Description>
        <Question.Input placeholder="For example: Keep the existing API stable" />
        <Question.Actions>
            <Question.Submit />
        </Question.Actions>
    </Question.Root>

    <p class="min-h-5 text-sm text-foreground-muted" role="status">
        {submitted ? `Answer: ${submitted}` : 'Waiting for an answer'}
    </p>
</div>
