<script lang="ts">
	import { untrack } from 'svelte';
	import type { CollapsibleProps, CollapsibleState } from '.';
	import { setCollapsibleContext } from './context.svelte';

	let { open = $bindable(false), children, disabled = false }: CollapsibleProps = $props();

	const id = $props.id();
	const collapsibleState = $state<CollapsibleState>({
		open: untrack(() => open),
		disabled: untrack(() => disabled)
	});
	let synced = $state(untrack(() => open));

	$effect(() => {
		if (open !== synced) {
			synced = open;
			collapsibleState.open = open;
		}
	});
	$effect(() => {
		if (collapsibleState.open !== synced) {
			synced = collapsibleState.open;
			open = collapsibleState.open;
		}
	});
	$effect(() => {
		collapsibleState.disabled = disabled;
	});

	setCollapsibleContext({ id, state: collapsibleState });
</script>

{@render children?.()}
