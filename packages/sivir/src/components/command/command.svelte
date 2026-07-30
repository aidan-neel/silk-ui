<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import * as Modal from '@sivir/ui/components/modal';
	import type { CommandState } from '.';
	import { resetCommand, setCommandContext } from './context.svelte';

	let {
		open = $bindable(false),
		children
	}: {
		open?: boolean;
		children?: Snippet;
	} = $props();
	const id = $props.id();

	const command = $state<CommandState>({
		id,
		items: [],
		results: [],
		searchContent: '',
		activeId: undefined,
		itemsVersion: 0
	});
	setCommandContext(command);

	$effect(() => {
		if (open) untrack(() => resetCommand(command));
	});
</script>

<Modal.Root bind:open>
	{@render children?.()}
</Modal.Root>
