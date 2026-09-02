<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
</script>

<Modal.Root bind:open>
    <Modal.Trigger>Open modal</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
            <Modal.Description>Describe what happens here.</Modal.Description>
        </Modal.Header>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Confirm
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
