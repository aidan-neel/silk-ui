<script lang="ts">
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let open = $state(false);
    let domain = $state('');
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger>Add Domain</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Add a domain</Modal.Title>
            <Modal.Description>Add an existing domain to your sivir-ui project.</Modal.Description>
        </Modal.Header>
        <Modal.Body class="gap-4">
            <Input
                bind:value={domain}
                label="Domain"
                placeholder="example.com"
                description="We'll guide you through DNS configuration next."
            />
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm>Add</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
