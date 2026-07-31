<script lang="ts">
	import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
	import Shortcut from '@sivir-ui/svelte/components/shortcut';
	import User from '@lucide/svelte/icons/user';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger variant="outline">
		My Account
		<ChevronDown size={16} class="text-foreground-muted" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[16rem]">
		<DropdownMenu.Label>
			<span class="text-[0.7rem] text-foreground-muted">aidan@sivir.dev</span>
		</DropdownMenu.Label>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><User size={13} /> Profile</span>
			<Shortcut shortcut="shift+cmd+P" />
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><CreditCard size={13} /> Billing</span>
			<Shortcut shortcut="cmd+B" />
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Settings size={13} /> Settings</span>
			<Shortcut shortcut="cmd+," />
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><LifeBuoy size={13} /> Help & feedback</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2 text-[var(--color-error)]">
				<LogOut size={13} /> Sign out
			</span>
			<Shortcut shortcut="shift+cmd+Q" />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
