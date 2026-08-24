<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import HelpCircle from '@lucide/svelte/icons/circle-help';
    import CreditCard from '@lucide/svelte/icons/credit-card';
    import Folder from '@lucide/svelte/icons/folder-git-2';
    import LogOut from '@lucide/svelte/icons/log-out';
    import Settings from '@lucide/svelte/icons/settings';
    import User from '@lucide/svelte/icons/user';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger variant="outline" class="h-9 gap-1.5 text-[0.82rem]">
        <User size={13} />
        Aidan
        <ChevronDown size={11} class="text-foreground-muted" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-[14rem]">
        <DropdownMenu.Label>Account</DropdownMenu.Label>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><User size={13} /> Profile</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Folder size={13} /> Your projects</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><CreditCard size={13} /> Billing</span>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Label>Settings</DropdownMenu.Label>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><Settings size={13} /> Preferences</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><HelpCircle size={13} /> Help &amp; support</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
            <span class="flex items-center gap-2"><LogOut size={13} /> Log out</span>
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
