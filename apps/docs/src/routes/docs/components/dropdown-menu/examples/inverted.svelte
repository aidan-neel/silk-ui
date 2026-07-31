<script lang="ts">
	import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
</script>

<DropdownMenu.Root inverted>
	<DropdownMenu.Trigger variant="outline" size="sm" class="gap-1.5 px-2">
		<span class="text-[0.8125rem]">Menu</span>
		<ChevronDown size={14} class="text-foreground-muted ml-0.5" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[14rem]">
		<DropdownMenu.Label>
			<span class="text-[0.7rem]">Actions</span>
		</DropdownMenu.Label>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Settings size={13} /> Settings</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><LifeBuoy size={13} /> Help</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span class="flex items-center gap-2 text-[var(--color-error)]">
				<LogOut size={13} /> Sign out
			</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
