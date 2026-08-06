<script lang="ts">
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';
</script>

<PromptComposer.Root
    value="Checking the deployment plan..."
    status="submitting"
    onSubmit={() => {}}
    onStop={() => {}}
>
    <PromptComposer.Input aria-label="Submitting prompt" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </PromptComposer.Actions>
        <PromptComposer.Submit />
    </PromptComposer.Toolbar>
</PromptComposer.Root>
