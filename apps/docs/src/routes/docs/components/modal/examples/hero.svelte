<script lang="ts">
    import Globe from '@lucide/svelte/icons/globe';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
    let domain = $state('');
</script>

<Modal.Root bind:open orientation="vertical">
    <Modal.Trigger>Add Domain</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <div class="flex items-center gap-2.5">
                <Globe size={18} class="text-foreground-muted" />
                <Modal.Title>Add a domain</Modal.Title>
            </div>
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
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Add
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
