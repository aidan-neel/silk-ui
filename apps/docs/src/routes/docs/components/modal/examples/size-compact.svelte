<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let open = $state(false);
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger variant="outline">Open compact modal</Modal.Trigger>
    <Modal.Content size="sm">
        <Modal.Header>
            <Modal.Title>Quick action</Modal.Title>
            <Modal.Description
                >Keep short confirmations focused with the compact size.</Modal.Description
            >
        </Modal.Header>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm>Continue</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
