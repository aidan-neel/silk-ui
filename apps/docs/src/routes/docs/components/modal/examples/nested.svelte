<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
    let nestedOpen = $state(false);
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger>Edit project</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Edit project</Modal.Title>
            <Modal.Description>
                Change the name, or transfer this project to someone else.
            </Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <Modal.Root bind:open={nestedOpen} orientation="vertical">
                <Modal.Trigger variant="outline">Transfer ownership</Modal.Trigger>
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Transfer ownership</Modal.Title>
                        <Modal.Description>
                            The new owner gets full control. You will remain a member.
                        </Modal.Description>
                    </Modal.Header>
                    <Modal.Footer>
                        <Modal.Close>
                            Cancel
                            <Shortcut shortcut="esc" />
                        </Modal.Close>
                        <Modal.Confirm>
                            Transfer
                            <Shortcut shortcut="enter" />
                        </Modal.Confirm>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Save
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
