<script lang="ts">
	import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';

	let {
		onItem1 = () => {},
		onItem2 = () => {},
		onItem3 = () => {},
		inverted = false
	}: {
		onItem1?: () => void;
		onItem2?: () => void;
		onItem3?: () => void;
		inverted?: boolean;
	} = $props();
</script>

<DropdownMenu.Root {inverted}>
	<DropdownMenu.Trigger>
		<span data-testid="dropdown-trigger">Open menu</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Group label</DropdownMenu.Label>
		<DropdownMenu.Item callback={onItem1}>
			<span data-testid="item-1">Item one</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item callback={onItem2}>
			<span data-testid="item-2">Item two</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item callback={onItem3}>
			<span data-testid="item-3">Item three</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
