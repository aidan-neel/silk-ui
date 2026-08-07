<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let open = $state(false);
</script>

<Modal.Root bind:open>
    <Modal.Trigger>Open modal</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <div class="flex flex-col gap-1.5">
                <Modal.Title>Modal title</Modal.Title>
                <Modal.Description>Describe what happens here.</Modal.Description>
            </div>
        </Modal.Header>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm>Confirm</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
