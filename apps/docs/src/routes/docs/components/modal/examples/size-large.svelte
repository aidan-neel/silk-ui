<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let open = $state(false);
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger variant="outline">Open large modal</Modal.Trigger>
    <Modal.Content size="lg">
        <Modal.Header>
            <Modal.Title>Review your workspace</Modal.Title>
            <Modal.Description>
                Use a larger surface when the modal needs room for supporting details or multiple
                controls.
            </Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <p class="text-sm text-foreground-muted">
                Invite teammates, configure permissions, and review workspace settings in one place.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm>Save changes</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
