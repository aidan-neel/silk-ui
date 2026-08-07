<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';

    let open = $state(false);
</script>

<Modal.Root bind:open orientation="horizontal">
    <Modal.Trigger variant="outline">Open wide modal</Modal.Trigger>
    <Modal.Content size="xl">
        <Modal.Header>
            <Modal.Title>Import project data</Modal.Title>
            <Modal.Description>
                Wide modals work well for previews, tables, and other content that benefits from
                horizontal space.
            </Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-[var(--radius-md)] border border-border bg-secondary p-4">
                    <p class="font-medium text-foreground">Repositories</p>
                    <p class="mt-1 text-sm text-foreground-muted">
                        Choose which repositories to import.
                    </p>
                </div>
                <div class="rounded-[var(--radius-md)] border border-border bg-secondary p-4">
                    <p class="font-medium text-foreground">Environment</p>
                    <p class="mt-1 text-sm text-foreground-muted">
                        Set the target deployment environment.
                    </p>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Modal.Confirm>Import</Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
