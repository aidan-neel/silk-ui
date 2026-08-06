<script lang="ts">
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let answer = $state<QuestionAnswer>([]);
    let summary = $state('');
</script>

<div class="flex w-full max-w-2xl flex-col gap-3">
    <Question.Root
        type="multiple"
        bind:value={answer}
        onSubmit={(value) => {
            summary = Array.isArray(value) ? value.join(', ') : value;
        }}
    >
        <Question.Title>Which checks should I run before opening the pull request?</Question.Title>
        <Question.Description>Select every check you want included.</Question.Description>
        <Question.Options>
            <Question.Option value="tests" label="Test suite" />
            <Question.Option value="types" label="Type checking" />
            <Question.Option value="build" label="Production build" />
            <Question.Option value="browser" label="Browser smoke test" />
        </Question.Options>
        <Question.Actions>
            <Question.Submit label="Run selected checks" />
        </Question.Actions>
    </Question.Root>

    <p class="min-h-5 text-sm text-foreground-muted" role="status">
        {summary ? `Queued: ${summary}` : 'No checks queued'}
    </p>
</div>
