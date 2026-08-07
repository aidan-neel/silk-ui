<script lang="ts">
    import FileText from '@lucide/svelte/icons/file-text';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Conversation from '@sivir-ui/svelte/components/conversation';
    import * as Message from '@sivir-ui/svelte/components/message';

    let started = $state(false);
</script>

{#snippet emptyIcon()}
    <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
{/snippet}

{#snippet startAction()}
    <Button size="sm" onclick={() => (started = true)}>Draft a release plan</Button>
{/snippet}

<Conversation.Root
    class="h-[22rem] w-full max-w-2xl rounded-[var(--radius-xl)] border border-border bg-panel"
>
    <Conversation.Content aria-label="Release planning conversation">
        {#if started}
            <Message.Root from="user">
                <Message.Content
                    >Draft a release plan for the checkout reliability fix.</Message.Content
                >
            </Message.Root>
            <Message.Root from="assistant">
                <Message.Content>
                    I’ll start with the rollout stages, owners, health checks, and rollback
                    threshold.
                </Message.Content>
            </Message.Root>
        {:else}
            <Conversation.Empty
                icon={emptyIcon}
                title="Plan the next release"
                description="Turn an issue or change set into a staged rollout with clear checks."
                action={startAction}
            />
        {/if}
    </Conversation.Content>
</Conversation.Root>
