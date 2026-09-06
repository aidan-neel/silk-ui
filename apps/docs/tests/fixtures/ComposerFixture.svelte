<script lang="ts">
    import type { ComposerStatus } from '@sivir-ui/svelte/components/composer';
    import * as Composer from '@sivir-ui/svelte/components/composer';

    let {
        value = $bindable(''),
        status = 'idle',
        asyncSubmit = false
    }: { value?: string; status?: ComposerStatus; asyncSubmit?: boolean } = $props();

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

<Composer.Root bind:value {status} onSubmit={submit} onStop={() => (stopCount += 1)}>
    <Composer.Input aria-label="Prompt" />
    <Composer.Toolbar>
        <Composer.Actions />
        <Composer.Submit />
    </Composer.Toolbar>
</Composer.Root>

<p data-testid="composer-value">{value}</p>
<p data-testid="submit-count">{submitCount}</p>
<p data-testid="stop-count">{stopCount}</p>
<button type="button" onclick={resolveSubmission}>Resolve submission</button>
