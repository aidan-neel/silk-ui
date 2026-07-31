<script lang="ts">
	import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
	import Star from '@lucide/svelte/icons/star';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger variant="ghost" class="h-9 gap-1.5 text-[0.82rem]">
		<Star size={13} />
		Most starred
		<ChevronDown size={11} class="text-foreground-muted" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[12rem]">
		<DropdownMenu.Item>
			<span>Most starred</span>
			<Check size={12} class="text-primary" />
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span>Recently updated</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span>Alphabetical</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span>Oldest first</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
