<script lang="ts">
	import * as Popover from '@sivir/ui/components/popover';
	import type { Snippet } from 'svelte';
	import { setSelectContext } from './context.svelte';

	const key = $props.id();

	type Props = {
		children: Snippet;
		value?: string;
	};

	let { children, value = $bindable('') }: Props = $props();

	/**
	 * Plain Maps and Sets live on context, never inside `$state`, so item
	 * registration can mutate them freely without invalidating reactive effects.
	 */
	const labels = new Map<string, string>();
	const values = new Set<string>();

	const selectState = $state({
		open: false,
		value: value ?? '',
		selectedLabel: ''
	});
	let syncedValue = $state(value ?? '');
	setSelectContext({ id: key, state: selectState, labels, values });

	if (value && value !== '') {
		selectState.value = value;
	}

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			selectState.value = nextValue;
			selectState.selectedLabel = nextValue ? (labels.get(nextValue) ?? '') : '';
		}
	});

	$effect(() => {
		const nextValue = selectState.value;
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			value = nextValue;
		}
	});
</script>

<Popover.Root bind:open={selectState.open} state_key={key}>
	{@render children?.()}
</Popover.Root>
