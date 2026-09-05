<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import * as Select from '@sivir-ui/svelte/components/select';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';

    let open = $state(false);
    let role = $state('editor');

    const roles = [
        { value: 'viewer', label: 'Viewer' },
        { value: 'editor', label: 'Editor' },
        { value: 'admin', label: 'Admin' }
    ];

    const selected = $derived(roles.find((option) => option.value === role));
</script>

<Modal.Root bind:open>
    <Modal.Trigger>Invite member</Modal.Trigger>
    <Modal.Content>
        <Modal.Header>
            <Modal.Title>Invite member</Modal.Title>
            <Modal.Description>Choose a role for the new member.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
            <div class="flex flex-col gap-2">
                <span class="text-sm [font-weight:var(--font-weight-label,500)] text-foreground">
                    Role
                </span>
                <Select.Root value={role}>
                    <Select.Trigger class="w-full" variant="outline" size="md">
                        {selected?.label ?? 'Select role'}
                    </Select.Trigger>
                    <Select.Content>
                        {#each roles as option (option.value)}
                            <Select.Item value={option.value} onclick={() => (role = option.value)}>
                                {option.label}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Modal.Close>
                Cancel
                <Shortcut shortcut="esc" />
            </Modal.Close>
            <Modal.Confirm>
                Invite
                <Shortcut shortcut="enter" />
            </Modal.Confirm>
        </Modal.Footer>
    </Modal.Content>
</Modal.Root>
