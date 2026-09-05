<script lang="ts">
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { onMount } from 'svelte';

    let status = $state<'idle' | 'error'>('idle');

    onMount(() => {
        const frame = requestAnimationFrame(() => {
            status = 'error';
        });

        return () => cancelAnimationFrame(frame);
    });
</script>

<PromptComposer.Root
    value="Summarize the incident timeline."
    {status}
    onSubmit={() => {}}
    onStop={() => {}}
>
    <PromptComposer.Input aria-label="Error prompt" class="!min-h-20" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </PromptComposer.Actions>
        <PromptComposer.Submit label="Send" class="!aspect-auto !gap-1.5 !rounded-lg !px-3 text-xs">
            {#snippet children()}
                Send
                <Shortcut shortcut="enter" />
            {/snippet}
        </PromptComposer.Submit>
    </PromptComposer.Toolbar>
</PromptComposer.Root>
