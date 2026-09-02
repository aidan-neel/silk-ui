<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import type { AlertDialogProps } from '.';

    let {
        open = $bindable(false),
        onOpenChange,
        error = false,
        orientation = 'vertical',
        children
    }: AlertDialogProps = $props();
</script>

<Modal.Root bind:open {onOpenChange} {error} {orientation}> {@render children?.()} </Modal.Root>
