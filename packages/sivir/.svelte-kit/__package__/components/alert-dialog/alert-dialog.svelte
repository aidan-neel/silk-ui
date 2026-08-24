<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import type { AlertDialogProps } from '.';

    let {
        open = $bindable(false),
        error = false,
        orientation = 'vertical',
        children
    }: AlertDialogProps = $props();
</script>

<Modal.Root bind:open {error} {orientation}> {@render children?.()} </Modal.Root>
