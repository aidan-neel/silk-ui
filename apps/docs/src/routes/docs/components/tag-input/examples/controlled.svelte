<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state(['announcements']);
    let events = $state<string[]>([]);

    function log(message: string) {
        events = [message, ...events].slice(0, 4);
    }
</script>

<div class="w-full max-w-md space-y-3">
    <TagInput.Root
        bind:tags
        label="Channels"
        description="Every change reports through callbacks."
        onAdd={(tag) => {
            log(`Added ${tag}`);
        }}
        onRemove={(tag) => {
            log(`Removed ${tag}`);
        }}
    >
        <TagInput.List />
        <TagInput.Input placeholder="Add a channel…" />
    </TagInput.Root>

    <ul aria-live="polite" class="space-y-1 text-sm text-foreground-muted">
        {#each events as event, index (index)}
            <li>{event}</li>
        {/each}
    </ul>
</div>
