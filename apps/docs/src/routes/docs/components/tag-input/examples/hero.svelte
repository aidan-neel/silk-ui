<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';

    let tags = $state(['svelte', 'design-system']);
</script>

<div class="w-full max-w-md space-y-4">
    <TagInput.Root bind:tags label="Topics" description="Type a topic and press Enter.">
        <TagInput.List />
        <TagInput.Input placeholder="Add a topic…" />
    </TagInput.Root>

    <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-foreground-muted">{tags.length} topics</p>
        <div class="flex gap-2">
            <Button
                variant="ghost"
                size="md"
                onclick={() => {
                    tags = [];
                }}
            >
                Clear
            </Button>
            <Button size="md">Save</Button>
        </div>
    </div>
</div>
