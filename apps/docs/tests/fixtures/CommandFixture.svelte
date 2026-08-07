<script lang="ts">
    import * as Command from '@sivir-ui/svelte/components/command';

    let {
        open = $bindable(false),
        allowClickOutside = true,
        onProfile = () => {},
        onSettings = () => {},
        onDisabled = () => {},
        onLogout = () => {}
    }: {
        open?: boolean;
        allowClickOutside?: boolean;
        onProfile?: () => void;
        onSettings?: () => void;
        onDisabled?: () => void;
        onLogout?: () => void;
    } = $props();
</script>

<button type="button" data-testid="command-external-trigger" onclick={() => (open = true)}>
    Open externally
</button>
<output data-testid="command-open-state">{String(open)}</output>

<Command.Root bind:open>
    <Command.Trigger>
        <span data-testid="command-trigger">Open command</span>
    </Command.Trigger>
    <Command.Content {allowClickOutside}>
        <Command.Search placeholder="Search commands" />
        <Command.Results>
            <Command.Group heading="Account">
                <Command.Item name="profile" callback={onProfile}>
                    <span data-testid="cmd-profile">Profile</span>
                </Command.Item>
                <Command.Item name="settings" callback={onSettings}>
                    <span data-testid="cmd-settings">Settings</span>
                </Command.Item>
                <Command.Item name="disabled" callback={onDisabled} disabled>
                    <span data-testid="cmd-disabled">Disabled</span>
                </Command.Item>
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Session">
                <Command.Item name="logout" callback={onLogout}>
                    <span data-testid="cmd-logout">Logout</span>
                </Command.Item>
            </Command.Group>
        </Command.Results>
    </Command.Content>
</Command.Root>
