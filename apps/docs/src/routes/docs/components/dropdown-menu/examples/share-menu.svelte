<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import EyeOff from '@lucide/svelte/icons/eye-off';
    import Copy2 from '@lucide/svelte/icons/files';
    import Send from '@lucide/svelte/icons/send';
    import User from '@lucide/svelte/icons/user';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger variant="outline" class="h-9 gap-1.5 text-[0.82rem]">
        <Send size={13} />
        Share
        <ChevronDown size={11} class="text-foreground-muted" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-[14rem]">
        <DropdownMenu.Label>Workspace</DropdownMenu.Label>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><User size={13} /> Invite collaborator</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Copy2 size={13} /> Copy link</span>
            <Shortcut shortcut="shift+cmd+C" />
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Public</DropdownMenu.Label>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><EyeOff size={13} /> Make private</span>
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
