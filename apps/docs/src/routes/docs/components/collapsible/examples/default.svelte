<script lang="ts">
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    let open = $state(false);
</script>

<div class="w-full max-w-md">
    <Collapsible.Root bind:open>
        <Collapsible.Trigger>Open panel</Collapsible.Trigger>
        <Collapsible.Content
            >This content is revealed when the trigger is clicked.</Collapsible.Content
        >
    </Collapsible.Root>
</div>
