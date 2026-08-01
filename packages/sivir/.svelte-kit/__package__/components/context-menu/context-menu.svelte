<script lang="ts">
	import * as Popover from '@sivir-ui/svelte/components/popover';
	import type { ContextMenuProps, ContextMenuState } from '.';
	import { setContextMenuContext } from './context.svelte';

	const id = $props.id();
	const contextMenuState = $state<ContextMenuState>({
		open: false,
		checkboxItems: new Map()
	});
	setContextMenuContext({ state: contextMenuState, ancestors: [] });

	let { children }: ContextMenuProps = $props();
</script>

<Popover.Root state_key={id} bind:open={contextMenuState.open}>
	{@render children?.()}
</Popover.Root>
