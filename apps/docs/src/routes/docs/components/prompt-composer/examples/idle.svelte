<script lang="ts">
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<PromptComposer.Root value="Compare the two implementation options." onSubmit={() => {}}>
    <PromptComposer.Input aria-label="Idle prompt" class="!min-h-20" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </PromptComposer.Actions>
        <PromptComposer.Submit label="Send" class="!aspect-auto !gap-1.5 !rounded-lg !px-3">
            {#snippet children()}
                Send
                <Shortcut shortcut="enter" />
            {/snippet}
        </PromptComposer.Submit>
    </PromptComposer.Toolbar>
</PromptComposer.Root>
