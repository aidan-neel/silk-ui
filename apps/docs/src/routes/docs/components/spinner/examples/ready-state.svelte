<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { onDestroy, onMount } from 'svelte';

    let ready = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function save() {
        clearTimeout(timer);
        ready = false;
        timer = setTimeout(() => {
            ready = true;
        }, 900);
    }

    onMount(save);
    onDestroy(() => clearTimeout(timer));
</script>

<div
    class="flex w-full max-w-sm items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-card px-3 py-2"
>
    <div class="flex items-center gap-2 text-sm text-foreground-muted">
        <Spinner {ready} aria-hidden="true" />
        <span>{ready ? 'Changes saved' : 'Saving changes'}</span>
    </div>
    <Button size="sm" onclick={save}>Save again</Button>
</div>
