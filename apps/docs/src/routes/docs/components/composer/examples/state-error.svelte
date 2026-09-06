<script lang="ts">
    import * as Composer from '@sivir-ui/svelte/components/composer';
    import { onMount } from 'svelte';

    let status = $state<'idle' | 'error'>('idle');

    onMount(() => {
        const frame = requestAnimationFrame(() => {
            status = 'error';
        });

        return () => cancelAnimationFrame(frame);
    });
</script>

<Composer.Root
    value="Summarize the incident timeline."
    {status}
    onSubmit={() => {}}
    onStop={() => {}}
>
    <Composer.Input aria-label="Error prompt" />
    <Composer.Toolbar>
        <Composer.Actions>
            <span class="px-2 text-xs text-foreground-muted">Sivir 3.1</span>
        </Composer.Actions>
        <Composer.Submit />
    </Composer.Toolbar>
</Composer.Root>
