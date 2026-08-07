<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let {
        open = $bindable(false),
        allowClickOutside = true,
        error = false,
        orientation = 'horizontal' as 'horizontal' | 'vertical',
        role = 'dialog' as 'dialog' | 'alertdialog'
    } = $props();
</script>

<button type="button" data-testid="trigger" onclick={() => (open = true)}>Open</button>

<Modal.Root bind:open {error} {orientation}>
    <Modal.Content {allowClickOutside} {role}>
        <Modal.Header>
            <div class="flex flex-col gap-1.5">
                <Modal.Title>Modal Title</Modal.Title>
                <Modal.Description>Modal Description</Modal.Description>
            </div>
        </Modal.Header>
        <Modal.Body>
            <button type="button" data-testid="inside-1">Inside one</button>
            <button type="button" data-testid="inside-2">Inside two</button>
        </Modal.Body>
        <Modal.Close onclick={() => (open = false)}>Close</Modal.Close>
        <Modal.Confirm onclick={() => (open = false)}>Confirm</Modal.Confirm>
    </Modal.Content>
</Modal.Root>
