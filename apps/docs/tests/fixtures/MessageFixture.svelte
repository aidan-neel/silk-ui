<script lang="ts">
    import type { MessageFrom, MessageStatus } from '@sivir-ui/svelte/components/message';
    import * as Message from '@sivir-ui/svelte/components/message';

    let { from = 'assistant', status = 'idle' }: { from?: MessageFrom; status?: MessageStatus } =
        $props();
</script>

<Message.Root {from} {status} name="Sivir" timestamp="14:32">
    <Message.Content>Deployment analysis complete.</Message.Content>
    <Message.Actions aria-label="Response actions">
        <button type="button">Copy response</button>
    </Message.Actions>
</Message.Root>
