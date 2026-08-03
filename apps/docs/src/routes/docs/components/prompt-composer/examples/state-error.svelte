<script lang="ts">
    import { onMount } from 'svelte';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';

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
    <PromptComposer.Input aria-label="Error prompt" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </PromptComposer.Actions>
        <PromptComposer.Submit />
    </PromptComposer.Toolbar>
</PromptComposer.Root>
