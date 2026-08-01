<script lang="ts">
	import type { SheetState, SheetProps } from '.';
	import { setSheetContext } from './context.svelte';

	let { open = $bindable(false), children }: SheetProps = $props();

	const id = $props.id();
	const sheetState = $state<SheetState>({
		open,
		triggerRef: null
	});
	let syncedOpen = $state(open);
	setSheetContext({ id, state: sheetState });

	$effect(() => {
		if (open !== syncedOpen) {
			syncedOpen = open;
			sheetState.open = open;
		}
	});

	$effect(() => {
		if (sheetState.open !== syncedOpen) {
			syncedOpen = sheetState.open;
			open = sheetState.open;
		}
	});
</script>

{@render children?.()}
