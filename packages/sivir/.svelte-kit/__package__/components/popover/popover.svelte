<script lang="ts">
	import { onDestroy, onMount, untrack } from 'svelte';
	import type { PopoverProps, PopoverState } from '.';
	import { setPopoverContext } from './context.svelte';

	let {
		open = $bindable(false),
		placement = 'bottom',
		children,
		state_key,
		hoverable,
		delay = 0,
		closeDelay = 150
	}: PopoverProps = $props();

	const generatedKey = $props.id();
	const initial = untrack(() => ({
		key: state_key ?? generatedKey,
		placement,
		hoverable: hoverable ?? false,
		delay,
		closeDelay
	}));
	const popoverState = $state<PopoverState>({
		open,
		trigger: null,
		focusedElement: null,
		buttonRef: null,
		popoverRef: undefined,
		placement: initial.placement,
		onclick: undefined,
		closeTimeout: undefined,
		hoverable: initial.hoverable,
		delay: initial.delay,
		closeDelay: initial.closeDelay
	});
	const key = initial.key;
	let syncedOpen = $state(open);

	setPopoverContext({ id: key, state: popoverState });

	onMount(() => {
		popoverState.placement = placement;
		popoverState.hoverable = hoverable ?? false;
		popoverState.delay = delay;
		popoverState.closeDelay = closeDelay;
	});

	$effect(() => {
		popoverState.placement = placement;
		popoverState.hoverable = hoverable ?? false;
		popoverState.delay = delay;
		popoverState.closeDelay = closeDelay;
		if (open !== syncedOpen) {
			syncedOpen = open;
			popoverState.open = open;
		}
	});

	$effect(() => {
		if (popoverState.open !== syncedOpen) {
			syncedOpen = popoverState.open;
			open = popoverState.open;
		}
	});

	onDestroy(() => {
		if (popoverState.closeTimeout) clearTimeout(popoverState.closeTimeout);
		if (popoverState.hoverTimeout) clearTimeout(popoverState.hoverTimeout);
	});
</script>

{@render children?.()}
