<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state(['svelte', 'sivir']);
    let notice = $state('');
</script>

<div class="w-full max-w-md space-y-2">
    <TagInput.Root
        bind:tags
        max={5}
        label="Labels"
        description="Up to 5 labels."
        onAdd={() => {
            notice = '';
        }}
        onRemove={() => {
            notice = '';
        }}
        onReject={(rejection) => {
            notice = rejection.reason;
        }}
    >
        <TagInput.List />
        <TagInput.Input placeholder="Add a label…" />
    </TagInput.Root>

    {#if notice}
        <p class="text-sm text-foreground-muted">{notice}</p>
    {/if}
</div>
