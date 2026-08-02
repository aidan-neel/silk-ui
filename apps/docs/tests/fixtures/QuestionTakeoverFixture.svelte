<script lang="ts">
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import * as Message from '@sivir-ui/svelte/components/message';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import * as Question from '@sivir-ui/svelte/components/question';

    let asking = $state(true);
    let answer = $state<string | string[]>();
    let draft = $state('Keep this draft');
</script>

<div>
    <Conversation.Root class="h-48">
        <Conversation.Content aria-label="Test conversation">
            <Message.Root from="assistant">
                <Message.Content>I need one detail before I continue.</Message.Content>
            </Message.Root>
        </Conversation.Content>
    </Conversation.Root>

    {#if asking}
        <Question.Root
            bind:value={answer}
            onSubmit={() => {
                asking = false;
            }}
        >
            <Question.Title>Which environment should I use?</Question.Title>
            <Question.Options>
                <Question.Option value="preview" label="Preview" />
                <Question.Option value="production" label="Production" />
            </Question.Options>
            <Question.Actions>
                <Question.Cancel onclick={() => (asking = false)}>Skip question</Question.Cancel>
                <Question.Submit />
            </Question.Actions>
        </Question.Root>
    {:else}
        <PromptComposer.Root bind:value={draft} onSubmit={() => undefined}>
            <PromptComposer.Input aria-label="Prompt" />
            <PromptComposer.Toolbar>
                <PromptComposer.Actions />
                <PromptComposer.Submit />
            </PromptComposer.Toolbar>
        </PromptComposer.Root>
    {/if}
</div>
