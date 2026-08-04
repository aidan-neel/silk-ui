<script lang="ts">
import * as Conversation from '@sivir-ui/svelte/components/conversation';

let {
    follow = $bindable(true),
    empty = false,
    label = 'Agent conversation'
}: { follow?: boolean; empty?: boolean; label?: string } = $props();
</script>

<Conversation.Root bind:follow>
    <Conversation.Content aria-label={label}>
        {#if empty}
            <Conversation.Empty />
        {:else}
            <p>Most recent response</p>
        {/if}
    </Conversation.Content>
    <Conversation.ScrollButton />
</Conversation.Root>
