<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let {
        outerOpen = $bindable(false),
        innerOpen = $bindable(false)
    }: {
        outerOpen?: boolean;
        innerOpen?: boolean;
    } = $props();
</script>

<Modal.Root bind:open={outerOpen} orientation="vertical">
    <Modal.Trigger data-testid="open-outer">Edit project</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Edit project</Modal.Title>
            <Modal.Description>Change the name, or transfer this project.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <Modal.Root bind:open={innerOpen} orientation="vertical">
                <Modal.Trigger data-testid="open-inner" variant="outline">
                    Transfer ownership
                </Modal.Trigger>
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>Transfer ownership</Modal.Title>
                        <Modal.Description>The new owner gets full control.</Modal.Description>
                    </Modal.Header>
                    <Modal.Footer>
                        <Modal.Close data-testid="inner-cancel">Cancel</Modal.Close>
                        <Modal.Confirm data-testid="inner-confirm">Transfer</Modal.Confirm>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close data-testid="outer-cancel">Cancel</Modal.Close>
            <Modal.Confirm data-testid="outer-confirm">Save</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
