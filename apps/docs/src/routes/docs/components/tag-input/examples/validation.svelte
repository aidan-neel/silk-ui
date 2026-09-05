<script lang="ts">
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state<string[]>([]);
    let error = $state('');

    function validate(tag: string) {
        if (tag !== tag.toLowerCase()) {
            return 'Use lowercase letters.';
        }

        if (tag.includes(' ')) {
            return 'Use hyphens instead of spaces.';
        }

        return tag.length >= 2 || 'Tags need at least 2 characters.';
    }
</script>

<div class="w-full max-w-md">
    <TagInput.Root
        bind:tags
        {validate}
        {error}
        label="Slugs"
        description="Lowercase slugs, no spaces — try “Release Notes”."
        onAdd={() => {
            error = '';
        }}
        onReject={(rejection) => {
            error = rejection.reason;
        }}
    >
        <TagInput.List />
        <TagInput.Input placeholder="e.g. release-notes" />
    </TagInput.Root>
</div>
