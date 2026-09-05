<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import type { QuestionAnswer } from '@sivir-ui/svelte/components/question';
    import * as Question from '@sivir-ui/svelte/components/question';

    let asking = $state(true);
    let answer = $state<QuestionAnswer>();
    let draft = $state('Keep the migration reversible.');
    let sentPrompt = $state('');
    let shouldFocusQuestion = $state(false);

    function answerQuestion(value: QuestionAnswer) {
        answer = value;
        asking = false;
    }

    function sendPrompt(value: string) {
        sentPrompt = value;
        draft = '';
    }
</script>

<div
    class="flex h-[34rem] w-full max-w-3xl flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-panel p-3"
>
    <Conversation.Root class="min-h-0 flex-1">
        <Conversation.Content aria-label="Migration planning conversation">
            <Message.Root from="user">
                <Message.Content>
                    Add the account migration and keep the rollout safe. I started a follow-up in
                    the composer.
                </Message.Content>
            </Message.Root>
            <Message.Root from="assistant">
                <Message.Content>
                    I can continue after I know which environment should receive the first run.
                </Message.Content>
            </Message.Root>
            {#if answer}
                <Message.Root from="user">
                    <Message.Content>
                        Use {Array.isArray(answer) ? answer.join(', ') : answer}.
                    </Message.Content>
                </Message.Root>
            {/if}
            {#if sentPrompt}
                <Message.Root from="user">
                    <Message.Content>{sentPrompt}</Message.Content>
                </Message.Root>
            {/if}
        </Conversation.Content>
        <Conversation.ScrollButton />
    </Conversation.Root>

    <div>
        {#if asking}
            <Question.Root
                bind:value={answer}
                autofocus={shouldFocusQuestion}
                onSubmit={answerQuestion}
            >
                <Question.Title>Where should I run the migration first?</Question.Title>
                <Question.Description>
                    Your unsent composer draft will stay in place while you answer.
                </Question.Description>
                <Question.Options>
                    <Question.Option
                        value="preview"
                        label="Preview environment"
                        description="Validate against a disposable copy first."
                    />
                    <Question.Option
                        value="staging"
                        label="Staging environment"
                        description="Run against the shared pre-production data."
                    />
                </Question.Options>
                <Question.Actions>
                    <Question.Cancel onclick={() => (asking = false)}
                        >Skip question</Question.Cancel
                    >
                    <Question.Submit />
                </Question.Actions>
            </Question.Root>
        {:else}
            <PromptComposer.Root bind:value={draft} onSubmit={sendPrompt}>
                <PromptComposer.Input aria-label="Message the agent" />
                <PromptComposer.Toolbar>
                    <PromptComposer.Actions>
                        <Button
                            variant="quiet"
                            size="md"
                            onclick={() => {
                                shouldFocusQuestion = true;
                                asking = true;
                            }}
                        >
                            Ask again
                        </Button>
                    </PromptComposer.Actions>
                    <PromptComposer.Submit />
                </PromptComposer.Toolbar>
            </PromptComposer.Root>
        {/if}
    </div>
</div>
