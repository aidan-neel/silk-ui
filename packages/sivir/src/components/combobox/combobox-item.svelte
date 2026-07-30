<script lang="ts">
	import { Button, type ButtonProps } from '@sivir/ui/components/button';
	import { cn } from '@sivir/ui/utils';
	import { onMount } from 'svelte';
	import Check from '@lucide/svelte/icons/check';

	import type { ComboboxItem } from '.';
	import { getComboboxContext } from './context.svelte';
	import { getPopoverContext } from '../popover/context.svelte';

	const { id, state: comboboxState } = getComboboxContext();
	const { state: popoverState } = getPopoverContext();

	type Props = {
		class?: string;
		value: string;
		label: string;
		callback?: () => void;
	} & ButtonProps;

	let { label, value, class: className, callback, ...rest }: Props = $props();
	let el = $state<HTMLButtonElement | HTMLAnchorElement | undefined>();
	let item: ComboboxItem = $derived({
		value: value,
		label: label,
		callback: callback,
		ref: el
	}) as ComboboxItem;

	function close() {
		comboboxState.selected = item;
		comboboxState.open = false;
		comboboxState.searchContent = '';
		popoverState.buttonRef?.focus();
		callback?.();
	}

	onMount(() => {
		comboboxState.items.add(item);
		return () => comboboxState.items.delete(item);
	});
</script>

{#if comboboxState.searchContent === '' || Array.from(comboboxState.results).some((r) => r.value === item.value)}
	<Button
		bind:element={el}
		id={`combobox-${id}-option-${value}`}
		role="option"
		aria-selected={comboboxState.selected?.value === item.value}
		{...rest}
		onclick={close}
		class={cn(className, 'sivir-menu-item')}
		unstyled
	>
		{label}
		{#if comboboxState.selected?.value === item.value}
			<div aria-hidden="true">
				<Check />
			</div>
		{/if}
	</Button>
{/if}
