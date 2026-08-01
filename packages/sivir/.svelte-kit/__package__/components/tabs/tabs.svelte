<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import type { TabsProps, TabsVariant } from '.';

	let {
		children,
		class: className,
		value = $bindable(''),
		orientation = 'horizontal',
		variant = 'default',
		...rest
	}: TabsProps = $props();

	/**
	 * Seeded from the props so the very first (SSR) render is already correct,
	 * rather than starting on the defaults and waiting for the effects below to
	 * sync after hydration.
	 */
	const tabsState = $state({
		id: `tabs-${Math.random().toString(36).slice(2)}`,
		value: value ?? '',

		orientation: untrack(() => orientation),
		variant: untrack(() => variant)
	} as {
		id: string;
		value: string;
		orientation: 'horizontal' | 'vertical';
		variant: TabsVariant;
	});

	setContext('tabs', tabsState);

	let syncedValue = $state(untrack(() => value ?? ''));

	$effect(() => {
		tabsState.orientation = orientation;
	});

	$effect(() => {
		tabsState.variant = variant;
	});

	$effect(() => {
		const nextValue = value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			tabsState.value = nextValue;
		}
	});

	$effect(() => {
		const nextValue = tabsState.value ?? '';
		if (nextValue !== syncedValue) {
			syncedValue = nextValue;
			value = nextValue;
		}
	});
</script>

<div
	class={className}
	data-ui="tabs"
	data-orientation={orientation}
	data-variant={variant}
	{...rest}
>
	{@render children?.()}
</div>
