<script lang="ts">
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Markdown } from '@sivir-ui/svelte/components/markdown';
    import * as Message from '@sivir-ui/svelte/components/message';

    let retrying = $state(false);

    const partialResponse =
        'The first two regions are healthy. I’m checking the remaining edge locations and';
</script>

<div class="w-full max-w-2xl space-y-8">
    <Message.Root from="assistant" status="streaming">
        <Message.Content>
            <Markdown content={partialResponse} streaming />
        </Message.Content>
    </Message.Root>

    <Message.Root from="assistant" status={retrying ? 'streaming' : 'error'}>
        <Message.Content>
            {#if retrying}
                <Markdown
                    content="Reconnecting to the warehouse and rebuilding the query"
                    streaming
                />
            {:else}
                <p>
                    The warehouse connection closed before the query completed. Retry when the
                    connection is available.
                </p>
            {/if}
        </Message.Content>
        {#if !retrying}
            <Message.Actions aria-label="Failed response actions">
                <Button variant="ghost" size="sm" onclick={() => (retrying = true)}>
                    <RotateCcw size={14} aria-hidden="true" />
                    Retry response
                </Button>
            </Message.Actions>
        {/if}
    </Message.Root>
</div>
