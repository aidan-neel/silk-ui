<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import * as Select from '@sivir-ui/svelte/components/select';

    let {
        open = $bindable(false)
    }: {
        open?: boolean;
    } = $props();
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger data-testid="open-modal">Edit project</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Edit project</Modal.Title>
            <Modal.Description>Choose an owner for this project.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <Select.Root>
                <Select.Trigger>
                    <span data-testid="select-trigger">
                        <Select.Value placeholder="Select an owner" />
                    </span>
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="ada" label="Ada">
                        <span data-testid="opt-ada">Ada</span>
                    </Select.Item>
                    <Select.Item value="linus" label="Linus">
                        <span data-testid="opt-linus">Linus</span>
                    </Select.Item>
                </Select.Content>
            </Select.Root>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close data-testid="modal-cancel">Cancel</Modal.Close>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
