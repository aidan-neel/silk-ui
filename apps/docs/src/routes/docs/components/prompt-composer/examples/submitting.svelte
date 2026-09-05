<script lang="ts">
    import Square from '@lucide/svelte/icons/square';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<PromptComposer.Root
    value="Checking the deployment plan..."
    status="submitting"
    onSubmit={() => {}}
    onStop={() => {}}
>
    <PromptComposer.Input aria-label="Submitting prompt" class="!min-h-20" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </PromptComposer.Actions>
        <PromptComposer.Submit label="Send" class="!aspect-auto !gap-1.5 !rounded-lg !px-3 text-xs">
            {#snippet children({ action })}
                {#if action === 'stop'}
                    <Square size={8} fill="currentColor" aria-hidden="true" />
                    Stop
                {:else}
                    Send
                    <Shortcut shortcut="enter" />
                {/if}
            {/snippet}
        </PromptComposer.Submit>
    </PromptComposer.Toolbar>
</PromptComposer.Root>
