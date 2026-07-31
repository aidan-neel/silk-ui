<script lang="ts">
	import { untrack } from 'svelte';
	import type { ComboboxState } from '.';
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import { setComboboxContext } from './context.svelte';

	interface Props extends Popover.PopoverProps {
		placeholder?: string;
	}

	let {
		children,
		state_key,
		placeholder = 'Select…',
		open = $bindable(false),
		...rest
	}: Props = $props();

	const generatedKey = $props.id();
	const key = untrack(() => state_key ?? generatedKey);
	const comboboxState = $state<ComboboxState>({
		open: untrack(() => open),
		items: new Set(),
		results: new Set(),
		searchContent: ''
	});
	let syncedOpen = $state(untrack(() => open));
	setComboboxContext({ id: key, placeholder: untrack(() => placeholder), state: comboboxState });

	$effect(() => {
		if (comboboxState.open) comboboxState.searchContent = '';
	});
	$effect(() => {
		if (open !== syncedOpen) {
			syncedOpen = open;
			comboboxState.open = open;
		}
	});
	$effect(() => {
		if (comboboxState.open !== syncedOpen) {
			syncedOpen = comboboxState.open;
			open = comboboxState.open;
		}
	});
</script>

<Popover.Root {...rest} state_key={key} bind:open={comboboxState.open}>
	{@render children?.()}
</Popover.Root>
