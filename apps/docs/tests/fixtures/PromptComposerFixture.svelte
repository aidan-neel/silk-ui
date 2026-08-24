<script lang="ts">
    import type { PromptComposerStatus } from '@sivir-ui/svelte/components/prompt-composer';
    import * as PromptComposer from '@sivir-ui/svelte/components/prompt-composer';

    let {
        value = $bindable(''),
        status = 'idle',
        asyncSubmit = false
    }: { value?: string; status?: PromptComposerStatus; asyncSubmit?: boolean } = $props();

    let submitCount = $state(0);
    let stopCount = $state(0);
    let settle: (() => void) | undefined;

    async function submit() {
        submitCount += 1;
        if (!asyncSubmit) return;

        await new Promise<void>((resolve) => {
            settle = resolve;
        });
        settle = undefined;
    }

    function resolveSubmission() {
        const resolve = settle;
        settle = undefined;
        resolve?.();
    }
</script>

<PromptComposer.Root bind:value {status} onSubmit={submit} onStop={() => (stopCount += 1)}>
    <PromptComposer.Input aria-label="Prompt" />
    <PromptComposer.Toolbar>
        <PromptComposer.Actions />
        <PromptComposer.Submit />
    </PromptComposer.Toolbar>
</PromptComposer.Root>

<p data-testid="composer-value">{value}</p>
<p data-testid="submit-count">{submitCount}</p>
<p data-testid="stop-count">{stopCount}</p>
<button type="button" onclick={resolveSubmission}>Resolve submission</button>
