<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import * as Popover from '@sivir-ui/svelte/components/popover';

    let {
        modalOpen = $bindable(false),
        popoverOpen = $bindable(false)
    }: {
        modalOpen?: boolean;
        popoverOpen?: boolean;
    } = $props();
</script>

<button data-testid="open-modal" onclick={() => (modalOpen = true)}>Open modal</button>
<button data-testid="open-popover" onclick={() => (popoverOpen = true)}>Open popover</button>

<!-- Sibling layers: the lock must stack across independent overlays. -->
<Popover.Root bind:open={popoverOpen}>
    <Popover.Trigger>
        <span data-testid="popover-trigger">Popover trigger</span>
    </Popover.Trigger>
    <Popover.Content>
        <p data-testid="popover-body">Sibling popover body</p>
        <button data-testid="inside-popover">Inside popover</button>
    </Popover.Content>
</Popover.Root>

<Modal.Root bind:open={modalOpen}>
    <Modal.Content>
        <Modal.Title>Sibling modal</Modal.Title>
        <Modal.Body>
            <button data-testid="close-modal" onclick={() => (modalOpen = false)}
                >Close modal</button
            >
        </Modal.Body>
    </Modal.Content>
</Modal.Root>
