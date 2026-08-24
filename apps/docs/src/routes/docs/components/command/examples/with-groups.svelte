<script lang="ts">
    import Plus from '@lucide/svelte/icons/plus';
    import Search from '@lucide/svelte/icons/search';
    import Settings from '@lucide/svelte/icons/settings';
    import Users from '@lucide/svelte/icons/users';
    import * as Command from '@sivir-ui/svelte/components/command';
</script>

<div class="flex items-center justify-center">
    <Command.Root>
        <Command.Trigger>
            <Search size={14} />
            Open palette
        </Command.Trigger>
        <Command.Content>
            <Command.Search placeholder="Search..." />
            <Command.Results>
                <Command.Group heading="Actions">
                    <Command.Item name="New project">
                        <Plus size={14} />
                        New project
                    </Command.Item>
                    <Command.Item name="Settings">
                        <Settings size={14} />
                        Settings
                    </Command.Item>
                </Command.Group>
                <Command.Group heading="Users">
                    <Command.Item name="Team">
                        <Users size={14} />
                        Team
                    </Command.Item>
                </Command.Group>
            </Command.Results>
        </Command.Content>
    </Command.Root>
</div>
